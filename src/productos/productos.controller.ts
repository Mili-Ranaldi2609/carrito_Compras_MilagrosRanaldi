import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('productos')
@ApiTags('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard,RolesGuard)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateProductoDto })
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all productos' })
  @ApiResponse({ status: 200, description: 'Get all productos' })
  @ApiResponse({ status: 404, description: 'Forbidden' })
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del Producto', required: true })
  @ApiResponse({ status: 200, description: 'Producto encontrado correctamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard,RolesGuard)
  @ApiOperation({ summary: 'Actualizar Producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del Producto a actualizar', required: true })
  @ApiResponse({ status: 200, description: 'Producto actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos en la solicitud' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard,RolesGuard)
  @ApiOperation({ summary: 'Eliminar (lógicamente) un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto a eliminar', required: true })
  @ApiResponse({ status: 200, description: 'Producto eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}
