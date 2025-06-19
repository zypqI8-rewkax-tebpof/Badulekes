function mostrarCarrito() {
  const contenedor = document.getElementById('carrito-contenido');
  const totalTexto = document.getElementById('total');
  if (!contenedor || !totalTexto) return;

  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p>No hay productos en el carrito.</p>';
  }

  let total = 0;
  contenedor.innerHTML = '';

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const div = document.createElement('div');
    div.classList.add('producto');
    div.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" />
      <h3>${item.nombre}</h3>
      <p>Precio unitario: Gs. ${item.precio}</p>
      <div class="cantidad-control">
        <button class="btn-cantidad" data-action="restar" data-index="${index}">−</button>
        <input type="number" min="1" value="${item.cantidad}" data-index="${index}" class="cantidad-input" />
        <button class="btn-cantidad" data-action="sumar" data-index="${index}">+</button>
      </div>
      <p><strong>Subtotal:</strong> Gs. ${subtotal}</p>
      <button class="eliminar-producto" data-index="${index}">Eliminar</button>
    `;
    contenedor.appendChild(div);
  });
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const contador = document.getElementById('contador-carrito');
  if (contador) contador.textContent = totalItems;
}

// Botones + y -
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-cantidad')) {
    const index = parseInt(e.target.getAttribute('data-index'));
    const action = e.target.getAttribute('data-action');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (action === 'sumar') {
      carrito[index].cantidad += 1;
    } else if (action === 'restar' && carrito[index].cantidad > 1) {
      carrito[index].cantidad -= 1;
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
  }
});

// Cambiar cantidad manualmente
document.addEventListener('input', function (e) {
  if (e.target.classList.contains('cantidad-input')) {
    const index = e.target.getAttribute('data-index');
    const nuevaCantidad = parseInt(e.target.value);
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (!isNaN(nuevaCantidad) && nuevaCantidad >= 1) {
      carrito[index].cantidad = nuevaCantidad;
      localStorage.setItem('carrito', JSON.stringify(carrito));
      mostrarCarrito();
    }
  }
});

// Eliminar producto individual
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('eliminar-producto')) {
    const index = e.target.getAttribute('data-index');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    mostrarMensajeFlotante('🗑 Producto eliminado del carrito.', 'error');
  }
});

// Vaciar y finalizar compra
document.addEventListener('DOMContentLoaded', () => {
  const vaciarBtn = document.getElementById('vaciar-carrito');
  const finalizarBtn = document.getElementById('finalizar-compra');

  if (vaciarBtn) {
    vaciarBtn.addEventListener('click', () => {
      localStorage.removeItem('carrito');
      mostrarCarrito();
      mostrarMensajeFlotante('🗑 Carrito vaciado correctamente.', 'error');
    });
  }

  if (finalizarBtn) {
    finalizarBtn.addEventListener('click', () => {
      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

      if (carrito.length === 0) {
        mostrarMensajeFlotante('❌ El carrito está vacío. Agregá productos antes de finalizar la compra.', 'error');
        return;
      }

      let mensaje = '¡Hola! Estoy queriendo comprar estos stickers:%0A%0A';
      let total = 0;

      carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `*Tipo de sticker:* ${item.nombre}%0A *Cantidad:* ${item.cantidad}%0A *Costo:* Gs. ${subtotal}%0A%0A`;
      });

      mensaje += `*Total a pagar:* Gs. ${total}%0A%0A¿Podrías confirmarme la disponibilidad? ¡Gracias!`;

      const numeroWhatsApp = '595981188037'; // Reemplazar con tu número real
      const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;

      mostrarMensajeFlotante('✅ Pedido derivado a WhatsApp. ¡Gracias por tu compra!', 'exito');
      window.open(url, '_blank');
    });
  }

  mostrarCarrito();
});

// Mensaje flotante estilo cartoon
function mostrarMensajeFlotante(texto, tipo = 'exito') {
  const mensaje = document.createElement('div');
  mensaje.className = `mensaje-flotante mensaje-${tipo}`;
  mensaje.textContent = texto;

  document.body.appendChild(mensaje);

  setTimeout(() => mensaje.classList.add('mostrar'), 100);

  setTimeout(() => {
    mensaje.classList.remove('mostrar');
    setTimeout(() => mensaje.remove(), 300);
  }, 3000);
}