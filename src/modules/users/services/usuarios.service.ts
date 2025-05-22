import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>
  ) { }
  //CREATE USUARIO
  async create(createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioRepository.save(createUsuarioDto);
  }
  //FIND USUARIO BY EMAIL
   findOneByEmail(email: string) {
    return this.usuarioRepository.findOneBy({ email });
  }

  findByEmailWithPassword(email: string) {
    return this.usuarioRepository.findOne({
      where: { email },
      select: ['id', 'nombreCompleto', 'email', 'password', 'rol'],
    });
  }


  //FIND ALL USUARIOS
  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }
  async findOneSecure(id: number, user: any): Promise<Usuario> {
  const usuario = await this.usuarioRepository.findOneBy({ id });
  if (!usuario) throw new NotFoundException();
  if (user.id !== id && user.rol !== 'ADMIN') throw new ForbiddenException();
  return usuario;
}

async updateSecure(id: number, user: any, dto: UpdateUsuarioDto): Promise<Usuario> {
  await this.findOneSecure(id, user);
  return this.usuarioRepository.save({ id, ...dto });
}
  //DELETE USUARIO //Borrado lógico
  async remove(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrada`);
    }
    usuario.disponible = false;
    return this.usuarioRepository.save(usuario);
  }
}
