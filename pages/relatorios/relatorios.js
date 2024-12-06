// Função para incluir o conteúdo do header e footer
function loadHTML(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;

            // Inicializa a lógica do título "PróRegister"
            console.log('Inicializando redirecionamento do título');
            initializeTitleRedirect();

            // Chame a função que inicializa os modais aqui
            initializeModals();
        })
        .catch(error => console.error('Erro ao carregar o arquivo:', error));
}

// Função para inicializar a lógica do título "PróRegister"
function initializeTitleRedirect() {
    const titleSpan = document.querySelector('.title-bar span');
    console.log(titleSpan); // Log para verificar se o elemento está sendo encontrado

    if (titleSpan) {
        titleSpan.addEventListener('click', function() {
            window.location.href = '/pages/home/home.html'; // Redireciona para a URL especificada
        });
    } else {
        console.error('Elemento titleSpan não encontrado'); // Log de erro se o elemento não for encontrado
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
    }
}

// Função para verificar se pelo menos uma data está preenchida
document.addEventListener("DOMContentLoaded", function () {
    /* function isAnyDateFilled() {
        const dataInicial = document.getElementById("data-inicial").value;
        const dataFinal = document.getElementById("data-final").value;
        return dataInicial || dataFinal; // Verifica se pelo menos uma das datas está preenchida
    } */

    // Função para alternar a visibilidade do formulário e dos detalhes
    function toggleFormVisibility(event) {
        event.preventDefault(); // Previne o envio do formulário

        const formDetails = document.getElementById("formDetails");
        const formUm = document.getElementById("form-um");
        /* const horarioInicial = document.getElementById("horario-inicial").value;
        const horarioFinal = document.getElementById("horario-final").value;

        // Verifica se os campos de horário estão preenchidos
        if ((horarioInicial || horarioFinal) && !isAnyDateFilled()) {
            return; // Interrompe a execução da função
        } */

        // Se todas as validações passarem, esconde o form-um e mostra o formDetails
        formUm.style.display = 'none'; // Esconde o formulário
        formDetails.style.display = 'block'; // Mostra a tabela
    }

    // Adiciona o evento ao botão
    document.getElementById("gerar-relatorio").addEventListener("click", toggleFormVisibility);
});

// Tabela excel
function exportToExcel() {
    // Seleciona a tabela
    const table = document.querySelector("#formDetails table");

    // Cria um novo workbook
    const workbook = XLSX.utils.book_new();
    const sheetData = [];

    // Extrai os dados das linhas da tabela, formatando a primeira coluna como "dd/mm/aaaa hh:mm"
    table.querySelectorAll("tbody tr").forEach(row => {
        const rowData = [];
        row.querySelectorAll("td").forEach((cell, index) => {
            if (index === 0) { // Formata a primeira coluna (Data e Horário)
                const dateParts = cell.innerText.split(" ");
                const formattedDateTime = `${dateParts[0]} ${dateParts[1]}`;
                rowData.push(formattedDateTime);
            } else {
                rowData.push(cell.innerText);
            }
        });
        sheetData.push(rowData);
    });

    // Adiciona os dados formatados à planilha
    const ws = XLSX.utils.aoa_to_sheet([["Data e Horário", "Cliente", "Veículo", "Serviço", "Valor Pago"], ...sheetData]);

    // Configura a largura das colunas para 137 pixels
    ws["!cols"] = [
        { wpx: 137 }, // Data e Horário
        { wpx: 137 }, // Cliente
        { wpx: 137 }, // Veículo
        { wpx: 137 }, // Serviço
        { wpx: 137 }, // Valor Pago
    ];

    // Gera a data atual no formato "dd-mm-aaaa"
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

    // Define o nome do arquivo como "relatório-dd-mm-aaaa.xlsx"
    const fileName = `relatório-${formattedDate}.xlsx`;

    // Adiciona a planilha ao workbook e salva como Excel
    XLSX.utils.book_append_sheet(workbook, ws, "Relatório");
    XLSX.writeFile(workbook, fileName);
}
