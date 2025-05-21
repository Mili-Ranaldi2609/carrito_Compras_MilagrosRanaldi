import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Factura } from './entities/factura.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFacturaDto } from './dto/create-factura.dto';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>
  
  ) {}
  //CREATE FACTURA
   async create(createFacturaDto: CreateFacturaDto): Promise<Factura> {
    const nuevaFactura = this.facturaRepository.create(createFacturaDto);
    return this.facturaRepository.save(nuevaFactura);
  }
  //FIND ALL FACTURAS
  async findAll() : Promise<Factura[]> {
    return this.facturaRepository.find({
      relations: ['detallesFactura', 'detallesFactura.producto'],
    })}
  //FIND FACTURA BY ID
  async findOne(id: number): Promise<Factura> {
  const factura = await this.facturaRepository.findOne({
    where: { id },
    relations: ['usuario'],
  });

  if (!factura) {
    throw new NotFoundException('Factura no encontrada');
  }

  
  return factura;
}
async actualizarTotalFactura(facturaId: number): Promise<void> {
  const factura = await this.facturaRepository.findOne({
    where: { id: facturaId },
    relations: ['detallesFactura'],
  });

  if (!factura) throw new NotFoundException('Factura no encontrada');

  const nuevoTotal = factura.detallesFactura
    .filter(det => det.disponible)
    .reduce((acc, det) => acc + Number(det.subtotal), 0);

  factura.total = nuevoTotal;
  await this.facturaRepository.save(factura);
}
  //UPDATE FACTURA
  async update(id: number, updateFacturaDto: UpdateFacturaDto): Promise<Factura>{
    const factura = await this.facturaRepository.preload({id
      , ...updateFacturaDto,});
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
