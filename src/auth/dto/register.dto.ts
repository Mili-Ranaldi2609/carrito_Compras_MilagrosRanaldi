import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, Length, MaxLength } from "class-validator";
import { Role } from "src/common/enums/rol.enum";


export class RegisterDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(3, 50)
    nombreCompleto: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @Transform(({ value }) => value.trim())
    @Length(6, 20)
    @IsNotEmpty()
    password: string;
    @Transform(({ value }) => value.trim())
    @IsString()
    @MaxLength(20)
    estadoCivil: string;
    @IsEnum(Role)
    rol:Role
    @ApiProperty()
    @Transform(({ value }) => value.trim())
    @Length(8, 8)
    @IsNotEmpty()
    dni: string;
    @ApiProperty()
    @IsDateString()
    fechaNacimiento: Date;
}