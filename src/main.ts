import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Api Carrito de Compras')
    .setDescription('api donde se gestionan los productos y las facturas')
    .setVersion('1.0')
    .addTag('facturas')
    .addTag('productos') 
    .addTag('usuarios') 
    .addTag('detallefacturas')
    //.addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors()
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
