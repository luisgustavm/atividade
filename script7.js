// script.js (carregado em index.html e cadastro.html)

async function cadastrar(email, senha) {
  const res = await fetch('http://localhost:5000/api/register', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email, senha })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.message;
}

async function login(email, senha) {
  const res = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email, senha })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  // salva token para chamadas futuras
  localStorage.setItem('token', data.token);
  localStorage.setItem('email', data.email);
  return 'Login realizado com sucesso!';
}

// Exemplo de uso em um formulário:
document.getElementById('formCadastro').addEventListener('submit', async e => {
  e.preventDefault();
  try {
    const msg = await cadastrar(
      e.target.email.value,
      e.target.senha.value
    );
    alert(msg);
    window.location = 'index.html';
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById('formLogin').addEventListener('submit', async e => {
  e.preventDefault();
  try {
    const msg = await login(
      e.target.email.value,
      e.target.senha.value
    );
    alert(msg);
    window.location = 'conteudo.html';
  } catch (err) {
    alert(err.message);
  }
});
