const products = {
  tradicional: { name: 'Bolo de Goiaba Tradicional', price: 28 },
  inteiro: { name: 'Bolo de Goiaba Inteiro', price: 45 },
  pote: { name: 'Bolo de Goiaba no Pote', price: 12 }
};
const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
let cart = JSON.parse(localStorage.getItem('guavaCart') || '{}');
function saveCart() { localStorage.setItem('guavaCart', JSON.stringify(cart)); renderCart(); }
function renderCart() {
  const items = document.querySelector('#cart-items');
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const count = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const total = entries.reduce((sum, [id, qty]) => sum + products[id].price * qty, 0);
  document.querySelector('#cart-count').textContent = count;
  document.querySelector('#cart-total').textContent = money(total);
  const checkout = document.querySelector('#go-checkout');
  checkout.style.opacity = count ? '1' : '.5'; checkout.style.pointerEvents = count ? 'auto' : 'none'; checkout.setAttribute('aria-disabled', String(!count));
  if (!entries.length) { items.innerHTML = '<p class="cart-empty">Seu carrinho está vazio. Escolha um bolo para começar.</p>'; return; }
  items.innerHTML = entries.map(([id, qty]) => `<div class="cart-line"><div><strong>${products[id].name}</strong><small>${money(products[id].price)} cada</small></div><div class="qty-controls"><button data-change="${id}" data-delta="-1" aria-label="Diminuir">−</button><strong>${qty}</strong><button data-change="${id}" data-delta="1" aria-label="Aumentar">+</button></div><strong class="line-price">${money(products[id].price * qty)}</strong></div>`).join('');
}
document.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => { const id = button.dataset.add; cart[id] = (cart[id] || 0) + 1; saveCart(); button.textContent = 'Adicionado ✓'; setTimeout(() => button.textContent = 'Adicionar ao carrinho +', 900); }));
document.querySelector('#cart-items').addEventListener('click', event => { const button = event.target.closest('[data-change]'); if (!button) return; const id = button.dataset.change; cart[id] = (cart[id] || 0) + Number(button.dataset.delta); if (cart[id] <= 0) delete cart[id]; saveCart(); });
renderCart();
