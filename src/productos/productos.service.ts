import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>
  ) { }
  //CREATE PRODUCTO
  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const nuevoProducto = this.productoRepository.create(createProductoDto);
    return this.productoRepository.save(nuevoProducto);
  }
  //FIND ALL PRODUCTOS
  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }
  //FIND PRODUCTO BY ID
  async findOne(id: number) {
    const producto = this.productoRepository.findOneBy({ id })
    if (!producto) {
      throw new BadRequestException('Producto not found');
    }
    return producto;
  }
  //UPDATE PRODUCTO
  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.productoRepository.preload({
      id
      , ...updateProductoDto,
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrada`);
    }
    return this.productoRepository.save(producto);
  }
  //DELETE PRODUCTO //Borrado lógico
  async remove(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ id });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrada`);
    }
    producto.disponible = false;
    return this.productoRepository.save(producto);
  }
  //NUEVO STOCK
  async actualizarStockProducto(productoId: number, nuevoStock: number): Promise<void> {
    const producto = await this.productoRepository.findOne({
      where: { id: productoId },
    });

    if (!producto) throw new NotFoundException('Producto no encontrado desde actualizarStockProducto');

    producto.stock = nuevoStock;
    await this.productoRepository.save(producto);
  }

}