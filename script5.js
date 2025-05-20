const canvas = document.getElementById("game"),
      ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const fundoSrc = "img/estrelas.jpg";
const naveSrc = "img/nave.png";
const planetaSrcs = [
  "img/planetas/Marte.jpg",
  "img/planetas/Terra.jpg",
  "img/planetas/Saturno.jpg",
  "img/planetas/Jupiter.jpg",
  "img/planetas/Venus.jpg"
];

// Variáveis globais para o jogo
let gameOver = false;
let pontos = 0;
const planetas = [];

function loadImage(src) {
  return new Promise(res => {
    const img = new Image();
    img.src = src;
    img.onload = () => res(img);
    img.onerror = () => {
      console.warn("erro ao carregar:", src);
      res(null);
    };
  });
}

Promise.all([
  loadImage(fundoSrc),
  loadImage(naveSrc),
  ...planetaSrcs.map(loadImage)
]).then(imgs => {
  const fundoImg = imgs[0],
    naveImg = imgs[1],
    planetaImgs = imgs.slice(2).filter(i => i);

  // Mostrar recorde na tela inicial
  document.getElementById("recorde").innerText = localStorage.getItem("highScore") || "0";

  // Iniciar jogo ao clicar
  document.getElementById("btnStart").onclick = () => {
    document.getElementById("startScreen").style.display = "none";
    canvas.style.display = "block";
    document.getElementById("pontos").style.display = "block";
    iniciarJogo(fundoImg, naveImg, planetaImgs);
  };
});

function iniciarJogo(fundoImg, naveImg, planetaImgs) {
  // Reset variáveis globais para novo jogo
  pontos = 0;
  gameOver = false;
  planetas.length = 0;

  const nave = { x: 100, y: canvas.height / 2, w: 80, h: 50, speed: 5 };
  const PS = 80,
    R = PS / 2,
    GAP_H = 300,
    GAP_V = PS * 2;
  const baseSpeed = 4;

  function colisaoRound(n, p) {
    const cx = p.x + R,
      cy = p.y + R;
    const closestX = Math.max(n.x, Math.min(cx, n.x + n.w));
    const closestY = Math.max(n.y, Math.min(cy, n.y + n.h));
    const dx = cx - closestX,
      dy = cy - closestY;
    return dx * dx + dy * dy < R * R;
  }

  function drawPlaneta3D(x, y, diam, img) {
    const r = diam / 2,
      cx = x + r,
      cy = y + r;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, x, y, diam, diam);
    const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.2, cx, cy, r);
    grad.addColorStop(0, "rgba(255,255,255,0.3)");
    grad.addColorStop(1, "rgba(0,0,0,0.5)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  function criarPlaneta() {
    const last = planetas[planetas.length - 1];
    if (last && last.x > canvas.width - GAP_H) return;
    let y,
      t = 0;
    do {
      y = Math.random() * (canvas.height - PS);
      if (++t > 10) break;
    } while (last && Math.abs(y - last.y) < GAP_V);
    const img = planetaImgs[Math.floor(Math.random() * planetaImgs.length)];
    planetas.push({ x: canvas.width, y, img });
  }

  function mostrarGameOver() {
    const modal = document.getElementById("gameOverModal");
    const fs = document.getElementById("finalScore");
    const hs = document.getElementById("highScore");
    modal.style.visibility = "visible";
    fs.innerText = pontos;
    const prev = parseInt(localStorage.getItem("highScore") || "0", 10);
    const novo = Math.max(prev, pontos);
    localStorage.setItem("highScore", novo);
    hs.innerText = novo;
  }

  function atualizar() {
    if (gameOver) return;

    ctx.drawImage(fundoImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(naveImg, nave.x, nave.y, nave.w, nave.h);

    const speed = baseSpeed + Math.floor(pontos / 1000);

    for (let i = planetas.length - 1; i >= 0; i--) {
      const p = planetas[i];
      p.x -= speed;
      drawPlaneta3D(p.x, p.y, PS, p.img);

      if (colisaoRound(nave, p)) {
        gameOver = true;
        mostrarGameOver();
        return;
      }
      if (p.x + PS < 0) planetas.splice(i, 1);
    }

    pontos++;
    document.getElementById("pontos").innerText = `Pontos: ${pontos}`;
    requestAnimationFrame(atualizar);
  }

  const intervaloPlanetas = setInterval(() => {
    if (!gameOver) criarPlaneta();
  }, 1500);

  window.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") nave.y = Math.max(50, nave.y - nave.speed * 10);
    else if (e.key === "ArrowDown") nave.y = Math.min(canvas.height - 100, nave.y + nave.speed * 10);
  });

  // Botão Restart volta para tela inicial
  document.getElementById("btnRestart").onclick = () => {
    voltarTelaInicio();
  };
  atualizar();
}

function voltarTelaInicio() {
  gameOver = false;
  pontos = 0;
  planetas.length = 0;
  document.getElementById("pontos").innerText = `Pontos: 0`;

  document.getElementById("gameOverModal").style.visibility = "hidden";
  document.getElementById("startScreen").style.display = "flex";
  canvas.style.display = "none";
  document.getElementById("pontos").style.display = "none";

  // Atualiza recorde na tela inicial
  document.getElementById("recorde").innerText = localStorage.getItem("highScore") || "0";

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
