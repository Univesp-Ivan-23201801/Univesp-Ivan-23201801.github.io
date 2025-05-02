let dadosOriginais = []; // Guarda todos os dados

document.addEventListener("DOMContentLoaded", async () => {
    try {
        
        const response = await fetch('/data/jogos.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo JSON');
        }
        const dados = await response.json();
        dadosOriginais = dados;
        
        criarBotoesAnos();
        
        // Pega o ano mais recente
        const anos = dadosOriginais.map(item => parseInt(item.Ano));
        const anoMaisRecente = Math.max(...anos);

        // Filtra os dados do ano mais recente
        const dadosFiltrados = dadosOriginais.filter(item => 
            item.Ano == anoMaisRecente
        );

        preencherTabela(dadosFiltrados);
    } catch (error) {
        console.error('Erro:', error);
    }
});

function criarBotoesAnos() {
    const container = document.getElementById('botoes-anos');
    
    // Pegar todos os anos únicos do JSON
    const anosUnicos = [...new Set(dadosOriginais.map(item => item.Ano))].
    sort((a, b) => b - a);

    anosUnicos.forEach(ano => {
        const botao = document.createElement('button');
        botao.textContent = ano;
        botao.addEventListener('click', () => {
            const filtrados = dadosOriginais.filter(item => item.Ano == ano);
            preencherTabela(filtrados);
        });
        container.appendChild(botao);
    });

    // Botão "Todos"
    const botaoTodos = document.createElement('button');
    botaoTodos.textContent = 'Todos';
    botaoTodos.addEventListener('click', () => preencherTabela(dadosOriginais));
    container.appendChild(botaoTodos);
}

// Função para formatar a data para "dd/MM/yyyy"
function formatarData(dataISO) {
    const [mes, dia, ano] = dataISO.split('/');
    return `${dia}/${mes}/${ano}`;
}

function preencherTabela(dados) {
    
    const tabela = document.getElementById('tabela').querySelector('tbody');
    tabela.innerHTML = "";
    
    dados.forEach(item => {

        const linha = document.createElement('tr');
        let icone = "";

        if (item.Resultado == 'Vitória'){
            linha.classList.add('table-success')
            icone = "🏆"; // Troféu
        }
        if (item.Resultado == 'Derrota'){
            linha.classList.add('table-danger')
            icone = "❌"; // X vermelho
        }
        if (item.Resultado == 'Empate'){
            linha.classList.add('table-warning')
            icone = "⚪"; // Bolinha branca
        }

        const nomeComIcone = `<span>${icone}</span>`;

        linha.innerHTML = `
            <td>${formatarData(item.Data)}</td>
            <td>${item.Horario}</td>
            <td>${item.Competicao}</td>
            <td>${item.Modalidade}</td>
            <td>${item.Local}</td>
            <td>${item.Adversario}</td>
            <td>${item.Gols}</td>
            <td>${item.Tomados}</td>
            <td>${item.Resultado}</td>
            <td>${nomeComIcone}</td>
        `;

        tabela.appendChild(linha);
    });
}

// function getData(){
//     let data = fetch("/data/jogos.json")
//     .then((response) => {
//     //     response.json().then((jogos) => {
//     //        console.log(jogos)
//     //     })
//     // })
//     return data
// }

// function newLine(jogos){
//     console.log(data)
//     linha = document.createElement("tr");
//     tdData = document.createElement("td");
//     tdHora = document.createElement("td");
//     tdData.innerHTML = data.Data;
//     tdHora.innerHTML = data.Horario;

//     linha.appendChild(tdData);
//     linha.appendChild(tdHora);

//     return linha;
// }

// function main(){
//     let jogos = getData();
//     let tabela = document.getElementById("tabela");
//     jogos.array.forEach(element => {
//         let linha = newLine(element);
//         tabela.appendChild(linha);
//     });
// }

// main()
