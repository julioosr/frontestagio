// Modal de configurações
document.addEventListener('DOMContentLoaded', function() {
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsModal = document.getElementById('settingsModal');
    const settingsConfirmYes = document.getElementById('settingsConfirmYes');
    const settingsConfirmNo = document.getElementById('settingsConfirmNo');

    // Abre o modal ao clicar no ícone de configurações
    settingsIcon.addEventListener('click', function() {
        settingsModal.style.display = 'block';
    });

    // Fecha o modal ao clicar em "Fechar"
    settingsConfirmNo.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });

    // Ação de confirmação para o modal de configurações
    settingsConfirmYes.addEventListener('click', function() {
        // Redireciona para o WhatsApp
        window.location.href = 'https://wa.me/5555999379782'; // Redireciona para o WhatsApp
        settingsModal.style.display = 'none'; // Fecha o modal após redirecionar
    });

    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

      // Fecha o modal ao pressionar a tecla Esc
      window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') { // Verifica se a tecla pressionada é Esc
            settingsModal.style.display = 'none';
        }
    });

    
    // Direcionamento do nome do sistema
    // Seleciona o elemento <span> que contém o texto "PróRegister"
    const titleSpan = document.querySelector('.title-bar span');

    // Adiciona um evento de clique ao <span>
    titleSpan.addEventListener('click', function() {
        // Redireciona para a URL especificada
        window.location.href = '/pages/home/home.html';
    });
});