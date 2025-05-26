import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
  };
}
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService, 
    ) {}
    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({ status: 200, description: 'Login exitoso' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    login(@Body()loginDto:LoginDto) {
        return this.authService.login(loginDto);
    }
    @Post('register')
    @ApiOperation({ summary: 'Register' })
    @ApiResponse({ status: 201, description: 'Registro exitoso' })
    @ApiResponse({ status: 400, description: 'Error en el registro' })
    
    register(@Body()registerDto:RegisterDto) {
        return this.authService.register(registerDto);
    }
    
}
