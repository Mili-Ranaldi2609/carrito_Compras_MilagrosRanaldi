import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateFacturaDto } from '../dto/update-factura.dto';
import { Factura } from '../entities/factura.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFacturaDto } from '../dto/create-factura.dto';
import { DetallefacturasService } from 'src/modules/detallefacturas/services/detallefacturas.service';
import { UsuariosService } from 'src/modules/users/services/usuarios.service';
import { ProductosService } from 'src/modules/productos/services/productos.service';

@Injectable()
export class FacturasService {
  constructor(
    private readonly productosService: ProductosService,
    private readonly detallefacturaService: DetallefacturasService,
    private readonly usuarioService: UsuariosService,
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>

  ) { }
  //CREATE FACTURA
  async create(createFacturaDto: CreateFacturaDto): Promise<Factura> {
    const { detallesFactura, usuario, ...datosFactura } = createFacturaDto;

    if (!usuario || !usuario.id) {
      throw new BadRequestException('El ID del usuario es obligatorio');
    }

    for (const detalle of detallesFactura) {
      const producto = await this.productosService.findOne(detalle.producto.id);

      if (!producto) throw new NotFoundException(`Producto con ID ${detalle.producto.id} no encontrado`);

      if (producto.stock < detalle.cantidad) {
        throw new BadRequestException(`Stock insuficiente para el producto ${producto.nombre}`);
      }
    }

    const nuevaFactura = this.facturaRepository.create({
      ...datosFactura,
      usuario,
    });

    const facturaGuardada = await this.facturaRepository.save(nuevaFactura);

    for (const detalle of detallesFactura) {
      const producto = await this.productosService.findOne(detalle.producto.id);

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${detalle.producto.id} no encontrado`);
      }

      if (!producto.precioUnitario) {
        throw new BadRequestException(`El producto ${producto.nombre} no tiene precio asignado`);
      }

      await this.detallefacturaService.create({
        cantidad: detalle.cantidad,
        disponible: detalle.disponible,
        producto,
        factura: facturaGuardada,
        subtotal: Number(producto.precioUnitario) * detalle.cantidad,
      });
      // Actualizar el stock del producto
      await this.productosService.actualizarStockProducto(
        producto.id,
        producto.stock - detalle.cantidad
      );
    }

    const facturaActualizada = await this.facturaRepository.findOne({
      where: { id: facturaGuardada.id },
      relations: ['detallesFactura', 'detallesFactura.producto'],
    });

    if (!facturaActualizada) {
      throw new NotFoundException('Factura no encontrada desde create factura');
    }
    //se actualiza el total de la factura
    const nuevoTotal = facturaActualizada.detallesFactura
      .filter(det => det.disponible)
      .reduce((acc, det) => acc + Number(det.subtotal), 0);

    facturaActualizada.total = nuevoTotal;
    await this.facturaRepository.save(facturaActualizada);

    return facturaActualizada;
  }


  //FIND ALL FACTURAS
  async findAllByEmail(options: FacturaFilterOptions): Promise<Factura[]> {
  const { email, page = 1, limit = 10, order = 'DESC', fecha } = options;

  const user = await this.usuarioService.findOneByEmail(email);
  if (!user) throw new UnauthorizedException('Usuario no encontrado');

  const query = this.facturaRepository.createQueryBuilder('factura')
    .leftJoinAndSelect('factura.detallesFactura', 'detalles')
    .leftJoinAndSelect('detalles.producto', 'producto')
    .where('factura.usuarioId = :userId', { userId: user.id })
    .andWhere('factura.disponible = true')
    .orderBy('factura.id', order)
    .skip((page - 1) * limit)
    .take(limit);

  if (fecha) {
    query.andWhere('factura.fecha = :fecha', { fecha });
  }

  const facturas = await query.getMany();

  return facturas.map(factura => ({
    ...factura,
    detallesFactura: factura.detallesFactura.filter(det => det.disponible),
  }));
}

  //FIND FACTURA BY ID
  async findOne(id: number): Promise<Factura> {
    const factura = await this.facturaRepository.findOne({
      where: { id, disponible: true },
      relations: ['detallesFactura', 'detallesFactura.producto'],
    });
    console.log(factura);

    if (!factura) {
      throw new NotFoundException('Factura no encontrada desde findOne de Factura');
    }

    //Filtrar detalles que estén disponibles
    factura.detallesFactura = factura.detallesFactura.filter(det => det.disponible);

    return factura;
  }
  async findOneByEmail(id: number, email: string): Promise<Factura> {
  const user = await this.usuarioService.findOneByEmail(email);
  if (!user) throw new UnauthorizedException('Usuario no encontrado');

  const factura = await this.facturaRepository.createQueryBuilder('factura')
    .leftJoinAndSelect('factura.usuario', 'usuario')
    .leftJoinAndSelect('factura.detallesFactura', 'detalles')
    .leftJoinAndSelect('detalles.producto', 'producto')
    .where('factura.id = :id', { id })
    .andWhere('factura.disponible = true')
    .andWhere('usuario.id = :userId', { userId: user.id }) //validación directa
    .getOne();

  if (!factura) {
    throw new NotFoundException('Factura no encontrada o no pertenece a este usuario');
  }

  factura.detallesFactura = factura.detallesFactura.filter(det => det.disponible);
  return factura;
}

  //UPDATE FACTURA
  async update(id: number, updateFacturaDto: UpdateFacturaDto): Promise<Factura> {
    const { detallesFactura, usuario, ...datosFactura } = updateFacturaDto;

    const factura = await this.facturaRepository.findOne({
      where: { id },
      relations: ['detallesFactura'],
    });

    if (!factura) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    // Actualizar datos básicos
    Object.assign(factura, datosFactura);
    if (usuario) factura.usuario = usuario;

    const detallesActuales = factura.detallesFactura;
    const idsNuevos = detallesFactura?.map(d => d.id).filter(Boolean) || [];

    // Desactivar (borrado lógico) los detalles que ya no vienen
    for (const detalle of detallesActuales) {
      if (!idsNuevos.includes(detalle.id)) {
        await this.detallefacturaService.remove(detalle.id);
      }
    }

    //Crear o actualizar los detalles nuevos
    if (detallesFactura && detallesFactura.length > 0) {
      for (const detalle of detallesFactura) {
        const producto = await this.productosService.findOne(detalle.producto.id);
        if (!producto) throw new NotFoundException(`Producto con ID ${detalle.producto.id} no encontrado`);

        const subtotal = Number(producto.precioUnitario) * detalle.cantidad;

        if (detalle.id) {
          // Si tiene ID → es existente → actualizalo
          await this.detallefacturaService.update(detalle.id, {
            cantidad: detalle.cantidad,
            disponible: true,
            subtotal,
          });
        } else {
          // Si no tiene ID → es nuevo → crealo
          await this.detallefacturaService.create({
            cantidad: detalle.cantidad,
            disponible: true,
            producto,
            factura,
            subtotal,
          });
        }

        // Actualizar stock
        await this.productosService.actualizarStockProducto(
          producto.id,
          producto.stock - detalle.cantidad
        );
      }
    }

    //Recalcular total
    const facturaConDetalles = await this.facturaRepository.findOne({
      where: { id },
      relations: ['detallesFactura', 'detallesFactura.producto'],
    });

    if (!facturaConDetalles) {
      throw new NotFoundException('Factura no encontrada al recalcular');
    }

    facturaConDetalles.total = facturaConDetalles.detallesFactura
      .filter(det => det.disponible)
      .reduce((acc, det) => acc + Number(det.subtotal), 0);

    return this.facturaRepository.save(facturaConDetalles);
  }

  //DELETE FACTURA //Borrado lógico
  async remove(id: number): Promise<Factura> {
    const factura = await this.facturaRepository.findOne({
      where: { id },
      relations: ['detallesFactura'],// necesario para acceder a los detalles
    });

    if (!factura) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    //Eliminar (borrado lógico) todos los detalles asociados
    for (const detalle of factura.detallesFactura) {
      await this.detallefacturaService.remove(detalle.id);
    }

    // Marcar la factura como eliminada
    factura.disponible = false;

    return this.facturaRepository.save(factura);
  }

}
