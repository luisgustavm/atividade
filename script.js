
// Função para logout (deve ficar fora do DOMContentLoaded para ser acessível de fora)
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html"; // Página de login
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const btnEsqueciSenha = document.getElementById('btnEsqueciSenha');
  if (btnEsqueciSenha) {
    btnEsqueciSenha.addEventListener('click', mostrarTelaEsqueciSenha);
  }
  // Fundo animado só para index.html e cadastro.html
  if (path.includes("index.html") || path.includes("cadastro.html")) {
    // Criar estrelas animadas
    for (let i = 0; i < 120; i++) {
      const orbit = document.createElement("div");
      orbit.className = "star-orbit";
      orbit.style.top = Math.random() * 100 + "vh";
      orbit.style.left = Math.random() * 100 + "vw";
      orbit.style.animationDuration = (30 + Math.random() * 60) + "s";

      const star = document.createElement("div");
      star.className = "star";
      const size = Math.random() * 3 + 1;
      star.style.width = star.style.height = size + "px";
      star.style.left = Math.random() * 40 + 10 + "px";

      orbit.appendChild(star);
      document.body.appendChild(orbit);
    }

    // Criar planetas no fundo
    const planets = [
      { size: 80, top: '10vh', left: '10vw', image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg' },
      { size: 100, top: '75vh', left: '20vw', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Jupiter.jpg/500px-Jupiter.jpg' },
      { size: 120, top: '25vh', left: '75vw', image: 'https://img.odcdn.com.br/wp-content/uploads/2022/12/Terra.jpg' },
      { size: 70, top: '70vh', left: '85vw', image: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Uranus_%28Edited%29.jpg' },
      { size: 90, top: '50vh', left: '50vw', image: 'https://s2.glbimg.com/9qsld0QqbkS4vlbYgwaISENeQNA=/e.glbimg.com/og/ed/f/original/2019/02/21/neptune1.en.jpg' }
    ];

    planets.forEach(p => {
      const planet = document.createElement('div');
      planet.className = 'planet';
      planet.style.width = `${p.size}px`;
      planet.style.height = `${p.size}px`;
      planet.style.top = p.top;
      planet.style.left = p.left;
      planet.style.backgroundImage = `url(${p.image})`;
      planet.style.opacity = "0.6";
      document.body.appendChild(planet);
    });
  }
// === Cadastro ===
  const formCadastro = document.querySelector("#formCadastro");
  if (formCadastro) {
    formCadastro.addEventListener("submit", e => {
      e.preventDefault();

      const usuario = formCadastro.usuario.value.trim();
      const senha = formCadastro.senha.value;
      const confirmSenha = formCadastro.confirmSenha.value;
      const email = formCadastro.email.value.trim();

      if (senha !== confirmSenha) {
        alert("As senhas não coincidem!");
        return;
      }

      if (localStorage.getItem(`user_${usuario}`)) {
        alert("Usuário já existe!");
        return;
      }

      const dadosUsuario = {
        senha: senha,
        email: email
      };

      localStorage.setItem(`user_${usuario}`, JSON.stringify(dadosUsuario));
      alert("Cadastro realizado com sucesso!");

      window.location.href = "index.html"; // redireciona para login
    });
  }

  // === Login ===
  const formLogin = document.querySelector("#formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", e => {
      e.preventDefault();

      const usuario = formLogin.usuario.value.trim();
      const senha = formLogin.senha.value;

      const dadosUsuarioJSON = localStorage.getItem(`user_${usuario}`);

      if (!dadosUsuarioJSON) {
        alert("Usuário não encontrado!");
        return;
      }

      const dadosUsuario = JSON.parse(dadosUsuarioJSON);

      if (senha !== dadosUsuario.senha) {
        alert("Senha incorreta!");
        return;
      }

      localStorage.setItem("usuarioLogado", usuario);
      alert("Login realizado com sucesso!");
      window.location.href = "conteudo.html";
    });
  }


  // === Verifica se está logado e mostra popup ===
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if (usuarioLogado) {
    const dadosUsuarioJSON = localStorage.getItem(`user_${usuarioLogado}`);
    if (dadosUsuarioJSON) {
      const dadosUsuario = JSON.parse(dadosUsuarioJSON);

      const userInfoPopup = document.getElementById("userInfoPopup");
      if (userInfoPopup) {
        userInfoPopup.querySelector("p:nth-of-type(1) span").textContent = usuarioLogado;
        userInfoPopup.querySelector("p:nth-of-type(2) span").textContent = dadosUsuario.email || "Não informado";
      }

      const avatar = document.getElementById("userAvatar");
      const closeBtn = document.getElementById("closePopup");

      if (avatar && userInfoPopup) {
        avatar.addEventListener("click", () => {
          userInfoPopup.style.display = userInfoPopup.style.display === "block" ? "none" : "block";
        });

        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            userInfoPopup.style.display = "none";
          });
        }

        window.addEventListener("click", (e) => {
          if (!userInfoPopup.contains(e.target) && !avatar.contains(e.target)) {
            userInfoPopup.style.display = "none";
          }
        });
      }
    } else {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "index.html";
    }
  } else {
    // Se estiver na página de conteúdo e não estiver logado, redireciona
    if (window.location.pathname.includes("conteudo.html")) {
      window.location.href = "index.html";
    }
  }

  // === Avatar ===
  const avatarImg = document.querySelector("#userAvatar img");
  const avatarInput = document.getElementById("avatarInput");
  const changeAvatarBtn = document.getElementById("changeAvatarBtn");

  if (changeAvatarBtn && avatarInput && avatarImg) {
    // Carrega avatar salvo (se houver)
    const avatarSalvo = localStorage.getItem(`avatar_${usuarioLogado}`);
    if (avatarSalvo) {
      avatarImg.src = avatarSalvo;
    }

    // Clica no input ao clicar no botão
    changeAvatarBtn.addEventListener("click", () => {
      avatarInput.click();
    });

    // Quando o usuário escolhe uma nova imagem
    avatarInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imageData = e.target.result;
          avatarImg.src = imageData;
          localStorage.setItem(`avatar_${usuarioLogado}`, imageData);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // === Sistema de estrelas para avaliação ===
  const estrelas = document.querySelectorAll(".estrela");
  const inputNota = document.getElementById("nota");

  function atualizarEstrelas(nota) {
    estrelas.forEach(estrela => {
      const valor = parseInt(estrela.dataset.valor);
      estrela.classList.toggle("selecionada", valor <= nota);
    });
  }

  if (estrelas.length && inputNota) {
    estrelas.forEach(estrela => {
      estrela.addEventListener("click", () => {
        const valor = parseInt(estrela.dataset.valor);
        inputNota.value = valor;
        atualizarEstrelas(valor);
      });

      estrela.addEventListener("mouseenter", () => {
        const valor = parseInt(estrela.dataset.valor);
        atualizarEstrelas(valor);
      });

      estrela.addEventListener("mouseleave", () => {
        atualizarEstrelas(parseInt(inputNota.value));
      });
    });

    atualizarEstrelas(parseInt(inputNota.value));
  }

  // Função para enviar quiz (pode ser chamada no evento submit do formulário)
  window.enviarQuiz = function () {
    const respostasUsuario = [];
    let todasRespondidas = true;

    perguntas.forEach((q, i) => {
      const radios = document.getElementsByName(`q${i}`);
      let respostaSelecionada = null;

      for (const radio of radios) {
        if (radio.checked) {
          respostaSelecionada = parseInt(radio.value);
          break;
        }
      }

      if (respostaSelecionada === null) {
        todasRespondidas = false;
      }

      respostasUsuario.push(respostaSelecionada);
    });

    if (!todasRespondidas) {
      alert("Responda todas as perguntas antes de enviar.");
      return;
    }

    localStorage.setItem("respostasUsuario", JSON.stringify(respostasUsuario));
    window.open("resultado.html", "_blank");
  };
  // === Feedback form ===
  const feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Mostrar mensagem de sucesso
      const mensagemEnviada = document.getElementById("mensagem-enviada");
      if (mensagemEnviada) {
        mensagemEnviada.style.display = "block";
      }

      // Limpar formulário
      this.reset();

      // Reset estrelas
      if (inputNota) {
        inputNota.value = 0;
        atualizarEstrelas(0);
      }
    });
  }
// Inicializa moedas e inventário se não existirem
if (!localStorage.getItem("moedas")) localStorage.setItem("moedas", "0");
if (!localStorage.getItem("inventario")) localStorage.setItem("inventario", "[]");

// Atualiza saldo em todos os lugares
function atualizarSaldoTela() {
  const moedas = parseInt(localStorage.getItem("moedas")) || 0;
  document.querySelectorAll("#moedaSaldo").forEach(el => {
    el.textContent = moedas;
  });
}

// Gera 1 moeda a cada 10 segundos
setInterval(() => {
  let moedas = parseInt(localStorage.getItem("moedas")) || 0;
  moedas += 1;
  localStorage.setItem("moedas", moedas.toString());
  atualizarSaldoTela();
}, 10000);

});
