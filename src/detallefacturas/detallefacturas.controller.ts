import { Controller, Get,Param,  ParseIntPipe, UseGuards } from '@nestjs/common';
import { DetallefacturasService } from './detallefacturas.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';



@Controller('detallefacturas')
@ApiTags('detallefacturas')
export class DetallefacturasController {
  constructor(private readonly detallefacturasService: DetallefacturasService) { }


  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all detalles facturas' })
  @ApiResponse({ status: 200, description: 'Get all detalles facturas' })
  @ApiResponse({ status: 404, description: 'Forbidden' })
  findAll() {
    return this.detallefacturasService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener DetalleFactura por ID' })
  @ApiParam({ name: 'id', description: 'ID del DetalleFactura', required: true })
  @ApiResponse({ status: 200, description: 'DetalleFactura encontrado correctamente' })
  @ApiResponse({ status: 404, description: 'DetalleFactura no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
  return this.detallefacturasService.findOne(id);
}
}
