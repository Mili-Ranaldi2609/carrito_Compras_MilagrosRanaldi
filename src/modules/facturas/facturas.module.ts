import { forwardRef, Module } from '@nestjs/common';
import { FacturasService } from './services/facturas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { ProductosModule } from 'src/modules/productos/productos.module';
import { DetallefacturasModule } from 'src/modules/detallefacturas/detallefacturas.module';
import { UsuariosModule } from 'src/modules/users/usuarios.module';
import { FacturasController } from './controllers/facturas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Factura]),forwardRef(() => DetallefacturasModule),ProductosModule,UsuariosModule],
  controllers: [FacturasController],
  providers: [FacturasService],
  exports: [FacturasService],
})
export class FacturasModule {}
