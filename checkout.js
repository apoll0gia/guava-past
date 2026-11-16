const products = {
  tradicional: { name: 'Bolo de Goiaba Tradicional', price: 28 },
  inteiro: { name: 'Bolo de Goiaba Inteiro', price: 45 },
  pote: { name: 'Bolo de Goiaba no Pote', price: 12 }
};
const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const cart = JSON.parse(localStorage.getItem('guavaCart') || '{}');
const entries = Object.entries(cart).filter(([id, qty]) => products[id] && qty > 0);
const total = entries.reduce((sum, [id, qty]) => sum + products[id].price * qty, 0);
const summary = document.querySelector('#summary-items');
if (!entries.length) {
  document.querySelector('#checkout-form').hidden = true;
  summary.innerHTML = '<p class="cart-empty">Seu carrinho está vazio. Volte à loja para escolher seus produtos.</p><a class="button button-primary" href="vendas.html">Ir para a loja ↗</a>';
} else {
  summary.innerHTML = entries.map(([id, qty]) => `<div class="order-summary-line"><span>${products[id].name} × ${qty}</span><strong>${money(products[id].price * qty)}</strong></div>`).join('');
  document.querySelector('#summary-total').textContent = money(total);
}
document.querySelectorAll('[name="payment"]').forEach(input => input.addEventListener('change', () => {
  const info = document.querySelector('#payment-info');
  const messages = {
    'Pix': 'Pix selecionado. Ao concluir, será exibida uma confirmação fictícia. Nenhuma chave Pix ou cobrança real será gerada.',
    'Cartão de crédito': 'Crédito selecionado. Demonstraremos a confirmação sem solicitar número, validade ou código do cartão.',
    'Cartão de débito': 'Débito selecionado. Demonstraremos a confirmação sem solicitar dados bancários.'
  };
  info.textContent = messages[input.value];
}));
document.querySelector('#checkout-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!entries.length) return;
  const name = new FormData(event.currentTarget).get('name');
  const payment = new FormData(event.currentTarget).get('payment');
  document.querySelector('#checkout-content').style.display = 'none';
  const success = document.querySelector('#success-state');
  success.classList.add('show');
  document.querySelector('#success-message').textContent = `${name}, seu pedido de ${money(total)} foi registrado na demonstração. Forma escolhida: ${payment}.`;
  localStorage.removeItem('guavaCart');
});
