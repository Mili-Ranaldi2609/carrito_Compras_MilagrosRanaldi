import { PartialType } from '@nestjs/mapped-types';
import { CreateFacturaDto } from './create-factura.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFacturaDto extends PartialType(CreateFacturaDto) {
        @ApiPropertyOptional({ example: true, description: 'Estado de disponibilidad' })
        disponible?: boolean;
        @ApiPropertyOptional({ example: '2023-10-01', description: 'Fecha de la factura' })
        fecha?: Date;
        @ApiPropertyOptional({ example: 150.75, description: 'Total de la factura' })
        total?: number;
        @ApiPropertyOptional({ example: 'Mi Empresa S.A.', description: 'Nombre de fantasía' })
        nombreFantasia?: string;
        @ApiPropertyOptional({ example: '2023-10-01', description: 'Fecha de fundación' })
        fechaFundacion?: Date;
}
