document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contato-form");
    const mensagem = document.getElementById("mensagem-sucesso");
  
    if (!form) return;
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const data = new FormData(form);
  
      fetch("https://formspree.io/f/YOUR_ID_AQUI", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            // Mostra mensagem
            mensagem.classList.remove("d-none");
  
            // Limpa o formulário
            form.reset();
  
            // Aguarda 3 segundos e redireciona
            setTimeout(() => {
              window.location.href = "/obrigado.html";
            }, 3000);
          } else {
            alert("Erro ao enviar. Tente novamente mais tarde.");
          }
        })
        .catch(error => {
          alert("Erro ao conectar. Verifique sua conexão.");
          console.error(error);
        });
    });
  });
  