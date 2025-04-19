
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

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
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

    const chave = `${entry.data}|${entry.profissional}|${entry.valor}`;
    if (!agrupado[chave]) agrupado[chave] = { quantidade: 0, total: 0 };
    agrupado[chave].quantidade += entry.quantidade;
    agrupado[chave].total += entry.quantidade * entry.valor;
  });

  for (const chave in agrupado) {
    const [data, profissional, valor] = chave.split('|');
    const dados = agrupado[chave];
    const div = document.createElement('div');
    div.className = 'dia';
    div.innerHTML = `<strong>${formatarData(data)} - ${profissional}</strong><br>
                     Quantidade: ${dados.quantidade} sacos<br>
                     Valor por saco: R$ ${parseFloat(valor).toFixed(2)}<br>
                     Total: <span>R$ ${dados.total.toFixed(2)}</span>`;
    resumo.appendChild(div);
  }
}

function imprimirRelatorio() {
  window.print();
}

async function exportarParaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;
  doc.setFontSize(12);
  doc.text('Resumo da Produção', 10, y);
  y += 10;

  const filtroData = document.getElementById('filtroData').value;
  const filtroProfissional = document.getElementById('filtroProfissional').value.toLowerCase();

  const agrupado = {};
  producao.forEach(entry => {
    if ((filtroData && entry.data !== filtroData) ||
        (filtroProfissional && !entry.profissional.toLowerCase().includes(filtroProfissional))) {
      return;
    }

    const chave = `${entry.data}|${entry.profissional}|${entry.valor}`;
    if (!agrupado[chave]) agrupado[chave] = { quantidade: 0, total: 0 };
    agrupado[chave].quantidade += entry.quantidade;
    agrupado[chave].total += entry.quantidade * entry.valor;
  });

  for (const chave in agrupado) {
    const [data, profissional, valor] = chave.split('|');
    const dados = agrupado[chave];
    const linha = `${formatarData(data)} - ${profissional}: ${dados.quantidade} sacos | R$ ${parseFloat(valor).toFixed(2)} por saco | Total: R$ ${dados.total.toFixed(2)}`;
    doc.text(linha, 10, y);
    y += 10;
    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  }

  doc.save('resumo_producao.pdf');
}

atualizarListaProfissionais();
atualizarResumo();
