document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/data/jogos.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo JSON');
        }
       
        const dados = await response.json();
        GerarEstatisticas(dados);
    } catch (error) {
        console.error('Erro:', error);
    }
});

function GerarEstatisticas(data) {
  
  const total = data.length;
  let vitorias = 0, derrotas = 0, empates = 0;
  let golsPro = 0, golsContra = 0;
  const modalidades = {};
  const anos = {};
  let maiorVitoria = { saldo: -Infinity, jogo: null };
  let maiorDerrota = { saldo: -Infinity, jogo: null };
  const adversarios = {};

  data.forEach(jogo => {
    if (jogo.Resultado === 'Vitória') vitorias++;
    else if (jogo.Resultado === 'Derrota') derrotas++;
    else empates++;

    golsPro += jogo.Gols;
    golsContra += jogo.Tomados;

    if (!modalidades[jogo.Modalidade]) {
      modalidades[jogo.Modalidade] = { jogos: 0, v: 0, d: 0, e: 0, gp: 0, gc: 0 };
    }
    const m = modalidades[jogo.Modalidade];
    m.jogos++;
    if (jogo.Resultado === 'Vitória') m.v++;
    else if (jogo.Resultado === 'Derrota') m.d++;
    else m.e++;
    m.gp += jogo.Gols;
    m.gc += jogo.Tomados;

    if (!anos[jogo.Ano]) anos[jogo.Ano] = { jogos: 0, v: 0, d: 0 };
    anos[jogo.Ano].jogos++;
    if (jogo.Resultado === 'Vitória') anos[jogo.Ano].v++;
    if (jogo.Resultado === 'Derrota') anos[jogo.Ano].d++;

    const saldo = jogo.Gols - jogo.Tomados;
    if (saldo > maiorVitoria.saldo) maiorVitoria = { saldo, jogo };
    if (-saldo > maiorDerrota.saldo) maiorDerrota = { saldo: -saldo, jogo };

    if (!adversarios[jogo.Adversario]) adversarios[jogo.Adversario] = 0;
    adversarios[jogo.Adversario]++;
  });

document.getElementById('resumo').innerHTML = `
  <h2>Resumo Geral</h2>
  <table>
    <tbody>
      <tr><td>Total de jogos</td><td><strong>${total}</strong></td></tr>
      <tr><td>Total de vitórias</td><td><strong>${vitorias}</strong></td></tr>
      <tr><td>Total de derrotas</td><td><strong>${derrotas}</strong></td></tr>
      <tr><td>Total de empates</td><td><strong>${empates}</strong></td></tr>
      <tr><td>Gols marcados (a favor)</td><td><strong>${golsPro}</strong></td></tr>
      <tr><td>Gols sofridos (contra)</td><td><strong>${golsContra}</strong></td></tr>
      <tr><td>Saldo de gols</td><td><strong>${golsPro - golsContra}</strong></td></tr>
      <tr><td>Média de gols marcados por jogo</td><td><strong>${(golsPro / total).toFixed(2)}</strong></td></tr>
      <tr><td>Média de gols sofridos por jogo</td><td><strong>${(golsContra / total).toFixed(2)}</strong></td></tr>
    </tbody>
  </table>
`;


  const corpo = Object.entries(modalidades).map(([nome, m]) => `
    <tr>
      <td>${nome}</td><td>${m.jogos}</td><td>${m.v}</td><td>${m.d}</td><td>${m.e}</td>
      <td>${m.gp}</td><td>${m.gc}</td><td>${m.gp - m.gc}</td>
    </tr>
  `).join('');
  document.getElementById('tabelaModalidade').innerHTML = `
    <thead><tr><th>Modalidade</th><th>Jogos</th><th>Vitórias</th><th>Derrotas</th><th>Empates</th><th>Gols Pró</th><th>Gols Contra</th><th>Saldo</th></tr></thead>
    <tbody>${corpo}</tbody>
  `;

  new Chart(document.getElementById('graficoModalidade'), {
    type: 'bar',
    data: {
        labels: Object.keys(modalidades),
        datasets: [
            {
                label: 'Vitórias',
                data: Object.values(modalidades).map(m => m.v),
                backgroundColor: 'green',
            },
            {
                label: 'Derrotas',
                data: Object.values(modalidades).map(m => m.d),
                backgroundColor: 'red',
            },
            {
                label: 'Empates',
                data: Object.values(modalidades).map(m => m.e),
                backgroundColor: 'gold',
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        aspectRatio: 2,  // Proporção mais alta (largura maior em relação à altura)
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    color: '#ddd',
                },
                ticks: {
                    beginAtZero: true,
                },
            },
        },
    }
});


  const melhores = Object.entries(anos)
    .filter(([_, a]) => a.v > 0)
    .sort((a, b) => (b[1].v / b[1].jogos) - (a[1].v / a[1].jogos))
    .slice(0, 3);
  const piores = Object.entries(anos)
    .filter(([_, a]) => a.d > 0)
    .sort((a, b) => b[1].d - a[1].d)
    .slice(0, 3);

  document.getElementById('tabelaMelhores').innerHTML = `
    <thead><tr><th>Ano</th><th>Jogos</th><th>Vitórias</th><th>Aproveitamento (%)</th></tr></thead>
    <tbody>
      ${melhores.map(([ano, a]) => `
        <tr><td>${ano}</td><td>${a.jogos}</td><td>${a.v}</td><td>${((a.v / a.jogos) * 100).toFixed(1)}%</td></tr>
      `).join('')}
    </tbody>
  `;

  document.getElementById('tabelaPiores').innerHTML = `
    <thead><tr><th>Ano</th><th>Jogos</th><th>Derrotas</th><th>Aproveitamento (%)</th></tr></thead>
    <tbody>
      ${piores.map(([ano, a]) => `
        <tr><td>${ano}</td><td>${a.jogos}</td><td>${a.d}</td><td>${((a.v / a.jogos) * 100).toFixed(1)}%</td></tr>
      `).join('')}
    </tbody>
  `;

  new Chart(document.getElementById('graficoMelhores'), {
    type: 'line',
    data: {
        labels: melhores.map(([ano]) => ano),
        datasets: [{
            label: 'Vitórias por Ano',
            data: melhores.map(([_, a]) => a.v),
            borderColor: 'green',
            backgroundColor: 'transparent',
            borderWidth: 4,
            tension: 0,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        aspectRatio: 2,  // Proporção mais alta (largura maior em relação à altura)
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    color: '#ddd',
                },
                ticks: {
                    beginAtZero: true,
                },
            },
        },
    }
});


//   new Chart(document.getElementById('graficoMelhores'), {
//     type: 'line',
//     data: {
//       labels: melhores.map(([ano]) => ano),
//       datasets: [{
//         label: 'Vitórias por Ano',
//         data: melhores.map(([_, a]) => a.v),
//         borderColor: 'blue',
//         backgroundColor: 'lightblue',
//         fill: true
//       }]
//     },
//     options: { responsive: true }
//   });

  document.getElementById('goleadas').innerHTML = `
    <h2>🥅 Maiores Goleadas</h2>
    <p><strong>Maior vitória:</strong> ${maiorVitoria.jogo.Gols} x ${maiorVitoria.jogo.Tomados} contra ${maiorVitoria.jogo.Adversario} (${maiorVitoria.jogo.Ano})</p>
    <p><strong>Maior derrota:</strong> ${maiorDerrota.jogo.Gols} x ${maiorDerrota.jogo.Tomados} contra ${maiorDerrota.jogo.Adversario} (${maiorDerrota.jogo.Ano})</p>
  `;

  const maisFrequente = Object.entries(adversarios).sort((a, b) => b[1] - a[1])[0];

  document.getElementById('destaques').innerHTML = `
    <h2>📌 Outros Destaques</h2>
    <ul>
      <li>Jogo com mais gols marcados: ${maiorVitoria.jogo.Gols} gols (contra ${maiorVitoria.jogo.Adversario} – ${maiorVitoria.jogo.Ano})</li>
      <li>Ano com mais jogos: ${Object.entries(anos).sort((a, b) => b[1].jogos - a[1].jogos)[0][0]}</li>
      <li>Adversário mais frequente: ${maisFrequente[0]} (${maisFrequente[1]} vezes)</li>
    </ul>
  `;
}
