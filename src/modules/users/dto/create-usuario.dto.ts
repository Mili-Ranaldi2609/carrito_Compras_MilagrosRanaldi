import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength,  MinLength } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { Role } from "src/common/enums/rol.enum";
export class CreateUsuarioDto {
    @ApiProperty({ example: '12345678', description: 'DNI del usuario' })
    @Transform(({ value }) => value.trim())
    @IsString()
    @MaxLength(8)
    @MinLength(8)
    @IsNotEmpty()
    dni: string;
    @ApiProperty({ example: 'Juan Perez', description: 'Nombre completo del usuario' })
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    @IsNotEmpty()
    nombreCompleto: string;
    @IsEmail()
    email: string;
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(6)
    password: string;
    @ApiProperty({ example: '1986-01-01', description: 'Fecha de nacimiento del usuario' })
    @IsNotEmpty()
    @IsDateString()
    fechaNacimiento: Date;
    @ApiProperty({ example: 'soltero', description: 'Estado civil del usuario' })
    @IsString()
    @MaxLength(20)
    estadoCivil: string;
    @IsNotEmpty()
    @IsEnum(Role)
    rol: Role
}
