// import { PrismaService } from 'src/prisma/prisma.service';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class DetalleFacturaService {
//   constructor(private readonly prisma: PrismaService) {}

//   async create(data: { cantidad: number, productoId: number, facturaId: number }) {
//     const producto = await this.prisma.producto.findUnique({
//       where: { id: data.productoId },
//     });

//     if (!producto) throw new Error('Producto no encontrado');

//     const subtotal = producto.precioUnitario.toNumber() * data.cantidad;

//     return this.prisma.detalleFactura.create({
//       data: {
//         cantidad: data.cantidad,
//         subtotal,
//         disponible: true,
//         producto: { connect: { id: data.productoId } },
//         factura: { connect: { id: data.facturaId } },
//       },
//     });
//   }
// }