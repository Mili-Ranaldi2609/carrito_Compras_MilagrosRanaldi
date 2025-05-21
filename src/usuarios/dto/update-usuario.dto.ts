import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { Sexo } from '../sexo.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
        @ApiPropertyOptional({ example: true, description: 'Estado de disponibilidad' })
        disponible?: boolean;
        @ApiPropertyOptional({ example: '2023-10-01', description: 'Fecha de nacimiento' })
        fechaNacimiento?: Date;
        @ApiPropertyOptional({ example: '12345678', description: 'DNI del usuario' })
        dni?: string;
        @ApiPropertyOptional({ example: 'Juan Perez', description: 'Nombre completo del usuario' })
        nombreCompleto?: string;
        @ApiPropertyOptional({ example: 'Masculino', description: 'Sexo del usuario' })
        sexo?: Sexo;
        @ApiPropertyOptional({ example: 'soltero', description: 'Estado civil del usuario' })
        estadoCivil?: string;
}
