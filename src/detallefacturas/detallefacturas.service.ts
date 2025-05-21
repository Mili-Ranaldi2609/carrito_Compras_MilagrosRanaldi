import {  Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetallefacturaDto } from './dto/create-detallefactura.dto';
import { UpdateDetallefacturaDto } from './dto/update-detallefactura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Detallefactura } from './entities/detallefactura.entity';
import { Repository } from 'typeorm';
import { ProductosService } from 'src/productos/productos.service';
import { FacturasService } from 'src/facturas/facturas.service';

@Injectable()
export class DetallefacturasService {
  constructor(
    
    private readonly productosService: ProductosService,
    
    private readonly facturasService: FacturasService,
    @InjectRepository(Detallefactura)
    private readonly detallefacturaRepository: Repository<Detallefactura>,
  ) {}
 // CREATE DETALLEFACTURA con cálculo automático
  // CREATE
   async create(createDetallefacturaDto: CreateDetallefacturaDto): Promise<Detallefactura> {
  const producto = await this.productosService.findOne(createDetallefacturaDto.producto.id);

  if (!producto) {
    throw new NotFoundException(`Producto con ID ${createDetallefacturaDto.producto.id} no encontrado`);
  }

  const detalle = this.detallefacturaRepository.create({
    producto,
    cantidad: createDetallefacturaDto.cantidad,
    disponible: true,
    factura: createDetallefacturaDto.factura,
    subtotal: Number(producto.precioUnitario) * createDetallefacturaDto.cantidad,

  });

  const detalleGuardado = await this.detallefacturaRepository.save(detalle);

  await this.facturasService.actualizarTotalFactura(createDetallefacturaDto.factura.id);

  return detalleGuardado; // ← este return es obligatorio
}


  //FIND ALL DETALLEFACTURAS
  async findAll():Promise<Detallefactura[]> {
    return this.detallefacturaRepository.find({
      relations: ['factura', 'producto'],})
  }
  //FIND DETALLEFACTURA BY ID
  async findOne(id: number): Promise<Detallefactura> {
  const detalle = await this.detallefacturaRepository.findOne({
    where: { id },
    relations: ['factura', 'factura.usuario'],
  });

  if (!detalle) {
    throw new NotFoundException('Detalle no encontrado');
  }

  return detalle;
}

  //UPDATE DETALLEFACTURA
  async update(id: number, updateDetallefacturaDto: UpdateDetallefacturaDto): Promise<Detallefactura> {
    const detallefactura = await this.detallefacturaRepository.preload({id
      , ...updateDetallefacturaDto,});
    if (!detallefactura) {
       throw new NotFoundException(`Detallefactura con ID ${id} no encontrada`);
    }
    return this.detallefacturaRepository.save(detallefactura);
  }
  //DELETE DETALLEFACTURA //Borrado lógico
  async remove(id: number): Promise<Detallefactura> {
  const detallefactura = await this.detallefacturaRepository.findOneBy({ id });

  if (!detallefactura) {
    throw new NotFoundException(`Detallefactura con ID ${id} no encontrada`);
  }

  detallefactura.disponible = false; // Borrado lógico
  return this.detallefacturaRepository.save(detallefactura); 
}
}
