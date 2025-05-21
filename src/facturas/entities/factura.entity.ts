import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Detallefactura } from 'src/detallefacturas/entities/detallefactura.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  disponible: boolean;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column()
  nombreFantasia: string;

  @Column({ type: 'date' })
  fechaFundacion: Date;

  @OneToMany(() => Detallefactura, (detalle) => detalle.factura, { cascade: true })
  detallesFactura: Detallefactura[];

  @ManyToOne(() => Usuario, (usuario) => usuario.facturas)
  usuario: Usuario;
}
