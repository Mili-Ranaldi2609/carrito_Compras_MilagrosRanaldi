import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe, UseGuards, Request, Query } from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { FacturasService } from '../services/facturas.service';
import { CreateFacturaDto } from '../dto/create-factura.dto';
import { UpdateFacturaDto } from '../dto/update-factura.dto';

@Controller('facturas')
@ApiTags('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear una nueva factura' })
  @ApiResponse({ status: 201, description: 'Factura creada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateFacturaDto })
  create(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturasService.create(createFacturaDto);
  }

  @Get()
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Listar facturas con filtros y paginación' })
findAll(
  @Request() req,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
  @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  @Query('fecha') fecha?: string, // formato YYYY-MM-DD
) {
  return this.facturasService.findAllByEmail({
    email: req.user.email,
    page,
    limit,
    order,
    fecha,
  });
}



  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.facturasService.findOneByEmail(id, req.user.email); 
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar Factura por ID' })
  @ApiParam({ name: 'id', description: 'ID de la Factura a actualizar', required: true })
  @ApiResponse({ status: 200, description: 'Factura actualizada correctamente' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos en la solicitud' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFacturaDto) {
    return this.facturasService.update(id, dto);
  }


  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar (lógicamente) una factura por ID' })
  @ApiParam({ name: 'id', description: 'ID de la factura a eliminar', required: true })
  @ApiResponse({ status: 200, description: 'Factura eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.facturasService.remove(id);
  }
}
