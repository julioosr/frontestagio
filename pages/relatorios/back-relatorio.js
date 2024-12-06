document.addEventListener("DOMContentLoaded", () => {
    const clienteSelect = document.getElementById("cliente");
    const gerarRelatorioBtn = document.getElementById("gerar-relatorio");
    const tableBody = document.querySelector("table tbody");


// Função para formatar a data no formato brasileiro DD-MM-AAAA
const formatarData = (data) => {
    const date = new Date(data);
    
    // Ajusta para UTC para evitar problemas de fuso horário
    const dia = String(date.getUTCDate()).padStart(2, '0');
    const mes = String(date.getUTCMonth() + 1).padStart(2, '0'); // Meses começam em 0
    const ano = date.getUTCFullYear();
    
    return `${dia}-${mes}-${ano}`;
};

const carregarDadosDoCliente = async (clienteId) => {
    try {
        const response = await fetch(`http://localhost:8080/ordemservico?cliente=${clienteId}`);
        const ordensServico = await response.json();

        // Limpar tabela antes de adicionar novos dados
        tableBody.innerHTML = "";

        if (ordensServico.length === 0) {
            const row = document.createElement("tr");
            const noDataCell = document.createElement("td");
            noDataCell.textContent = "Nenhuma ordem de serviço encontrada para o cliente selecionado.";
            noDataCell.colSpan = 7;
            row.appendChild(noDataCell);
            tableBody.appendChild(row);
            return;
        }

        ordensServico.forEach(os => {
            const row = document.createElement("tr");

            const dataHorarioCell = document.createElement("td");
            // Formatar a data para DD-MM-AAAA
            const dataFormatada = os.dataRealizada ? formatarData(os.dataRealizada) : "Não informado";
            dataHorarioCell.textContent = os.horario ? `${dataFormatada} ${os.horario}` : dataFormatada;
            row.appendChild(dataHorarioCell);

            const clienteCell = document.createElement("td");
            clienteCell.textContent = os.cliente.nome || "Não informado";
            row.appendChild(clienteCell);

            const veiculoCell = document.createElement("td");
            // Concatenando modelo e placa
            veiculoCell.textContent = `${os.veiculo.modelo || "Não informado"} - ${os.veiculo.placa || "Não informado"}`;
            row.appendChild(veiculoCell);

            const servicoCell = document.createElement("td");
            servicoCell.textContent = os.servico.nome || "Não informado";
            row.appendChild(servicoCell);

            const valorPagoCell = document.createElement("td");
            valorPagoCell.textContent = os.total !== undefined ? `R$ ${os.total}` : "Não informado";
            row.appendChild(valorPagoCell);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao carregar dados do cliente:", error);
    }
};


    // Listener para o botão "Gerar"
    gerarRelatorioBtn.addEventListener("click", () => {
        // O clienteId pode ser atribuído diretamente aqui ou por outro método
        const clienteId = "idDoCliente"; // Substitua "idDoCliente" pelo ID real do cliente
        if (clienteId) {
            carregarDadosDoCliente(clienteId);
        } else {
            alert("Por favor, selecione um cliente.");
        }
    });

});
