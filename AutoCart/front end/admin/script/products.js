// products.js - versão que usa backend
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    alert('Acesso negado. Por favor, faça o login.');
    window.location.href = 'admin-login.html';
    return;
  }

  // DOM
  const productForm = document.getElementById('productForm');
  const formMessage = document.getElementById('formMessage');
  const productsList = document.getElementById('productsList');
  const productCount = document.getElementById('productCount');
  const searchInput = document.getElementById('searchInput');
  const btnClear = document.getElementById('btnClear');

  let allProducts = [];
  let displayedProducts = [];

  // Helpers
  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = 'message ' + type;
  }
  function hideMessage() {
    formMessage.className = 'message';
    formMessage.textContent = '';
  }

  // Fetch produtos do backend
  async function loadProducts() {
    try {
      const res = await fetch('http://localhost:3333/produtos', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          alert('Sessão expirada ou sem permissão. Faça login novamente.');
          localStorage.removeItem('admin_token');
          window.location.href = 'admin-login.html';
          return;
        }
        throw new Error('Erro ao buscar produtos: ' + res.status);
      }
      const data = await res.json();
      allProducts = data || [];
      displayedProducts = allProducts.slice();
      renderProducts();
      updateProductCount();
    } catch (err) {
      console.error(err);
      productsList.innerHTML = '<p class="empty-state">Erro ao carregar produtos. Verifique o console.</p>';
    }
  }

  function renderProducts() {
    if (!displayedProducts || displayedProducts.length === 0) {
      productsList.innerHTML = '<p class="empty-state">Nenhum produto cadastrado</p>';
      return;
    }
    let html = '';
    displayedProducts.forEach(prod => {
      html += `<div class="product-card" data-id="${prod.id}">
        <div class="product-info">
          <div class="product-name">${prod.name || prod.nome}</div>
          <div class="product-details">Codigo: ${prod.barcode || prod.codigo_barras || ''}</div>
          <div class="product-details">Peso: ${prod.weight || prod.peso || ''}kg | Categoria: ${prod.category || prod.categoria || ''}</div>
          <div class="product-price">R$ ${Number(prod.price || prod.preco || 0).toFixed(2)}</div>
        </div>
        <div class="product-actions">
          <button class="btn-edit" data-barcode="${prod.barcode || ''}" onclick="editProduct('${prod.barcode || ''}', ${prod.id || 'null'})">✏️</button>
          <button class="btn-delete" onclick="deleteProductById(${prod.id})">🗑️</button>
        </div>
      </div>`;
    });
    productsList.innerHTML = html;
  }

  function updateProductCount() {
    productCount.textContent = allProducts.length;
  }

  // Adicionar novo produto (via backend)
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage();

    const barcode = document.getElementById('barcode').value.trim();
    const name = document.getElementById('name').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const category = document.getElementById('category').value;
    const image = document.getElementById('image').value.trim();

    // Simple validation
    if (!barcode || !name || isNaN(price)) {
      showMessage('Preencha os campos obrigatórios corretamente.', 'error');
      return;
    }

    try {
      const body = {
        barcode,
        name,
        price,
        weight,
        category,
        image
      };

      const res = await fetch('http://localhost:3333/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        showMessage(data.error || data.message || 'Erro ao adicionar produto', 'error');
        return;
      }

      showMessage('Produto adicionado com sucesso!', 'success');
      productForm.reset();
      // recarregar
      await loadProducts();
      setTimeout(hideMessage, 3000);
    } catch (err) {
      console.error(err);
      showMessage('Erro ao conectar ao servidor.', 'error');
    }
  });

  // Deletar produto por id
  window.deleteProductById = async function (id) {
    if (!confirm('Deseja realmente excluir este produto?')) return;
    try {
      const res = await fetch(`http://localhost:3333/produtos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Erro ao deletar produto');
        return;
      }
      await loadProducts();
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar ao servidor.');
    }
  };

  // Edit (preenche o form e remove o produto original)
  window.editProduct = function(barcode, id) {
    const p = allProducts.find(x => (x.barcode === barcode || x.id === id));
    if (!p) return;
    document.getElementById('barcode').value = p.barcode || p.codigo_barras || '';
    document.getElementById('name').value = p.name || p.nome || '';
    document.getElementById('price').value = p.price || p.preco || '';
    document.getElementById('weight').value = p.weight || p.peso || '';
    document.getElementById('category').value = p.category || p.categoria || '';
    document.getElementById('image').value = p.image || p.imagem || '';

    // Option: update via PUT instead of delete->create. Here we'll fill form and delete original:
    if (confirm('Abrir produto para edição? (isso removerá o original e ao salvar será criado um novo)')) {
      if (id) deleteProductById(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Buscar produtos localmente
  searchInput.addEventListener('input', function () {
    const q = this.value.toLowerCase().trim();
    if (!q) {
      displayedProducts = allProducts.slice();
      renderProducts();
      return;
    }
    displayedProducts = allProducts.filter(p => {
      const name = (p.name || p.nome || '').toString().toLowerCase();
      const barcode = (p.barcode || p.codigo_barras || '').toString();
      const cat = (p.category || p.categoria || '').toString().toLowerCase();
      return name.includes(q) || barcode.includes(q) || cat.includes(q);
    });
    renderProducts();
  });

  btnClear.addEventListener('click', () => {
    productForm.reset();
    hideMessage();
  });

  // Inicializa
  loadProducts();
});
