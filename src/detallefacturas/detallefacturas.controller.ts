import { Controller, Get, Post, Body,  Param, Delete, Put, ParseIntPipe, UseGuards } from '@nestjs/common';
import { DetallefacturasService } from './detallefacturas.service';
import { CreateDetallefacturaDto } from './dto/create-detallefactura.dto';
import { UpdateDetallefacturaDto } from './dto/update-detallefactura.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';



@Controller('detallefacturas')
@ApiTags('detallefacturas')
export class DetallefacturasController {
  constructor(private readonly detallefacturasService: DetallefacturasService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo detalle de factura' })
  @ApiResponse({ status: 201, description: 'DetalleFactura creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateDetallefacturaDto })
  create(@Body() createDetallefacturaDto: CreateDetallefacturaDto) {
    return this.detallefacturasService.create(createDetallefacturaDto);
  }

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

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar un detalle de factura por ID' })
  @ApiParam({ name: 'id', description: 'ID del detalle de factura a actualizar', required: true })
  @ApiResponse({ status: 200, description: 'DetalleFactura actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'DetalleFactura no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos en la solicitud' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDetallefacturaDto) {
  return this.detallefacturasService.update(id,dto);
}

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar (lógicamente) un detalle de factura por ID' })
  @ApiParam({ name: 'id', description: 'ID del detalle de factura a eliminar', required: true })
  @ApiResponse({ status: 200, description: 'DetalleFactura eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'DetalleFactura no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
  return this.detallefacturasService.remove(id);
}
}
