import { forwardRef, Module } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { ProductosModule } from 'src/productos/productos.module';
import { DetallefacturasModule } from 'src/detallefacturas/detallefacturas.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [TypeOrmModule.forFeature([Factura]),forwardRef(() => DetallefacturasModule),ProductosModule,UsuariosModule],
  controllers: [FacturasController],
  providers: [FacturasService],
  exports: [FacturasService],
})
export class FacturasModule {}
