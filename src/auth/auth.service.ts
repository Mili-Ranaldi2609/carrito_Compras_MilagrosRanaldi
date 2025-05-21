import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enums/rol.enum';
@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService
    ) { }
    async register(registerDto: RegisterDto) {
    const user = await this.usuariosService.findOneByEmail(registerDto.email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    await this.usuariosService.create(registerDto);

    return {
      registerDto
    };
  }
    async login({ email, password }: LoginDto) {
        const user = await this.usuariosService.findByEmailWithPassword(email);
        if (!user) {
            throw new UnauthorizedException('email is wrong');
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('password is wrong');
        }

        const payload = { email: user.email, role: user.rol };
        const token = await this.jwtService.signAsync(payload);

        return {
            token,
            email,
        };
    }
}
