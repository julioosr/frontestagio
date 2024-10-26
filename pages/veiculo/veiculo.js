// Função para incluir o conteúdo do header e footer
function loadHTML(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;

            // Chame a função que inicializa os modais aqui
            initializeModals();

            // Inicializa a lógica do título "PróRegister"
            initializeTitleRedirect();
        })
        .catch(error => console.error('Erro ao carregar o arquivo:', error));
}

// Função para inicializar a lógica do título "PróRegister"
function initializeTitleRedirect() {
    const titleSpan = document.querySelector('.title-bar span');

    if (titleSpan) {
        titleSpan.addEventListener('click', function() {
            window.location.href = '/pages/home/home.html'; // Redireciona para a URL especificada
        });
    }
}

// Carregar o header e footer
loadHTML('header', '/partials/header/header.html');
loadHTML('footer', '/partials/footer/footer.html');

// Função para inicializar os modais
function initializeModals() {
    // Modal de configurações
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsModal = document.getElementById('settingsModal');
    const settingsConfirmYes = document.getElementById('settingsConfirmYes');
    const settingsConfirmNo = document.getElementById('settingsConfirmNo');

    // Ícone voltar
    const homeIcon = document.getElementById('back-icon');
    homeIcon.addEventListener('click', function() {
        window.location.href = '/pages/home/home.html'; // Redireciona para home.html
    });

    // Verifique se o ícone de configurações e o modal existem
    if (settingsIcon && settingsModal) {
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
    }
}

// formatação input
document.addEventListener("DOMContentLoaded", function () {
    const anoFabricacao = document.getElementById("ano-fabricacao");
    const renavam = document.getElementById("renavam");

    // Permitir apenas números e limitar a 4 dígitos no campo "Ano de Fabricação"
    anoFabricacao.addEventListener("input", function () {
        // Remove todos os caracteres não numéricos
        this.value = this.value.replace(/\D/g, '');
        // Limitar a 4 dígitos
        if (this.value.length > 4) {
            this.value = this.value.slice(0, 4);
        }
    });

    // Permitir apenas números e limitar a 11 dígitos no campo "Renavam"
    renavam.addEventListener("input", function () {
        // Remove todos os caracteres não numéricos
        this.value = this.value.replace(/\D/g, '');
        // Limitar a 11 dígitos
        if (this.value.length > 11) {
            this.value = this.value.slice(0, 11);
        }
    });
});