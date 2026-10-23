// CLASE CARRITO: guarda los productos y realiza los cálculos.
// No modifica el HTML: esa tarea corresponde a las funciones que aparecen después.
class Carrito {
    constructor(productos, moneda){
        this.productos = productos;
        this.moneda = moneda;

        // Todos los productos empiezan con cero unidades y subtotal cero.
        for (let i=0; i<this.productos.length; i++){
            this.productos[i].quantity = 0;
            this.productos[i].subtotal = 0;
        }
    }

    // Cambia la cantidad de un producto identificado por su código SKU.
    actualizarUnidades(sku, unidades){
        // No permitimos cantidades negativas ni números que no sean enteros.
        if(!Number.isInteger(unidades) || unidades < 0){
            console.log("La cantidad no es válida");
            return;
        }

        for(let i = 0; i < this.productos.length; i++){
            if(this.productos[i].SKU === sku){
                this.productos[i].quantity = unidades;
                // El cálculo queda dentro de la clase, separado del HTML.
                this.productos[i].subtotal = Number(
                    (Number(this.productos[i].price) * unidades).toFixed(2)
                );
                return;
            }
        }
        console.log("Producto no encontrado")
    }

    // Busca un producto por su SKU. Si no existe, devuelve null.
    obtenerInformacionProducto(sku){
        for(let i = 0; i < this.productos.length; i++){
            if(this.productos[i].SKU === sku){
                return this.productos[i];
            }
        }
        return null;
    }

    // Devuelve los productos seleccionados y el importe total de la compra.
    obtenerCarrito(){
        let total = 0;
        const productosSeleccionados = [];

        for(let i = 0; i < this.productos.length; i++){
            const producto = this.productos[i];
            
            // Solo añadimos al carrito los productos con alguna unidad.
            if(producto.quantity > 0){
                total += producto.subtotal;
                productosSeleccionados.push(producto);
            }
        }
        return{
            total: Number(total.toFixed(2)),
            currency: this.moneda,
            products: productosSeleccionados
        };
    }
}

// Dirección de la API donde están guardados los datos de los tres productos.
const URL_API = "https://api.npoint.io/35e79639cc3e1861a8c1";

// Guardaremos aquí el carrito cuando terminemos de cargar los productos.
let miCarrito;

// Se ejecuta al pulsar + o - en un producto.
function cambiarCantidad(sku, cambio){
    const producto = miCarrito.obtenerInformacionProducto(sku);

    if(producto === null){
        return;
    }

    const nuevaCantidad = producto.quantity + cambio;

    if (nuevaCantidad >= 0){

        // Actualizamos los datos y después volvemos a mostrar los cambios.
        miCarrito.actualizarUnidades(sku, nuevaCantidad);
        mostrarProductos();
        actualizarResumen();
    }
}

// Crea las filas de la tabla a partir de los productos del carrito.
function mostrarProductos(){
    const cuerpoTabla = document.getElementById("lista-productos");

    // Vaciamos la tabla para no duplicar las filas al actualizar las cantidades.
    cuerpoTabla.innerHTML = "";

    for(let i=0; i < miCarrito.productos.length;i++){
        
        const producto = miCarrito.productos[i];
        
        const fila = document.createElement("tr");
        
        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = producto.title;

        const celdaPrecio = document.createElement("td");
        celdaPrecio.textContent = Number(producto.price).toFixed(2) + " €";

        const celdaUnidades = document.createElement("td");
        
        // Creamos los dos botones y el número que muestra las unidades actuales.
        const botonMenos = document.createElement("button");
        botonMenos.textContent = "-";
        botonMenos.type = "button";
        botonMenos.disabled = producto.quantity === 0;

        const contador = document.createElement("span");
        contador.textContent = producto.quantity;

        const botonMas = document.createElement("button");
        botonMas.textContent = "+";
        botonMas.type = "button";

        // Cada botón cambia una sola unidad del producto correspondiente.
        botonMenos.addEventListener("click", function(){
            cambiarCantidad(producto.SKU, -1);
        });

        botonMas.addEventListener("click", function(){
            cambiarCantidad(producto.SKU, 1);
        });

        celdaUnidades.appendChild(botonMenos);
        celdaUnidades.appendChild(contador);
        celdaUnidades.appendChild(botonMas);

        const celdaSubtotal = document.createElement("td");
        // Mostramos el subtotal que ya calculó la clase Carrito.
        celdaSubtotal.textContent = producto.subtotal.toFixed(2) + " €";

        // Añadimos las cuatro celdas a la fila y la fila a la tabla.
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaPrecio);
        fila.appendChild(celdaUnidades);
        fila.appendChild(celdaSubtotal);

        cuerpoTabla.appendChild(fila);
    }
}

// Muestra los productos elegidos y el total calculado por la clase Carrito.
function actualizarResumen(){
    const carrito = miCarrito.obtenerCarrito();

    const listado = document.getElementById("productos-seleccionados");

    const total = document.getElementById("total-carrito");

    listado.innerHTML = "";

    if (carrito.products.length === 0){
        const mensaje = document.createElement("p");

        mensaje.textContent = "Todavía no has seleccionado productos.";

        listado.appendChild(mensaje);
    }
    else{
        for(let i = 0; i < carrito.products.length; i++){
            const producto = carrito.products[i];

            const linea = document.createElement("p");

            // Separamos el número de unidades, el nombre y el precio para que se lean mejor.
            linea.textContent = producto.quantity + "x" + producto.title + "-" + producto.subtotal.toFixed(2) + " " + carrito.currency;

            listado.appendChild(linea);
        }
    }

    total.textContent = carrito.total.toFixed(2) + " " + carrito.currency;
}

// Consulta la API con fetch() y crea el carrito al recibir los productos.
async function cargarProductos() {
    try{
        const respuesta = await fetch(URL_API);

        // Comprobamos que el servidor haya respondido correctamente.
        if(!respuesta.ok){
            throw new Error("Error HTTP: "+ respuesta.status);
        }
        
        const datos = await respuesta.json();
        
        miCarrito = new Carrito(datos.products, datos.currency);

        // Una vez cargados los datos, mostramos los productos y el carrito vacío.
        mostrarProductos();

        actualizarResumen();
        document.getElementById("estado").textContent = "Productos cargados correctamente.";
    
    } catch(error){

        // Si falla la API, avisamos al usuario y dejamos el detalle en la consola.
        document.getElementById("estado").textContent = "No se pudieron cargar los productos.";
        console.error("Error al cargar los productos:", error);
    }
}

// Iniciamos la carga cuando se abre la página.
cargarProductos();