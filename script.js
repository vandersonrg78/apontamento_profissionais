const profissionais = JSON.parse(localStorage.getItem('profissionais')) || [];
const producao = JSON.parse(localStorage.getItem('producaoProfissional')) || [];

function atualizarListaProfissionais() {
  const select = document.getElementById('profissional');
  select.innerHTML = '';
  profissionais.forEach(nome => {
    const option = document.createElement('option');
    option.value = nome;
    option.textContent = nome;
    select.appendChild(option);
  });
}

function novoProfissional() {
  const nome = prompt('Digite o nome do novo profissional:');
  if (nome && !profissionais.includes(nome)) {
    profissionais.push(nome);
    localStorage.setItem('profissionais', JSON.stringify(profissionais));
    atualizarListaProfissionais();
  }
}

function registrarProducao() {
  const data = document.getElementById('data').value;
  const profissional = document.getElementById('profissional').value;
  const quantidade = parseFloat(document.getElementById('quantidade').value);
  const valor = parseFloat(document.getElementById('valor').value);

  if (!data || !profissional || isNaN(quantidade) || isNaN(valor)) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }

  producao.push({ data, profissional, quantidade, valor });
  localStorage.setItem('producaoProfissional', JSON.stringify(producao));
  atualizarResumo();
}

function atualizarResumo() {
  const resumo = document.getElementById('resumo');
  resumo.innerHTML = '<h3>Resumo da Produção</h3>';

  const filtroData = document.getElementById('filtroData').value;
  const filtroProfissional = document.getElementById('filtroProfissional').value.toLowerCase();

  const agrupado = {};
  producao.forEach(entry => {
    if ((filtroData && entry.data !== filtroData) ||
        (filtroProfissional && !entry.profissional.toLowerCase().includes(filtroProfissional))) {
      return;
    }

    const chave = `${entry.data} - ${entry.profissional}`;
    if (!agrupado[chave]) agrupado[chave] = 0;
    agrupado[chave] += entry.quantidade * entry.valor;
  });

  for (const chave in agrupado) {
    const div = document.createElement('div');
    div.className = 'dia';
    div.innerHTML = `<strong>${chave}</strong>: <span>R$ ${agrupado[chave].toFixed(2)}</span>`;
    resumo.appendChild(div);
  }
}

function imprimirRelatorio() {
  window.print();
}

atualizarListaProfissionais();
atualizarResumo();
