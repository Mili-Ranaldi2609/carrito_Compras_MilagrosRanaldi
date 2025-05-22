import { forwardRef, Module } from '@nestjs/common';
import { DetallefacturasService } from './services/detallefacturas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detallefactura } from './entities/detallefactura.entity';
import { ProductosModule } from 'src/modules/productos/productos.module';
import { FacturasModule } from 'src/modules/facturas/facturas.module';
import { DetallefacturasController } from './controllers/detallefacturas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Detallefactura]),ProductosModule,
    forwardRef(() => FacturasModule)],
  controllers: [DetallefacturasController],
  providers: [DetallefacturasService],
  exports: [DetallefacturasService],
})
export class DetallefacturasModule {}
