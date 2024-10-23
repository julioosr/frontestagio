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

    // Função para habilitar/selecionar o veículo após selecionar um cliente
    function enableVehicleSelect() {
        const clienteSelect = document.getElementById('cliente');
        const veiculoSelect = document.getElementById('veiculo');
        const servicoSelect = document.getElementById('servico');

        // Inicialmente desabilita os campos veículo e serviço
        veiculoSelect.disabled = true;
        servicoSelect.disabled = true;

        // Adiciona evento de mudança no select de cliente
        clienteSelect.addEventListener('change', function() {
            // Habilita o select de veículos quando um cliente é selecionado
            veiculoSelect.disabled = false;

            // Habilita o select de serviços
            servicoSelect.disabled = false;
        });
    }

    // Inicializa a função de habilitar veículos
    enableVehicleSelect();
}

// Função para adicionar serviços à lista
document.addEventListener('DOMContentLoaded', () => {
    const servicoSelect = document.getElementById('servico');
    const servicosSelecionadosDiv = document.getElementById('servicos-selecionados');
    const adicionarServicoBtn = document.getElementById('adicionar-servico');

    // Adiciona o item "Nenhum serviço selecionado" inicialmente
    const nenhumServico = document.createElement('li');
    nenhumServico.textContent = 'Nenhum serviço selecionado';
    servicosSelecionadosDiv.appendChild(nenhumServico);

    adicionarServicoBtn.addEventListener('click', () => {
        const selectedOption = servicoSelect.options[servicoSelect.selectedIndex];

        // Verifica se algum serviço foi selecionado
        if (selectedOption.value) {
            // Remove o item "Nenhum serviço selecionado"
            if (servicosSelecionadosDiv.firstChild.textContent === 'Nenhum serviço selecionado') {
                servicosSelecionadosDiv.innerHTML = ''; // Limpa a lista
            }

            // Cria um item de lista (li) para o serviço selecionado
            const novoServico = document.createElement('li');
            novoServico.textContent = selectedOption.text;

            // Adiciona o item na lista de serviços selecionados
            servicosSelecionadosDiv.appendChild(novoServico);

            // Desabilita a opção selecionada no select
            selectedOption.disabled = true;

            // Reseta o select para o estado inicial
            servicoSelect.selectedIndex = 0;
        }
    });
});

// Função para habilitar digitar valores
document.addEventListener("DOMContentLoaded", () => {
    const valorPagoInput = document.getElementById("valor-pago");
    const descontoInput = document.getElementById("desconto");
    const valorEmAbertoInput = document.getElementById("valor-em-aberto");
    const servicoSelect = document.getElementById("servico");

    // Função para formatar o valor em moeda
    function formatarMoeda(input) {
        input.addEventListener("input", function (e) {
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

    // Aplicar a formatação aos campos
    formatarMoeda(valorPagoInput);
    formatarMoeda(descontoInput);
    formatarMoeda(valorEmAbertoInput);

    // Função para habilitar os campos
    function habilitarCampos() {
        const isServicoSelecionado = servicoSelect.value !== "";
        valorPagoInput.disabled = !isServicoSelecionado; // Habilita ou desabilita o campo Valor Pago
        descontoInput.disabled = !isServicoSelecionado; // Habilita ou desabilita o campo Desconto
        valorEmAbertoInput.disabled = !isServicoSelecionado; // Habilita ou desabilita o campo Valor em Aberto

        // Se os campos forem desabilitados, limpar o valor
        if (!isServicoSelecionado) {
            valorPagoInput.value = '';
            descontoInput.value = '';
            valorEmAbertoInput.value = '';
        }
    }

    // Adiciona o evento de mudança no select de serviços
    servicoSelect.addEventListener("change", habilitarCampos);

    // Inicializa todos os campos como desabilitados
    valorPagoInput.disabled = true;
    descontoInput.disabled = true;
    valorEmAbertoInput.disabled = true;
});
