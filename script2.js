// Pega dados do localStorage ou inicializa
let moedas = parseInt(localStorage.getItem('moedas')) || 0;
let inventario = JSON.parse(localStorage.getItem('inventario')) || [];

// Atualiza exibição do saldo
function atualizarSaldo() {
  document.getElementById('moedaSaldo').innerText = moedas;
}

// Atualiza inventário na tela
function atualizarInventario() {
  const inventarioDiv = document.getElementById('inventario');
  if (!inventarioDiv) return; // evita erro em páginas que não tem inventario

  inventarioDiv.innerHTML = ''; // Limpa o inventário atual
  if (inventario.length === 0) {
    inventarioDiv.innerHTML = '<p>Você não possui itens.</p>';
    return;
  }

  inventario.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item-inventario');

    const img = document.createElement('img');

    switch(item) {
      case 'chapeu':
        img.src = 'img/chapeu.png';
        img.alt = 'Chapéu Espacial';
        break;
      case 'oculos':
        img.src = 'img/oculos.png';
        img.alt = 'Óculos';
        break;
      case 'fundo':
        img.src = 'img/fundo-galaxia.png';
        img.alt = 'Fundo Buraco Negro';
        break;
      case 'fundo1':
        img.src = 'img/fundo-espaco.png';
        img.alt = 'Fundo Espaço';
        break;
      default:
        img.src = 'img/default.png';
        img.alt = item;
    }

    img.style.width = '100px';
    img.style.height = '100px';

    const nome = document.createElement('p');
    nome.textContent = ({
      chapeu: 'Chapéu Espacial',
      oculos: 'Óculos',
      fundo: 'Fundo Buraco Negro',
      fundo1: 'Fundo Espaço'
    })[item] || item;

    const botaoEquipar = document.createElement('button');
    botaoEquipar.textContent = 'Equipar';
    botaoEquipar.onclick = () => {
      alert(`Você equipou: ${nome.textContent}`);
      const userAvatar = document.getElementById('userAvatar');

      if (item === 'fundo' || item === 'fundo1') {
        localStorage.setItem('fundoEquipado', item);
        aplicarFundo(item);
      } else {
        localStorage.setItem('itemAvatarEquipado', item);
        equiparNoAvatar(item);
      }
    };

    const botaoDesequipar = document.createElement('button');
    botaoDesequipar.textContent = 'Desequipar';
    botaoDesequipar.onclick = () => {
  if (item === 'fundo' || item === 'fundo1') {
    localStorage.removeItem('fundoEquipado');
    aplicarFundo(null);
  } else {
    const userAvatar = document.getElementById('userAvatar');
    const itemNoAvatar = userAvatar.querySelector(`.${item}`);
    if (itemNoAvatar) userAvatar.removeChild(itemNoAvatar);

    // Remove só o item específico
    const equipados = JSON.parse(localStorage.getItem('itensAvatarEquipados')) || {};
    delete equipados[item];
    localStorage.setItem('itensAvatarEquipados', JSON.stringify(equipados));
  }

  alert(`Você desequipou: ${nome.textContent}`);
};

    const botoesDiv = document.createElement('div');
    botoesDiv.style.display = 'flex';
    botoesDiv.style.flexDirection = 'column';
    botoesDiv.style.gap = '5px';

    botoesDiv.appendChild(botaoEquipar);
    botoesDiv.appendChild(botaoDesequipar);

    itemDiv.appendChild(img);
    itemDiv.appendChild(nome);
    itemDiv.appendChild(botoesDiv);
    inventarioDiv.appendChild(itemDiv);
  });
}

// Função para comprar item
function comprarItem(nome, preco) {
  if (inventario.includes(nome)) {
    alert('Você já comprou esse item!');
    return;
  }
  if (moedas < preco) {
    alert('Moedas insuficientes!');
    return;
  }

  moedas -= preco;
  inventario.push(nome);

  localStorage.setItem('moedas', moedas);
  localStorage.setItem('inventario', JSON.stringify(inventario));

  atualizarSaldo();
  atualizarInventario();

  const somCompra = document.getElementById('compraSom');
  if (somCompra) somCompra.play();

  alert('Compra realizada com sucesso!');
}

// Aplica fundo na tela
function aplicarFundo(item) {
  document.body.classList.remove('fundo-galaxia', 'fundo-espaco');

  if (item === 'fundo') {
    document.body.classList.add('fundo-galaxia');
  } else if (item === 'fundo1') {
    document.body.classList.add('fundo-espaco');
  }
}

// Equipa item no avatar (visual)
function equiparNoAvatar(item) {
  const userAvatar = document.getElementById('userAvatar');

  if (userAvatar.querySelector(`.${item}`)) return;

  const imgEquipado = document.createElement('img');
  imgEquipado.classList.add('item-equipado', item);

  switch(item) {
    case 'chapeu':
      imgEquipado.src = 'img/chapeu.png';
      break;
    case 'oculos':
      imgEquipado.src = 'img/oculos.png';
      break;
    default:
      return;
  }

  userAvatar.appendChild(imgEquipado);

  // Atualiza localStorage com múltiplos itens
  const equipados = JSON.parse(localStorage.getItem('itensAvatarEquipados')) || {};
  equipados[item] = true;
  localStorage.setItem('itensAvatarEquipados', JSON.stringify(equipados));
}


// Carrega itens equipados ao abrir
// Carrega itens equipados ao abrir, com exceção de algumas páginas
function carregarItemEquipado() {
  
  const nomePagina = window.location.pathname.split('/').pop();
  const paginasSemFundo = ['mapa.html', 'telaanimada.html']; // coloque aqui as páginas onde NÃO quer fundo

  const fundoItem = localStorage.getItem('fundoEquipado');
  const itensAvatar = JSON.parse(localStorage.getItem('itensAvatarEquipados')) || {};

  if (!paginasSemFundo.includes(nomePagina)) {
    if (fundoItem) aplicarFundo(fundoItem);
  }

  for (const item in itensAvatar) {
    if (itensAvatar[item]) {
      equiparNoAvatar(item);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  carregarItemEquipado();
  atualizarSaldo();
  atualizarInventario();
});


// Ganha 1 moeda a cada 10 segundos
setInterval(() => {
  moedas += 1;
  localStorage.setItem('moedas', moedas);
  atualizarSaldo();
}, 10000);
