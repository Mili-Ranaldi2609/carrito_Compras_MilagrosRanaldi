import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';
import {  ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
    @ApiPropertyOptional({ example: true, description: 'Estado de disponibilidad' })
    disponible?: boolean;
    @ApiPropertyOptional({ example: 'Producto 1', description: 'Nombre del producto' })
    nombre?: string;
    @ApiPropertyOptional({ example: 100, description: 'Precio unitario del producto' })
    precioUnitario?: number;
    @ApiPropertyOptional({ example: 10, description: 'Stock del producto' })
    stock?: number;
    @ApiPropertyOptional({ example: 'Descripción del producto', description: 'Descripción del producto' })
    descripcion?: string;
}
