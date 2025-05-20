const container = document.getElementById('login-container');
let codigoGerado = null;
let usuarioRecuperar = null;
let cooldownTimer = null;
let expiracaoTimer = null;
let cooldownSegundos = 30; // tempo para liberar novo código (cooldown)
let expiracaoSegundos = 300; // 5 minutos para expirar o código

document.addEventListener('DOMContentLoaded', () => {
  const btnEsqueciSenha = document.getElementById('btnEsqueciSenha');

  if (btnEsqueciSenha) {
    btnEsqueciSenha.addEventListener('click', mostrarTelaEsqueciSenha);
  } else {
    console.error('Botão btnEsqueciSenha não encontrado');
  }
});

function mostrarTelaEsqueciSenha() {
  container.innerHTML = `
    <h2>Recuperar Senha</h2>
    <div id="etapa1">
      <input type="email" id="emailRecuperar" placeholder="Digite seu e-mail cadastrado" />
      <button id="btnEnviarCodigo">Enviar Código</button>
    </div>
    <div id="etapa2" style="display:none;">
      <p id="msgCountdown" style="color:blue; font-weight:bold;"></p>
      <input type="text" id="codigoRecuperar" placeholder="Digite o código (6 dígitos)" maxlength="6" />
      <input type="password" id="novaSenha" placeholder="Nova senha (mín 6 caracteres)" />
      <input type="password" id="confirmaSenha" placeholder="Confirme a nova senha" />
      <button id="btnTrocarSenha">Trocar Senha</button>
      <button id="btnReenviarCodigo" disabled style="margin-left: 10px;">Reenviar Código (30s)</button>
    </div>
    <button id="btnVoltarLogin" style="margin-top:10px;">Voltar</button>
    <p id="msgErro" style="color:red;"></p>
    <p id="msgSucesso" style="color:green;"></p>
  `;

  document.getElementById('btnEnviarCodigo').addEventListener('click', enviarCodigo);
  document.getElementById('btnTrocarSenha').addEventListener('click', trocarSenha);
  document.getElementById('btnVoltarLogin').addEventListener('click', () => {
    window.location.reload(); // recarrega a página inicial (login)
  });
  document.getElementById('btnReenviarCodigo').addEventListener('click', reenviarCodigo);
}

function enviarCodigo() {
  mostrarMsg('', 'erro');
  const email = document.getElementById('emailRecuperar').value.trim().toLowerCase();
  if (!validarEmail(email)) {
    mostrarMsg('Informe um e-mail válido', 'erro');
    return;
  }
  let encontrado = false;
  for (let i = 0; i < localStorage.length; i++) {
    const chave = localStorage.key(i);
    if (chave.startsWith('user_')) {
      const dados = JSON.parse(localStorage.getItem(chave));
      if (dados.email.toLowerCase() === email) {
        encontrado = true;
        usuarioRecuperar = chave;
        break;
      }
    }
  }
  if (!encontrado) {
    mostrarMsg('E-mail não encontrado', 'erro');
    return;
  }
  gerarENviarCodigo();
  document.getElementById('etapa1').style.display = 'none';
  document.getElementById('etapa2').style.display = 'block';
  mostrarMsg('Código enviado! Verifique seu e-mail (simulado)', 'sucesso');
  iniciarCooldown();
  iniciarExpiracao();
}

async function gerarENviarCodigo() {
  codigoGerado = gerarCodigo();
  const codigoObj = {
    codigo: codigoGerado,
    expiracao: Date.now() + expiracaoSegundos * 1000 // 5 minutos
  };
  localStorage.setItem(`codigoRecuperar_${usuarioRecuperar}`, JSON.stringify(codigoObj));

  // Enviar o código para o backend que manda email
  const email = document.getElementById('emailRecuperar').value.trim();

  try {
    const response = await fetch('http://localhost:3000/enviar-codigo', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, codigo: codigoGerado }),
    });

    if (!response.ok) {
      const data = await response.json();
      mostrarMsg(`Erro ao enviar email: ${data.erro}`, 'erro');
    } else {
      mostrarMsg('Código enviado! Verifique seu e-mail', 'sucesso');
      console.log('Código enviado:', codigoGerado);
    }
  } catch (err) {
    mostrarMsg('Erro na comunicação com servidor', 'erro');
    console.error(err);
  }
}


function iniciarCooldown() {
  let segundos = cooldownSegundos;
  const btnReenviar = document.getElementById('btnReenviarCodigo');
  const msgCountdown = document.getElementById('msgCountdown');

  btnReenviar.disabled = true;
  btnReenviar.textContent = `Reenviar Código (${segundos}s)`;
  msgCountdown.textContent = `Código válido por ${formatTempo(expiracaoSegundos)}`;

  cooldownTimer = setInterval(() => {
    segundos--;
    btnReenviar.textContent = `Reenviar Código (${segundos}s)`;
    if (segundos <= 0) {
      clearInterval(cooldownTimer);
      btnReenviar.disabled = false;
      btnReenviar.textContent = 'Reenviar Código';
    }
  }, 1000);
}

function iniciarExpiracao() {
  const msgCountdown = document.getElementById('msgCountdown');
  let segundosRestantes = Math.floor((JSON.parse(localStorage.getItem(`codigoRecuperar_${usuarioRecuperar}`)).expiracao - Date.now()) / 1000);

  if (expiracaoTimer) clearInterval(expiracaoTimer);

  expiracaoTimer = setInterval(() => {
    segundosRestantes--;
    if (segundosRestantes <= 0) {
      clearInterval(expiracaoTimer);
      msgCountdown.textContent = 'Código expirado. Solicite um novo código.';
      document.getElementById('btnReenviarCodigo').disabled = false;
    } else {
      msgCountdown.textContent = `Código válido por ${formatTempo(segundosRestantes)}`;
    }
  }, 1000);
}

function reenviarCodigo() {
  mostrarMsg('', 'erro');
  gerarENviarCodigo();
  mostrarMsg('Novo código enviado! Verifique seu e-mail (simulado)', 'sucesso');
  iniciarCooldown();
  iniciarExpiracao();
}

function trocarSenha() {
  mostrarMsg('', 'erro');
  const codigoInput = document.getElementById('codigoRecuperar').value.trim();
  const novaSenha = document.getElementById('novaSenha').value;
  const confirmaSenha = document.getElementById('confirmaSenha').value;

  if (!codigoInput || !novaSenha || !confirmaSenha) {
    mostrarMsg('Preencha todos os campos', 'erro');
    return;
  }

  if (novaSenha.length < 6) {
    mostrarMsg('Senha muito fraca. Use no mínimo 6 caracteres.', 'erro');
    return;
  }

  if (!usuarioRecuperar) {
    mostrarMsg('Erro interno: usuário não encontrado', 'erro');
    return;
  }

  const codigoObjJSON = localStorage.getItem(`codigoRecuperar_${usuarioRecuperar}`);
  if (!codigoObjJSON) {
    mostrarMsg('Nenhum código gerado para este usuário', 'erro');
    return;
  }

  const codigoObj = JSON.parse(codigoObjJSON);

  if (Date.now() > codigoObj.expiracao) {
    mostrarMsg('Código expirado. Solicite um novo código.', 'erro');
    return;
  }

  if (codigoInput !== codigoObj.codigo) {
    mostrarMsg('Código inválido', 'erro');
    return;
  }

  if (novaSenha !== confirmaSenha) {
    mostrarMsg('Senhas não conferem', 'erro');
    return;
  }

  const dados = JSON.parse(localStorage.getItem(usuarioRecuperar));
  dados.senha = novaSenha;
  localStorage.setItem(usuarioRecuperar, JSON.stringify(dados));
  localStorage.removeItem(`codigoRecuperar_${usuarioRecuperar}`);
  mostrarMsg('Senha alterada com sucesso!', 'sucesso');

  // limpa campos
  document.getElementById('codigoRecuperar').value = '';
  document.getElementById('novaSenha').value = '';
  document.getElementById('confirmaSenha').value = '';

  if (cooldownTimer) clearInterval(cooldownTimer);
  if (expiracaoTimer) clearInterval(expiracaoTimer);

  setTimeout(() => {
    window.location.href = 'index.html'; // redireciona para login após 3 segundos
  }, 3000);
}

function gerarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function mostrarMsg(texto, tipo) {
  const erro = document.getElementById('msgErro');
  const sucesso = document.getElementById('msgSucesso');
  if (tipo === 'erro') {
    erro.textContent = texto;
    sucesso.textContent = '';
  } else {
    sucesso.textContent = texto;
    erro.textContent = '';
  }
}

function formatTempo(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
}
