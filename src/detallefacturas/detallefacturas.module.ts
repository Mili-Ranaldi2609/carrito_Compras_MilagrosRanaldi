import { forwardRef, Module } from '@nestjs/common';
import { DetallefacturasService } from './detallefacturas.service';
import { DetallefacturasController } from './detallefacturas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detallefactura } from './entities/detallefactura.entity';
import { ProductosModule } from 'src/productos/productos.module';
import { FacturasModule } from 'src/facturas/facturas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Detallefactura]),ProductosModule,
    forwardRef(() => FacturasModule)],
  controllers: [DetallefacturasController],
  providers: [DetallefacturasService],
  exports: [DetallefacturasService],
})
export class DetallefacturasModule {}
