import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';

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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all facturas' })
  @ApiResponse({ status: 200, description: 'Get all facturas' })
  @ApiResponse({ status: 404, description: 'Forbidden' })
  findAll() {
    return this.facturasService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener Factura por ID' })
  @ApiParam({ name: 'id', description: 'ID de la Factura', required: true })
  @ApiResponse({ status: 200, description: 'Factura encontrada correctamente' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facturasService.findOne(id );
  }
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar Factura por ID' })
  @ApiParam({ name: 'id', description: 'ID de la Factura a actualizar', required: true })
  @ApiResponse({ status: 200, description: 'Factura actualizada correctamente' })
  @ApiResponse({ status: 404, description: 'Factura no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos en la solicitud' })
  update(@Param('id', ParseIntPipe) id: number,  @Body() dto: UpdateFacturaDto) {
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
