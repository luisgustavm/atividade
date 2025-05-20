
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

  // === Quiz ===
  const perguntas = [
  {
    pergunta: "Qual planeta é conhecido por seus anéis?",
    opcoes: ["Júpiter", "Saturno", "Netuno", "Marte"],
    correta: 1,
    explicacao: "Saturno é famoso por seus anéis impressionantes compostos por gelo e rocha."
  },
  {
    pergunta: "Qual é o planeta mais próximo do Sol?",
    opcoes: ["Vênus", "Terra", "Mercúrio", "Marte"],
    correta: 2,
    explicacao: "Mercúrio é o planeta mais próximo do Sol, a cerca de 58 milhões de km."
  },
  {
    pergunta: "Qual planeta tem o maior vulcão do sistema solar?",
    opcoes: ["Terra", "Marte", "Júpiter", "Vênus"],
    correta: 1,
    explicacao: "Marte abriga o Monte Olimpo, o maior vulcão conhecido do sistema solar."
  },
  {
    pergunta: "Qual planeta é conhecido como planeta azul?",
    opcoes: ["Urano", "Terra", "Netuno", "Marte"],
    correta: 1,
    explicacao: "A Terra é chamada de planeta azul por causa da abundância de água em sua superfície."
  },
  {
    pergunta: "Qual planeta gira de lado?",
    opcoes: ["Urano", "Netuno", "Saturno", "Mercúrio"],
    correta: 0,
    explicacao: "Urano tem um eixo de rotação inclinado em cerca de 98 graus, praticamente de lado."
  },
  {
    pergunta: "Qual planeta tem os dias mais longos?",
    opcoes: ["Vênus", "Marte", "Saturno", "Netuno"],
    correta: 0,
    explicacao: "Um dia em Vênus dura 243 dias terrestres, mais que seu ano."
  },
  {
    pergunta: "Qual planeta tem a maior lua do sistema solar?",
    opcoes: ["Saturno", "Netuno", "Júpiter", "Marte"],
    correta: 2,
    explicacao: "Júpiter tem a maior lua, Ganimedes, maior que o planeta Mercúrio."
  },
  {
    pergunta: "Qual planeta tem clima mais extremo?",
    opcoes: ["Terra", "Vênus", "Netuno", "Marte"],
    correta: 2,
    explicacao: "Netuno tem ventos de até 2.000 km/h, os mais rápidos do sistema solar."
  },
  {
    pergunta: "Qual planeta tem a maior tempestade do sistema solar?",
    opcoes: ["Saturno", "Júpiter", "Netuno", "Urano"],
    correta: 1,
    explicacao: "Júpiter possui a Grande Mancha Vermelha, uma tempestade maior que a Terra."
  },
  {
    pergunta: "Qual planeta tem composição parecida com a da Terra?",
    opcoes: ["Vênus", "Netuno", "Saturno", "Urano"],
    correta: 0,
    explicacao: "Vênus é considerado o planeta gêmeo da Terra devido ao tamanho e composição rochosa."
  },

  // 20 perguntas adicionais
  {
    pergunta: "Qual planeta é conhecido por sua cor vermelha?",
    opcoes: ["Júpiter", "Marte", "Mercúrio", "Urano"],
    correta: 1,
    explicacao: "Marte é vermelho por causa do óxido de ferro em sua superfície."
  },
  {
    pergunta: "Qual planeta tem uma atmosfera rica em dióxido de carbono e nuvens de ácido sulfúrico?",
    opcoes: ["Terra", "Vênus", "Saturno", "Netuno"],
    correta: 1,
    explicacao: "Vênus tem uma atmosfera tóxica e extremamente quente, com dióxido de carbono e nuvens ácidas."
  },
  {
    pergunta: "Qual planeta tem os anéis menos visíveis?",
    opcoes: ["Saturno", "Júpiter", "Urano", "Netuno"],
    correta: 1,
    explicacao: "Júpiter tem anéis, mas são finos e difíceis de ver."
  },
  {
    pergunta: "Qual planeta possui 27 luas conhecidas?",
    opcoes: ["Urano", "Saturno", "Terra", "Marte"],
    correta: 0,
    explicacao: "Urano tem 27 luas conhecidas, incluindo Titania e Oberon."
  },
  {
    pergunta: "Qual planeta demora mais tempo para dar a volta ao Sol?",
    opcoes: ["Netuno", "Urano", "Júpiter", "Saturno"],
    correta: 0,
    explicacao: "Netuno leva 165 anos terrestres para completar uma volta ao redor do Sol."
  },
  {
    pergunta: "Qual planeta é o maior do sistema solar?",
    opcoes: ["Saturno", "Júpiter", "Netuno", "Vênus"],
    correta: 1,
    explicacao: "Júpiter é o maior planeta do sistema solar."
  },
  {
    pergunta: "Qual planeta possui as luas Fobos e Deimos?",
    opcoes: ["Terra", "Marte", "Saturno", "Urano"],
    correta: 1,
    explicacao: "Fobos e Deimos são as duas pequenas luas de Marte."
  },
  {
    pergunta: "Qual planeta é visível a olho nu e é o mais brilhante no céu noturno?",
    opcoes: ["Vênus", "Netuno", "Mercúrio", "Urano"],
    correta: 0,
    explicacao: "Vênus é o planeta mais brilhante visto da Terra."
  },
  {
    pergunta: "Qual planeta tem o campo magnético mais forte?",
    opcoes: ["Júpiter", "Saturno", "Terra", "Urano"],
    correta: 0,
    explicacao: "O campo magnético de Júpiter é o mais forte entre os planetas."
  },
  {
    pergunta: "Qual planeta quase não tem atmosfera?",
    opcoes: ["Mercúrio", "Vênus", "Marte", "Terra"],
    correta: 0,
    explicacao: "Mercúrio tem uma exosfera muito tênue, quase sem atmosfera."
  }
];

  const quizForm = document.getElementById("quizForm");
  if (quizForm) {
    perguntas.forEach((q, index) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p><strong>${index + 1}. ${q.pergunta}</strong></p>
        ${q.opcoes.map((op, i) => `
          <label>
            <input type="radio" name="q${index}" value="${i}">
            ${op}
          </label><br>`).join('')}
        <hr>
      `;
      quizForm.appendChild(div);
    });
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
