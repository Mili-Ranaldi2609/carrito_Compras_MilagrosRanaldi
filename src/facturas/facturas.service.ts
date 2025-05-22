import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Factura } from './entities/factura.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { ProductosService } from 'src/productos/productos.service';
import { DetallefacturasService } from 'src/detallefacturas/detallefacturas.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';

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
    const producto = await this.productosService.findOne(detalle.producto.id );

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
  async findAll(): Promise<Factura[]> {
    return this.facturaRepository.find({
      relations: ['detallesFactura', 'detallesFactura.producto'],
    })
  }
  //FIND FACTURA BY ID
  async findOne(id: number): Promise<Factura> {
    const factura = await this.facturaRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    console.log(factura);

    if (!factura) {
      throw new NotFoundException('Factura no encontrada desde findOne de Factura');
    }


    return factura;
  }
  
  //UPDATE FACTURA
  async update(id: number, updateFacturaDto: UpdateFacturaDto): Promise<Factura> {
    const factura = await this.facturaRepository.preload({
      id
      , ...updateFacturaDto,
    });
    if (!factura) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }
    return this.facturaRepository.save(factura);
  }


  //DELETE FACTURA //Borrado lógico
  async remove(id: number): Promise<Factura> {
    const factura = await this.facturaRepository.findOneBy({ id });

    if (!factura) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }
    factura.disponible = false;
    return this.facturaRepository.save(factura);
  }

}
