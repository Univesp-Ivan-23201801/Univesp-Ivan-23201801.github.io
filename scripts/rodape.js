// menu.js
fetch("rodape.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("rodape").innerHTML = data;
  });
