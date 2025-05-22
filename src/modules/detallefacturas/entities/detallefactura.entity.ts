import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Producto } from 'src/modules/productos/entities/producto.entity';
import { Factura } from 'src/modules/facturas/entities/factura.entity';

@Entity('detallesfacturas')
export class Detallefactura {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    disponible: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2 ,nullable: true})
    subtotal: number;

    @Column({ type: 'int' })
    cantidad: number;

    @ManyToOne(() => Producto, { eager: true })
    producto: Producto;


    @ManyToOne(() => Factura, (factura) => factura.detallesFactura, { onDelete: 'CASCADE' })
    factura: Factura;
}
