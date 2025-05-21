import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@Controller('usuarios')
@ApiTags('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all usuarios' })
  @ApiResponse({ status: 200, description: 'Get all usuarios' })
  @ApiResponse({ status: 404, description: 'Forbidden' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get('/user/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario', required: true })
  @ApiResponse({ status: 200, description: 'Usuario encontrado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.usuariosService.findOneSecure(id, req.user);
  }

  @Put('/user/update/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario a actualizar', required: true })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() dto: UpdateUsuarioDto) {
    return this.usuariosService.updateSecure(id, req.user, dto);
  }

  @Delete('/user/delete/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Eliminar (lógicamente) un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario a eliminar', required: true })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }
}
