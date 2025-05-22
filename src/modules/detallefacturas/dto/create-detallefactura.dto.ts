import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";
import { Factura } from "src/modules/facturas/entities/factura.entity";

import { Producto } from "src/modules/productos/entities/producto.entity";

export class CreateDetallefacturaDto {
    @ApiProperty({ example: 2, description: 'Cantidad de productos' })
    @ApiProperty({ example: true, description: 'Estado de disponibilidad' })
    @IsBoolean()
    disponible: boolean;
    @ApiProperty({ example: 2, description: 'Cantidad de productos' })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(100)
    cantidad: number;
    @ApiProperty({ type: () => Producto })
    @IsNotEmpty()
    producto: Producto;
     @IsNumber()
    @IsOptional()
    subtotal?: number;
    factura:Factura

    
}
