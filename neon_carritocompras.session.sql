INSERT INTO detallesfacturas (
    id,
    disponible,
    subtotal,
    cantidad,
    productoId,
    facturaId
  )
VALUES (
    id:integer,
    disponible:boolean,
    subtotal:numeric,
    cantidad:integer,
    productoId:integer,
    facturaId:integer
  );