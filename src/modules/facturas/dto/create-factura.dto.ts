import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Detallefactura } from "src/modules/detallefacturas/entities/detallefactura.entity";
import { Usuario } from "src/modules/users/entities/usuario.entity";

export class CreateFacturaDto {
    @ApiProperty({ example: true, description: 'Estado de disponibilidad' })
    @IsBoolean()
    @IsNotEmpty()
    disponible: boolean;
    @ApiProperty({ example: '2023-10-01', description: 'Fecha de la factura' })
    @IsNotEmpty()
    @IsDateString()
    fecha: Date;
    @ApiProperty({ example: 150.75, description: 'Total de la factura' })
    @IsNotEmpty()
    @IsNumber()
    total: number;
    @ApiProperty({ example: 'Mi Empresa S.A.', description: 'Nombre de fantasía' })
    @IsString()
    nombreFantasia: string;
    @ApiProperty({ example: '2023-10-01', description: 'Fecha de fundación' })
    @IsDateString()
    @IsNotEmpty()
    fechaFundacion: Date;
    @ApiProperty({ type: () => Detallefactura, isArray: true })
    @IsArray()
    detallesFactura: Detallefactura[];
    @ApiProperty({ type: () => Usuario })
    @IsNotEmpty()
    usuario: Usuario;
   
}
