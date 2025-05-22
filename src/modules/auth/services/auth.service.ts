import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enums/rol.enum';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UsuariosService } from 'src/modules/users/services/usuarios.service';
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
    registerDto.password = await bcryptjs.hash(registerDto.password, 10);
    await this.usuariosService.create(registerDto);
    const  { password, ...userWithoutPassword } = registerDto;	
    return {
      user: userWithoutPassword,
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
