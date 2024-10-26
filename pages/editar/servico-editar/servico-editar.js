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
            window.location.href = '/pages/editar/home-editar/home-editar.html'; // Redireciona para a URL especificada
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
document.getElementById('valor').addEventListener('input', function (e) {
    let value = e.target.value;

    // Remove todos os caracteres que não são números
    value = value.replace(/\D/g, '');

    // Se não houver valor, exibe R$ 0,00
    if (value.length === 0) {
        e.target.value = 'R$ 0,00';
        return;
    }

    // Divide por 100 para obter o formato correto
    value = (parseFloat(value) / 100).toFixed(2);

    // Substitui ponto por vírgula para o formato BR
    value = value.replace('.', ',');

    // Adiciona "R$ " no início
    e.target.value = 'R$ ' + value;
});

// Função selecionável cliente/formulário
function toggleForm() {
    const servicoSelect = document.getElementById('servico');
    const formDetails = document.getElementById('formDetails');

    // Se o valor do cliente for vazio (ou seja, a opção padrão), esconda o formulário
    if (servicoSelect.value === "") {
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