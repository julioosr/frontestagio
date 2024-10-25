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
        window.location.href = '/pages/home/home.html';
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

        // Fecha o modal ao clicar fora dele
        window.addEventListener('click', function(event) {
        const modal = document.getElementById("modal");
            if (event.target === modal) {
                closeModal();
            }
        });

        // Fecha o modal ao pressionar a tecla Esc
        window.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    }
}

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

// Modal valor em aberto
document.addEventListener("DOMContentLoaded", () => {
    const rows = document.querySelectorAll("tbody tr");
  
    rows.forEach((row) => {
      const valorEmAberto = row.querySelector("td:nth-child(5)").textContent.trim();
      const svgIcon = row.querySelector("svg");
  
      if (valorEmAberto !== "R$ 00,00") {
        svgIcon.style.cursor = "pointer";
        svgIcon.addEventListener("click", () => openModal(valorEmAberto));
      }
    });
});
  
function openModal(valorEmAberto) {
    const modal = document.getElementById("modal");
    const modalContent = document.getElementById("modal-content");
  
    modalContent.textContent = `Valor em aberto: ${valorEmAberto}`;
    modal.style.display = "block";
}
  
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function updateIcons() {
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const valorEmAberto = parseFloat(row.cells[4].textContent.replace('R$ ', '').replace(',', '.'));
        const pencilIcon = row.querySelector('svg');

        if (valorEmAberto === 0) {
            pencilIcon.classList.add('blur');
        } else {
            pencilIcon.classList.remove('blur');
        }
    });
}

// Chame essa função após a tabela ser carregada
window.onload = updateIcons;