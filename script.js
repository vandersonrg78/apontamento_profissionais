let profissionais = ['Carlos', 'João', 'Maria'];  // Exemplo de profissionais cadastrados
let producao = [];

function atualizarProfissionais() {
  const select = document.getElementById('profissional');
  const filtro = document.getElementById('filtroProfissional');
  select.innerHTML = '';  // Limpa as opções anteriores
  filtro.innerHTML = '<option value="">Todos</option>';  // Adiciona opção padrão "Todos"
  
  // Preenche os profissionais no select de cadastro e no filtro
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
  if (nome) {
    profissionais.push(nome);
    atualizarProfissionais();
  }
}

function registrarProducao() {
  const data = document.getElementById('data').value;
  const profissional = document.getElementById('profissional').value;
  const quantidade = document.getElementById('quantidade').value;
  const valor = document.getElementById('valor').value;

  if (data && profissional && quantidade && valor) {
    producao.push({ data, profissional, quantidade: parseInt(quantidade), valor: parseFloat(valor) });
    atualizarResumo();
  } else {
    alert("Preencha todos os campos.");
  }
}

function atualizarResumo() {
  const filtroData = document.getElementById('filtroData').value;
  const filtroProfissional = document.getElementById('filtroProfissional').value;
  let resumo = '';

  // Filtra as produções por data e profissional
  const producoesFiltradas = producao.filter(p => {
    const dataValida = !filtroData || p.data === filtroData;
    const profissionalValido = !filtroProfissional || p.profissional === filtroProfissional;
    return dataValida && profissionalValido;
  });

  producoesFiltradas.forEach(p => {
    resumo += `
      <div>
        <strong>Data:</strong> ${p.data} <strong>Profissional:</strong> ${p.profissional} <strong>Qtd. Sacos:</strong> ${p.quantidade} <strong>Valor por Saco:</strong> R$ ${p.valor.toFixed(2)}
      </div>
    `;
  });

  document.getElementById('resumo').innerHTML = resumo;
}

function exportarParaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Adicionando cabeçalho do PDF
  const agora = new Date();
  document.getElementById('pdfDataHora').textContent = `Data: ${agora.toLocaleDateString()} - Hora: ${agora.toLocaleTimeString()}`;
  document.getElementById('pdfHeader').style.display = 'block';

  doc.text("Empresa Carlos Colheita Café 2025", 20, 10);
  doc.text(`Data: ${agora.toLocaleDateString()} - Hora: ${agora.toLocaleTimeString()}`, 20, 20);

  let y = 30;
  producao.forEach(p => {
    doc.text(`Data: ${p.data} | Profissional: ${p.profissional} | Qtd. Sacos: ${p.quantidade} | Valor por Saco: R$ ${p.valor.toFixed(2)}`, 20, y);
    y += 10;
  });

  doc.save('relatorio_producao.pdf');
}

function imprimirRelatorio() {
  window.print();
}

// Inicializa os profissionais e produção
atualizarProfissionais();
