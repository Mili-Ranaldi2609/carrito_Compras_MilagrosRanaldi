import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { FacturasModule } from './facturas/facturas.module';
import { DetallefacturasModule } from './detallefacturas/detallefacturas.module';
import { ProductosModule } from './productos/productos.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { RolesGuard } from './common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // uso de glob
      synchronize: true,
      ssl:true
    }),
    UsuariosModule,
    FacturasModule,
    DetallefacturasModule,
    ProductosModule,
    AuthModule,
  ],
  
providers: [
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  }
]

})
export class AppModule {}
