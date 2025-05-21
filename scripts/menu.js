fetch('/menu.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('menu').innerHTML = data;
    // Reinstanciar os elementos colapsáveis do Bootstrap após o carregamento
    const collapseElementList = [].slice.call(document.querySelectorAll('.collapse'));
    collapseElementList.map(function (collapseEl) {
      return new bootstrap.Collapse(collapseEl, { toggle: false });
    });
  })
  .catch(error => {
    console.error('Erro ao carregar o menu:', error);
    // Caso haja erro no carregamento, exiba um menu básico ou apenas o link
    document.getElementById('menu').innerHTML = '<p>Falha ao carregar o menu. Tente novamente.</p>';
  });
