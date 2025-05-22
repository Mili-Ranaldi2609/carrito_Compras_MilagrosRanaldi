import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateProductoDto {
    @ApiProperty({ example: true, description: 'Estado de disponibilidad' })
    @IsBoolean()
    @IsNotEmpty()
    disponible: boolean;
    @ApiProperty({example: 'Producto 1', description: 'Nombre del producto' })
    @IsString()
    @IsNotEmpty()
    @Length(3, 50)
    nombre: string;
    @ApiProperty({example: 100, description: 'Precio unitario del producto' })
    @IsNumber()
    @IsNotEmpty()
    precioUnitario: number;
    @ApiProperty({ example: 10, description: 'Stock del producto' })
    @IsInt()
    @IsNotEmpty()
    stock: number;
    @ApiProperty({ example: 'Descripción del producto', description: 'Descripción del producto' })
    @IsNotEmpty()
    @IsString()
    descripcion: string;
}
