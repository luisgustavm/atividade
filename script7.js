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
