import { Module } from '@nestjs/common';
import { UsuariosModule } from './modules/users/usuarios.module';
import { FacturasModule } from './modules/facturas/facturas.module';
import { DetallefacturasModule } from './modules/detallefacturas/detallefacturas.module';
import { ProductosModule } from './modules/productos/productos.module';
import { AuthModule } from './modules/auth/auth.module';
import * as dotenv from 'dotenv';
import { RolesGuard } from './common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // uso de glob
      synchronize: true,
      ssl:false
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
