// Função para incluir o conteúdo do header e footer
function loadHTML(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;

            // Chame a função que inicializa os modais aqui
            initializeModals();
        })
        .catch(error => console.error('Erro ao carregar o arquivo:', error));
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
    const backIcon = document.getElementById('back-icon');
    backIcon.addEventListener('click', function() {
        window.location.href = '/pages/editar/home-editar/home-editar.html'; // Redireciona para home.html
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

// Função selecionável cliente/formulário
function toggleForm() {
    const veiculoSelect = document.getElementById('veiculo');
    const formDetails = document.getElementById('formDetails');

    // Se o valor do cliente for vazio (ou seja, a opção padrão), esconda o formulário
    if (veiculoSelect.value === "") {
        formDetails.style.display = 'none';
    } else {
        // Caso contrário, exiba o formulário
        formDetails.style.display = 'block';
    }
}

// Função para mostrar o modal de confirmação
function showModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block'; // Mostra o modal
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none'; // Fecha o modal
}

// Evento para o botão de confirmação
document.getElementById('confirmEdit').addEventListener('click', function() {
    // Aqui você pode adicionar a lógica para salvar os dados
    closeModal();
});

// Evento para fechar o modal ao clicar fora dele
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Evento para fechar o modal ao pressionar a tecla "Esc"
window.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

// Confirmação do preenchimento do formulário
function validateForm() {
    const form = document.querySelector('form');

    if (form.checkValidity()) {
        showModal(); // Mostra o modal se todos os campos estiverem preenchidos
    } else {
        form.reportValidity(); // Mostra os erros de validação do HTML5
    }
}

function redirectToHome() {
    window.location.href = '/pages/editar/home-editar/home-editar.html';
}