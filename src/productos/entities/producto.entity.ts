
import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length:50})
    nombre: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precioUnitario: number;

    @Column({ type: 'int' })
    stock: number;

    @Column({ default: true })
    disponible: boolean;

    @Column({ type: 'text', nullable: true })
    descripcion: string;
}
