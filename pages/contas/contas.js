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

        // Fecha o modal ao clicar no botão "Cancelar"
        document.getElementById("cancelar").addEventListener('click', function() {
            closeModal();
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

        const dataHora = row.querySelector("td:nth-child(1)").textContent.trim();
        const servico = row.querySelector("td:nth-child(2)").textContent.trim();

        if (valorEmAberto !== "R$ 00,00") {
            svgIcon.style.cursor = "pointer";
            svgIcon.addEventListener("click", () => openModal(dataHora, servico));
        }
    });
});

// puxar informações para o modal de editar pagamento
function openModal(dataHora, servico, veiculo) {
    const modal = document.getElementById("modal");
    const modalContent = document.getElementById("modal-content");

    // Atualiza o conteúdo do modal com a data, hora, serviço e veículo
    modalContent.innerHTML = `
    <p>Data e Horário: ${dataHora}</p>
    <p>Serviço: ${servico}</p>
    <p>Veículo: ${veiculo}</p>
    `;
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

        // Adiciona um listener de evento ao ícone para abrir o modal
        pencilIcon.addEventListener('click', () => {
            const dataHora = row.cells[0].textContent; // Pega a data e hora
            const servico = row.cells[1].textContent; // Pega o serviço
            const veiculo = row.cells[2].textContent; // Pega o veículo

            openModal(dataHora, servico, veiculo); // Chama openModal com todos os valores
        });

        if (valorEmAberto === 0) {
            pencilIcon.classList.add('blur');
        } else {
            pencilIcon.classList.remove('blur');
        }
    });
}

// Chame essa função após a tabela ser carregada
window.onload = updateIcons;

// formatação input
function formatCurrency(inputId) {
    const input = document.getElementById(inputId);
    input.addEventListener('input', function (e) {
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
}

// Aplica o formato de moeda nos campos
formatCurrency('valor-pago');
formatCurrency('desconto');
formatCurrency('valor-em-aberto');

// Função para adicionar pagamentos à lista
document.addEventListener('DOMContentLoaded', () => {
    const pagamentoSelect = document.getElementById('forma-pagamento');
    const pagamentosSelecionadosDiv = document.getElementById('pagamentos-selecionados');
    const adicionarPagamentoBtn = document.getElementById('adicionar-pagamento');

    // Adiciona o item "Nenhum pagamento selecionado" inicialmente
    const nenhumPagamento = document.createElement('li');
    nenhumPagamento.textContent = 'Nenhum pagamento selecionado';
    pagamentosSelecionadosDiv.appendChild(nenhumPagamento);

    adicionarPagamentoBtn.addEventListener('click', () => {
        const selectedOption = pagamentoSelect.options[pagamentoSelect.selectedIndex];

        // Verifica se algum pagamento foi selecionado
        if (selectedOption.value) {
            // Remove o item "Nenhum pagamento selecionado"
            if (pagamentosSelecionadosDiv.firstChild.textContent === 'Nenhum pagamento selecionado') {
                pagamentosSelecionadosDiv.innerHTML = ''; // Limpa a lista
            }

            // Cria um item de lista (li) para o pagamento selecionado
            const novoPagamento = document.createElement('li');
            novoPagamento.textContent = selectedOption.text;

            // Cria o ícone de remoção usando SVG
            const removerBtn = document.createElement('span');
            removerBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon" viewBox="0 0 16 16">
                <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
            `;
            // Centraliza o ícone verticalmente em relação ao texto
            removerBtn.style.display = 'inline-flex';
            removerBtn.style.alignItems = 'center';
            removerBtn.style.cursor = 'pointer';
            removerBtn.style.marginLeft = '10px';
            removerBtn.style.transform = 'translateY(2.5px)';

            // Adiciona o evento de remoção ao ícone
            removerBtn.addEventListener('click', () => {
                // Remove o item da lista
                novoPagamento.remove();

                // Reabilita a opção correspondente no select
                selectedOption.disabled = false;

                // Se a lista ficar vazia, adiciona novamente "Nenhum pagamento selecionado"
                if (pagamentosSelecionadosDiv.children.length === 0) {
                    pagamentosSelecionadosDiv.appendChild(nenhumPagamento);
                }

                // Habilita todas as opções novamente se nenhum pagamento for selecionado
                for (let i = 0; i < pagamentoSelect.options.length; i++) {
                    pagamentoSelect.options[i].disabled = false;
                }
            });

            // Adiciona o ícone de remoção ao item de pagamento
            novoPagamento.appendChild(removerBtn);

            // Adiciona o item na lista de pagamentos selecionados
            pagamentosSelecionadosDiv.appendChild(novoPagamento);

            // Desabilita a opção selecionada no select
            selectedOption.disabled = true;

            // Desabilita todas as outras opções, exceto a selecionada
            for (let i = 0; i < pagamentoSelect.options.length; i++) {
                if (pagamentoSelect.options[i] !== selectedOption) {
                    pagamentoSelect.options[i].disabled = true;
                }
            }

            // Reseta o select para o estado inicial
            pagamentoSelect.selectedIndex = 0;
        }
    });
});
