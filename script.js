// script.js
let producoes = JSON.parse(localStorage.getItem('producoes') || '[]');
let profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
let editandoIndex = -1;

function salvarDados() {
  localStorage.setItem('producoes', JSON.stringify(producoes));
  localStorage.setItem('profissionais', JSON.stringify(profissionais));
}

function atualizarProfissionais() {
  const select = document.getElementById('profissional');
  const filtro = document.getElementById('filtroProfissional');
  select.innerHTML = '';
  filtro.innerHTML = '<option value="">Todos</option>';
  profissionais.forEach(nome => {
    const option = document.createElement('option');
    option.textContent = nome;
    select.appendChild(option);

    const filtroOption = document.createElement('option');
    filtroOption.textContent = nome;
    filtro.appendChild(filtroOption);
  });
}

function novoProfissional() {
  const nome = prompt("Digite o nome do novo profissional:");
  if (nome && !profissionais.includes(nome)) {
    profissionais.push(nome);
    salvarDados();
    atualizarProfissionais();
  }
}

function registrarProducao() {
  const data = document.getElementById('data').value;
  const profissional = document.getElementById('profissional').value;
  const quantidade = parseInt(document.getElementById('quantidade').value);
  const valor = parseFloat(document.getElementById('valor').value);
  if (!data || !profissional || isNaN(quantidade) || isNaN(valor)) return alert("Preencha todos os campos corretamente!");

  const producao = { data, profissional, quantidade, valor };
  if (editandoIndex >= 0) {
    producoes[editandoIndex] = producao;
    editandoIndex = -1;
  } else {
    producoes.push(producao);
  }
  salvarDados();
  limparCampos();
  atualizarResumo();
}

function limparCampos() {
  document.getElementById('data').value = '';
  document.getElementById('profissional').value = '';
  document.getElementById('quantidade').value = '';
  document.getElementById('valor').value = '';
}

function atualizarResumo() {
  const filtroData = document.getElementById('filtroData').value;
  const filtroProfissional = document.getElementById('filtroProfissional').value.toLowerCase();
  const container = document.getElementById('resumo');
  container.innerHTML = '';

  const filtradas = producoes.filter(p => {
    const dataOk = !filtroData || p.data === filtroData;
    const nomeOk = !filtroProfissional || p.profissional.toLowerCase().includes(filtroProfissional);
    return dataOk && nomeOk;
  });

  filtradas.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'dia';
    div.innerHTML = `<strong>Data:</strong> ${formatarData(p.data)}<br>
                     <strong>Profissional:</strong> ${p.profissional}<br>
                     <strong>Sacos:</strong> ${p.quantidade}<br>
                     <strong>Valor por saco:</strong> R$ ${p.valor.toFixed(2)}<br>
                     <strong>Total:</strong> R$ ${(p.quantidade * p.valor).toFixed(2)}<br>
                     <button onclick="editar(${i})">Editar</button>`;
    container.appendChild(div);
  });
}

function editar(index) {
  const p = producoes[index];
  document.getElementById('data').value = p.data;
  document.getElementById('profissional').value = p.profissional;
  document.getElementById('quantidade').value = p.quantidade;
  document.getElementById('valor').value = p.valor;
  editandoIndex = index;
}

function exportarParaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const header = document.getElementById("pdfHeader");
  const dataHora = new Date();
  document.getElementById("pdfDataHora").textContent = dataHora.toLocaleString();
  header.style.display = 'block';

  doc.html(document.body, {
    callback: function (doc) {
      doc.save("resumo_producao.pdf");
      header.style.display = 'none';
    },
    x: 10,
    y: 10
  });
}

function imprimirRelatorio() {
  window.print();
}

function formatarData(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

atualizarProfissionais();
atualizarResumo();
