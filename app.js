const allContainerCart = document.querySelector('.products');
const containerBuyCart = document.querySelector('.card-items');
const priceTotal = document.querySelector('.price-total');
const amountProduct = document.querySelector('.count-product');
const cartModal = document.querySelector('#products-id');
const btnOpenCart = document.querySelector('#btn-cart-open');
const btnCloseCart = document.querySelector('#btn-cart-close');
const btnVaciar = document.querySelector('#btn-vaciar');
const btnComprar = document.querySelector('#btn-comprar');

let buyThings = JSON.parse(localStorage.getItem('carritoGenova')) || [];
let totalCard = 0;
let countProduct = 0;
let catalogoProductos = [];
loadEventListeners();
function loadEventListeners() {
  allContainerCart.addEventListener('click', addProduct);
  containerBuyCart.addEventListener('click', deleteProduct);
  if (btnOpenCart) {
    btnOpenCart.addEventListener('click', () => {
      cartModal.style.display = 'block';
    });
  }
  if (btnCloseCart) {
    btnCloseCart.addEventListener('click', () => {
      cartModal.style.display = 'none';
    });
  }
  if (btnVaciar) {
    btnVaciar.addEventListener('click', vaciarCarrito);
  }
  if (btnComprar) {
    btnComprar.addEventListener('click', comprarCarrito);
  }
  cargarCatalogo();
  if (buyThings.length > 0) {
    loadHtml();
  }
}
async function cargarCatalogo() {
  try {
    const res = await fetch('./data.json');
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    catalogoProductos = await res.json();
    renderizarProductos(catalogoProductos);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de carga',
      text: 'No se pudo cargar el catálogo de velas. Verificá que estés usando Live Server.',
      confirmButtonColor: '#7a2f2f'
    });
  }
}
function renderizarProductos(productos) {
  allContainerCart.innerHTML = '';
  productos.forEach(prod => {
    const { id, title, price, image } = prod;
    const divCart = document.createElement('div');
    divCart.classList.add('carts');
    divCart.innerHTML = `
      <div>
        <img src="${image}" alt="${title}">
        <p><span>${price}</span>$</p>
      </div>
      <p class="title">${title}</p>
      <a href="#" data-id="${id}" class="btn-add-cart">agregar al carrito</a>
    `;
    allContainerCart.appendChild(divCart);
  });
}
function addProduct(e) {
  e.preventDefault();
  if (e.target.classList.contains('btn-add-cart')) {
    const id = e.target.getAttribute('data-id');
    const productoSeleccionado = catalogoProductos.find(item => item.id === id);
    if (productoSeleccionado) {
      readTheContent(productoSeleccionado);
    }
  }
}
function deleteProduct(e) {
  if (e.target.classList.contains('delete-product')) {
    const deleteId = e.target.getAttribute('data-id');
    buyThings = buyThings.filter(product => product.id !== deleteId);
    guardarCarrito();
    loadHtml();
    Toastify({
      text: "Producto eliminado",
      duration: 2000,
      gravity: "bottom",
      position: "right",
      style: { background: "#a84c4c" }
    }).showToast();
  }
}
function readTheContent(producto) {
  const infoProduct = {
    image: producto.image,
    title: producto.title,
    price: producto.price,
    id: producto.id,
    amount: 1
  };
  const exist = buyThings.some(product => product.id === infoProduct.id);
  if (exist) {
    const prods = buyThings.map(product => {
      if (product.id === infoProduct.id) {
        product.amount++;
        return product;
      }
      return product;
    });
    buyThings = [...prods];
  } else {
    buyThings = [...buyThings, infoProduct];
  }
  guardarCarrito();
  loadHtml();
  Toastify({
    text: `${infoProduct.title} agregado`,
    duration: 2000,
    gravity: "bottom",
    position: "right",
    style: { background: "#6c9c6c" }
  }).showToast();
}
function guardarCarrito() {
  localStorage.setItem('carritoGenova', JSON.stringify(buyThings));
}
function loadHtml() {
  clearHtml();
  totalCard = 0;
  countProduct = 0;
  buyThings.forEach(product => {
    const { image, title, price, amount, id } = product;
    totalCard += parseFloat(price) * parseInt(amount);
    countProduct += parseInt(amount);
    const row = document.createElement('div');
    row.classList.add('item');
    row.innerHTML = `
      <img src="${image}" alt="${title}">
      <div class="item-content">
        <h5>${title}</h5>
        <h5 class="cart-price">$${price}</h5>
        <h6>Cantidad: ${amount}</h6>
      </div>
      <span class="delete-product" data-id="${id}">X</span>
    `;
    containerBuyCart.appendChild(row);
  });
  priceTotal.innerHTML = totalCard.toFixed(2);
  amountProduct.innerHTML = countProduct;
}
function clearHtml() {
  containerBuyCart.innerHTML = '';
}
function vaciarCarrito() {
  if (buyThings.length === 0) {
    Toastify({
      text: "El carrito ya está vacío",
      duration: 2000,
      gravity: "bottom",
      position: "right",
      style: { background: "#7a5c5c" }
    }).showToast();
    return;
  }
  Swal.fire({
    title: "¿Vaciar carrito?",
    text: "Se eliminarán todos los productos seleccionados.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#7a2f2f",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar"
  }).then(result => {
    if (result.isConfirmed) {
      buyThings = [];
      guardarCarrito();
      loadHtml();
      Toastify({
        text: "Carrito vaciado",
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: { background: "#7a2f2f" }
      }).showToast();
    }
  });
}
function comprarCarrito() {
  if (buyThings.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Carrito vacío",
      text: "Agregá productos antes de confirmar la compra.",
      confirmButtonColor: "#4d7a4d"
    });
    return;
  }
  Swal.fire({
    icon: "success",
    title: "¡Compra realizada!",
    text: "Gracias por tu compra en Génova Aromas.",
    confirmButtonColor: "#4d7a4d"
  }).then(() => {
    buyThings = [];
    guardarCarrito();
    loadHtml();
    cartModal.style.display = 'none';
  });
}