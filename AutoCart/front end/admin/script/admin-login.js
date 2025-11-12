// admin-login.js
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('errorMessage');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.style.display = 'none';

    const email = emailInput.value.trim();
    const senha = passwordInput.value.trim();

    try {
      const res = await fetch('http://localhost:3333/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (!res.ok) {
        errorMessage.textContent = data.error || data.message || 'Login inválido';
        errorMessage.style.display = 'block';
        return;
      }

      // respostas esperadas: { usuario: {...}, token: '...' }
      const token = data.token || (data.token && data.token.token) || null;
      // Em alguns pontos trocamos formato; garantir token:
      if (!token && data.token) {
        // se backend retornar { token: '...' } já coberto; só por segurança
      }

      if (!token) {
        // alguns backends devolvem somente { token: '...' } ou { usuario, token }
        // tentar pegar data.token diretamente
      }

      // SALVAR token (admin)
      console.log("DEBUG TOKEN FRONT:", data);

      localStorage.setItem('admin_token', data.token ?? data?.token?.token ?? null);


      // opcional: salvar usuário (sem senha)
      if (data.usuario) localStorage.setItem('admin_user', JSON.stringify(data.usuario));

      // redireciona
      window.location.href = 'products.html';
    } catch (err) {
      console.error('Erro ao conectar ao servidor:', err);
      errorMessage.textContent = 'Erro ao conectar ao servidor.';
      errorMessage.style.display = 'block';
    }
  });
});
