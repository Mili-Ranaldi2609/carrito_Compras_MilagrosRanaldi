import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from 'typeorm';
import { Factura } from 'src/modules/facturas/entities/factura.entity';
import { Sexo } from '../enums/sexo.enum';
import { Role } from '../../../common/enums/rol.enum';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  disponible: boolean;
  @Column({ type: 'enum', enum: Role, default: Role.CLIENTE })
  rol: Role;
  @Column({ type: 'date' })
  fechaNacimiento: Date;

  @Column({ length: 8, unique: true, nullable: false })
  dni: string;

  @Column({ length: 50, nullable: false })
  nombreCompleto: string;

  @Column({
    type: 'enum',
    enum: Sexo,
    default: Sexo.PREFIERO_NO_DECIR,
  })
  sexo: Sexo;

  @Column()
  estadoCivil: string;
  @Column({ unique: true, nullable: false })
  email: string;
  @Column({ select: false })
  password: string;
  @OneToMany(() => Factura, (factura) => factura.usuario, { cascade: true })
  facturas: Factura[];
}
