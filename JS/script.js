import { fetchData } from './fetchData.js';
import { renderTreeChart } from './treeChart.js';

// Função para limpar o gráfico
function clearTreeChart() {
  const container = document.getElementById('container');
  container.innerHTML = ''; // Limpa o conteúdo dentro do container
}

// Função para filtrar os dados com base no código e setor
function filterData(data, codigo, setor) {
  return data.find(item => item.codigo === codigo && item.setor === setor.toLowerCase());
}

// Inicializa a aplicação 
fetchData('database.json')
  .then(data => {
    // Adiciona evento ao botão de pesquisa
    document.getElementById('searchBtn').addEventListener('click', () => {
      const codigo = document.getElementById('codigo').value;
      const setor = document.getElementById('setor').value;
      
      // Filtra os dados com base no código e setor
      const filteredData = filterData(data, codigo, setor);
      
      // Limpa o gráfico anterior
      clearTreeChart();

      if (filteredData) {
        renderTreeChart(filteredData.treeData); // Chama a função para renderizar o gráfico com os dados filtrados
      } else {
        alert('Item não encontrado. Por favor, verifique o código e o setor.'); // Mostra um alerta se o item não for encontrado
      }
    });
  })
  .catch(error => console.error("Error fetching the data: ", error));
