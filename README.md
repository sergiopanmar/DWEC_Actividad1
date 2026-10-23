# AgoodShop — Actividad 1 de DWEC

Proyecto de carrito de la compra desarrollado con **HTML, CSS y JavaScript** para la asignatura Desarrollo Web en Entorno Cliente.

## Funcionalidades

- Obtención de productos desde una API mediante `fetch()`.
- Creación dinámica de la tabla de productos utilizando el DOM.
- Botones para aumentar y disminuir unidades, sin permitir cantidades negativas.
- Cálculo de subtotales y del importe total de la compra.
- Resumen que muestra únicamente los productos seleccionados.
- Diseño adaptable a diferentes anchuras de pantalla.

## Archivos

- `index.html`: estructura de la tienda.
- `style.css`: estilos de la interfaz.
- `script.js`: clase `Carrito`, conexión con la API y funciones para mostrar y actualizar los productos.

La clase `Carrito` gestiona la información y los cálculos sin acceder al documento HTML. Las funciones independientes se encargan de los elementos visuales y de los eventos de los botones.

## Cómo ejecutar

1. Abre `XAMPP` y presiona start en Apache. Abre el navegador y busca el enlace con el nombre de la carpeta.
2. Espera a que aparezca el mensaje **«Productos cargados correctamente»**.
3. Utiliza los botones `+` y `−` para seleccionar unidades.

Se necesita conexión a Internet para consultar la API.

## API utilizada

https://api.npoint.io/35e79639cc3e1861a8c1
