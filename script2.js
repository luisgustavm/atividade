// Pega dados do localStorage ou inicializa
let moedas = parseInt(localStorage.getItem('moedas')) || 0;
let inventario = JSON.parse(localStorage.getItem('inventario')) || [];

// Atualiza exibição do saldo
function atualizarSaldo() {
  document.getElementById('moedaSaldo').innerText = moedas;
}

// Atualiza inventário na tela
function atualizarInventario() {
  const inventarioDiv = document.getElementById('inventarioContainer');
  inventarioDiv.innerHTML = '';

  if (inventario.length === 0) {
    inventarioDiv.innerHTML = '<p>Você não possui itens.</p>';
    return;
  }

  inventario.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item-inventario');

    const img = document.createElement('img');

    if (item === 'chapeu') {
      img.src = 'img/chapeu.png';
      img.alt = 'Chapéu Espacial';
    } else if (item === 'oculos') {
      img.src = 'img/oculos.png';
      img.alt = 'Óculos Cósmicos';
    } else if (item === 'fundo') {
      img.src = 'img/fundo-galaxia.png';
      img.alt = 'Fundo Galáxia';
    } else {
      img.src = 'img/default.png';
      img.alt = item;
    }

    img.style.width = '100px';
    img.style.height = '100px';

    const nome = document.createElement('p');
    nome.textContent = (() => {
      switch(item) {
        case 'chapeu': return 'Chapéu Espacial';
        case 'oculos': return 'Óculos Cósmicos';
        case 'fundo': return 'Fundo Galáxia';
        default: return item;
      }
    })();

    const botaoEquipar = document.createElement('button');
    botaoEquipar.textContent = 'Equipar';

    botaoEquipar.onclick = () => {
      alert(`Você equipou: ${nome.textContent}`);

      const userAvatar = document.getElementById('userAvatar');
      const itemAtual = userAvatar.querySelector('.item-equipado');
      if (itemAtual) {
        userAvatar.removeChild(itemAtual);
      }

      const imgEquipado = document.createElement('img');
      imgEquipado.classList.add('item-equipado', item);
      switch(item) {
        case 'chapeu':
          imgEquipado.src = 'img/chapeu.png';
          break;
        case 'oculos':
          imgEquipado.src = 'img/oculos.png';
          break;
        case 'fundo':
          imgEquipado.src = 'img/fundo-galaxia.png';
          break;
        default:
          imgEquipado.src = '';
      }

      userAvatar.appendChild(imgEquipado);

      // Salva o item equipado no localStorage
      localStorage.setItem('itemEquipado', item);
    };

    itemDiv.appendChild(img);
    itemDiv.appendChild(nome);
    itemDiv.appendChild(botaoEquipar);

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

  // Tocar som de compra
  const somCompra = document.getElementById('compraSom');
  if (somCompra) somCompra.play();

  alert('Compra realizada com sucesso!');
}

function carregarItemEquipado() {
  const itemEquipadoSalvo = localStorage.getItem('itemEquipado');
  if (!itemEquipadoSalvo) return;

  const userAvatar = document.getElementById('userAvatar');

  const itemAtual = userAvatar.querySelector('.item-equipado');
  if (itemAtual) {
    userAvatar.removeChild(itemAtual);
  }

  const imgEquipado = document.createElement('img');
  imgEquipado.classList.add('item-equipado', itemEquipadoSalvo);

  switch(itemEquipadoSalvo) {
    case 'chapeu':
      imgEquipado.src = 'img/chapeu.png';
      break;
    case 'oculos':
      imgEquipado.src = 'img/oculos.png';
      break;
    case 'fundo':
      imgEquipado.src = 'img/fundo-galaxia.png';
      break;
    default:
      imgEquipado.src = '';
  }

  userAvatar.appendChild(imgEquipado);
}

// Inicializa a página
carregarItemEquipado();
atualizarSaldo();
atualizarInventario();

setInterval(() => {
  moedas += 1;
  localStorage.setItem('moedas', moedas);
  atualizarSaldo();
}, 10000);
