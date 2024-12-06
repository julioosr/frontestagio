// Função para carregar as formas de pagamento via API
async function carregarFormasDePagamento() {
    const selectFormaPgto = document.getElementById("forma-pagamento");

    try {
        const response = await fetch("http://localhost:8080/pagamento"); // Substitua pelo endpoint real
        if (!response.ok) throw new Error("Erro ao carregar as formas de pagamento");

        const formas = await response.json();

        // Limpa as opções existentes no select
        selectFormaPgto.innerHTML = "<option value=''>Selecione</option>";

        // Adiciona as formas de pagamento no select
        formas.forEach((forma) => {
            const option = document.createElement("option");
            option.value = forma.id; // Supondo que cada forma tenha um 'id'
            option.textContent = forma.descricao; // A descrição da forma de pagamento
            selectFormaPgto.appendChild(option);
        });
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar as formas de pagamento.");
    }
}

// Função para carregar os dados da tabela RECEBIMENTO via API
async function carregarDadosTabela() {
    const tabelaBody = document.querySelector("tbody");
    tabelaBody.innerHTML = ""; // Limpa os dados inseridos manualmente

    try {
        const response = await fetch("http://localhost:8080/recebimento"); // Substitua pelo endpoint real
        if (!response.ok) throw new Error("Erro ao carregar os dados da tabela");

        const dados = await response.json();

        // Ordena os dados por data de forma decrescente
        dados.sort((a, b) => new Date(b.data) - new Date(a.data));

        dados.forEach((item) => {
            const linha = document.createElement("tr");

            // Converte a data para o formato "dd/mm/aaaa"
            const data = new Date(item.data);
            const dataFormatada = data.toISOString().split("T")[0].split("-").reverse().join("/");

            // Obtém o horário e concatena com a data
            const horario = item.os.horario || "N/A";
            const dataComHorario = `${dataFormatada} ${horario}`;

            // Exibe o valor com o R$ no HTML
            const valor = `R$ ${item.valor.toFixed(2)}`;
            const valorEmAberto = `R$ ${item.valor_em_aberto.toFixed(2)}`;

            linha.innerHTML = `
                <td>${dataComHorario}</td>
                <td>${item.os.servico.nome || "N/A"}</td>
                <td>${item.os.veiculo.marca.descricao || "N/A"} - ${item.os.veiculo.modelo || "N/A"} - ${item.os.veiculo.placa || "N/A"}</td>
                <td>${valor}</td>
                <td>${valorEmAberto}</td>
                <td>${item.formaPgto.descricao || "N/A"}</td>
                <td>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
                        class="bi bi-pencil-fill editar-pagamento" data-id="${item.recebimentoID}" viewBox="0 0 16 16">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                    </svg>
                </td>
            `;
            tabelaBody.appendChild(linha);
        });

        adicionarEventoEditar();
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar os dados.");
    }
}


function adicionarEventoEditar() {
    const iconesEditar = document.querySelectorAll(".editar-pagamento");
    iconesEditar.forEach((icone) => {
        icone.addEventListener("click", (event) => {
            const svgIcone = event.currentTarget.closest(".editar-pagamento");
            const recebimentoID = svgIcone.getAttribute("data-id");
            abrirModal(recebimentoID);
        });
    });
}

function abrirModal(recebimentoID) {
    const modal = document.getElementById("modal");
    const modalContent = document.getElementById("modal-content");

    if (!modal || !modalContent) {
        console.error("Modal não encontrado no DOM.");
        return;
    }

    // Adiciona conteúdo ao modal
    modalContent.innerHTML = `Editando dados para ID: ${recebimentoID}`;
    modal.style.display = "block";

    // Carregar as formas de pagamento ao abrir o modal
    carregarFormasDePagamento();

    // Verifica e atribui eventos aos botões apenas se eles existem
    const salvarButton = document.getElementById("confirmar");
    const cancelarButton = document.getElementById("cancelar");

    if (salvarButton) {
        salvarButton.onclick = () => salvarAlteracoes(recebimentoID);
    } else {
        console.error("Botão de salvar não encontrado no DOM.");
    }

    if (cancelarButton) {
        cancelarButton.onclick = () => (modal.style.display = "none");
    } else {
        console.error("Botão de cancelar não encontrado no DOM.");
    }
}

// Função para salvar as alterações
async function salvarAlteracoes(recebimentoID) {
    let valor = document.getElementById("valor-pago").value;
    let desconto = document.getElementById("desconto").value;
    let valor_em_aberto = document.getElementById("valor-em-aberto").value;
    const formaPgto = document.getElementById("forma-pagamento").value;

    // Remove o R$ e converte os valores para números
    valor = parseFloat(valor.replace("R$", "").trim());
    desconto = parseFloat(desconto.replace("R$", "").trim());
    valor_em_aberto = parseFloat(valor_em_aberto.replace("R$", "").trim());

    try {
        // Recupera os dados do recebimento que está sendo editado
        const response = await fetch(`http://localhost:8080/recebimento/${recebimentoID}`);
        if (!response.ok) throw new Error("Erro ao carregar os dados do recebimento");

        const recebimento = await response.json();

        // Atualiza somente os campos que o usuário está alterando
        const dadosAtualizados = {
            valor: valor,
            desconto: desconto,
            valor_em_aberto: valor_em_aberto,
            formaPgto: { id: formaPgto },
            data: recebimento.data,  // Mantém a data original
            os: recebimento.os,      // Mantém a OS original
            usuario: recebimento.usuario // Mantém o usuário original
        };

        const updateResponse = await fetch(`http://localhost:8080/recebimento/${recebimentoID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosAtualizados),
        });

        if (!updateResponse.ok) throw new Error("Erro ao salvar as alterações");

        alert("Alterações salvas com sucesso!");
        document.getElementById("modal").style.display = "none";
        carregarDadosTabela(); // Recarrega os dados da tabela
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível salvar as alterações.");
    }
}


// Inicia o carregamento dos dados ao carregar a página
document.addEventListener("DOMContentLoaded", carregarDadosTabela);
