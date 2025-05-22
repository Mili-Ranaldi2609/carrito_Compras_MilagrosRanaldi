import { PartialType } from '@nestjs/mapped-types';
import { CreateDetallefacturaDto } from './create-detallefactura.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDetallefacturaDto extends PartialType(CreateDetallefacturaDto) {

    @ApiPropertyOptional({ example: true, description: 'Estado del detalle (activo o no)' })
  disponible?: boolean;

  @ApiPropertyOptional({ example: 150.75, description: 'Subtotal del detalle' })
  subtotal?: number;

  @ApiPropertyOptional({ example: 3, description: 'Cantidad de productos' })
  cantidad?: number;
}


