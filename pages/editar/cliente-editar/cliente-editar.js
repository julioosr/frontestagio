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
document.addEventListener("DOMContentLoaded", function () {
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');
    const numeroInput = document.getElementById('numero');

    // Função para formatar CPF ou CNPJ (máximo de 14 dígitos)
    cpfInput.addEventListener('input', function () {
        let value = cpfInput.value.replace(/\D/g, '').slice(0, 14); // Limitar a 14 dígitos

        if (value.length <= 11) {
            // CPF: 000.000.000-00
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        } else {
            // CNPJ: 00.000.000/0000-00
            value = value.replace(/^(\d{2})(\d)/, "$1.$2");
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
            value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
            value = value.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
        }

        cpfInput.value = value;
    });

    // Função para formatar Telefone (máximo de 11 dígitos)
    telefoneInput.addEventListener('input', function () {
        let value = telefoneInput.value.replace(/\D/g, '').slice(0, 11); // Limitar a 11 dígitos
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        value = value.replace(/(\d{5})(\d{4})$/, "$1-$2");
        telefoneInput.value = value;
    });

    // Função para formatar CEP (máximo de 8 dígitos)
    cepInput.addEventListener('input', function () {
        let value = cepInput.value.replace(/\D/g, '').slice(0, 8); // Limitar a 8 dígitos
        value = value.replace(/(\d{5})(\d{3})$/, "$1-$2");
        cepInput.value = value;
    });

    // Função para aceitar apenas números no campo Número
    numeroInput.addEventListener('input', function () {
        numeroInput.value = numeroInput.value.replace(/\D/g, '');
    });
});

// Função selecionável cliente/formulário
function toggleForm() {
    const clienteSelect = document.getElementById('cliente');
    const formDetails = document.getElementById('formDetails');

    // Se o valor do cliente for vazio (ou seja, a opção padrão), esconda o formulário
    if (clienteSelect.value === "") {
        formDetails.style.display = 'none';
    } else {
        // Caso contrário, exiba o formulário
        formDetails.style.display = 'block';
    }
}

