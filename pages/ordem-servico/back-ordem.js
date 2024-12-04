document.addEventListener("DOMContentLoaded", function () {
    loadClientes();
    loadServicos();
    loadFormasPagamento();
});

document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    // Coleta os dados do formulário
    const clienteId = document.getElementById("cliente").value;
    const veiculoId = document.getElementById("veiculo").value;
    const servicoId = document.getElementById("servico").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;
    const valorPago = parseFloat(document.getElementById("valor-pago").value.replace('R$', '').replace(',', '.'));
    const desconto = parseFloat(document.getElementById("desconto").value.replace('R$', '').replace(',', '.'));
    const valorEmAberto = parseFloat(document.getElementById("valor-em-aberto").value.replace('R$', '').replace(',', '.'));
    const formaPagamentoId = document.getElementById("forma-pagamento").value;

    // Lógica para o campo 'total' na tabela 'os' (se valor pago for 0,00, é a soma do desconto e valor em aberto)
    const total = valorPago === 0 ? desconto + valorEmAberto : valorPago;

    // Enviar dados para a tabela 'os'
    const osData = {
        ordemid: null, // ID gerado pelo banco ou pelo backend
        horario: horario,
        datarealizada: data,
        total: total,
        cliente: clienteId,
        veiculo: veiculoId,
        usuario: null
    };

    fetch("http://localhost:8080/os", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(osData)
    })
    .then(response => response.json())
    .then(os => {
        // Enviar dados para a tabela 'ositem'
        const osItemData = {
            servico: servicoId,
            os: os.ordemid, // ID da OS gerada
            usuario: null,
            data: data,
            quantidade: 1,
            preco_unitario: document.querySelector(`#servico option[value="${servicoId}"]`).dataset.preco
        };

        return fetch("http://localhost:8080/ositem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(osItemData)
        });
    })
    .then(response => response.json())
    .then(osItem => {
        // Enviar dados para a tabela 'recebimento'
        const recebimentoData = {
            recebimentoid: null, // ID gerado pelo banco ou pelo backend
            data: data,
            valor: document.querySelector(`#servico option[value="${servicoId}"]`).dataset.preco,
            desconto: desconto,
            os: osItem.os,
            formapgto: formaPagamentoId,
            usuario: null,
            valor_em_aberto: valorEmAberto
        };

        return fetch("http://localhost:8080/recebimento", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(recebimentoData)
        });
    })
    .then(response => response.json())
    .then(recebimento => {
        alert("Serviço lançado com sucesso!");
    })
    .catch(error => {
        console.error("Erro ao lançar o serviço:", error);
        alert("Erro ao lançar o serviço. Tente novamente.");
    });
});

// Função para carregar os clientes
function loadClientes() {
    fetch("http://localhost:8080/cliente")
        .then(response => response.json())
        .then(clientes => {
            const clienteSelect = document.getElementById("cliente");
            clienteSelect.innerHTML = "<option value='' selected disabled>Escolha o cliente</option>"; // Limpa a lista antes de adicionar as opções

            // Ordenar os clientes por nome
            clientes.sort((a, b) => a.nome.localeCompare(b.nome));

            clientes.forEach(cliente => {
                const option = document.createElement("option");
                option.value = cliente.id;
                option.textContent = cliente.nome;
                clienteSelect.appendChild(option);
            });

            // Adiciona o listener para carregar veículos quando o cliente for selecionado
            clienteSelect.addEventListener("change", function () {
                const clienteId = this.value;
                loadVeiculos(clienteId);  // Chama a função para carregar veículos do cliente selecionado
            });
        })
        .catch(error => {
            console.error("Erro ao carregar os clientes:", error);
        });
}

// Função para carregar os veículos de um cliente
function loadVeiculos(clienteId) {
    // Se nenhum cliente for selecionado, não faz a requisição
    if (!clienteId) return;

    fetch(`http://localhost:8080/veiculo/cliente/${clienteId}`)
        .then(response => {
            if (response.status === 204) { // No content (sem veículos)
                return []; // Retorna um array vazio, indicando que não há veículos
            }
            return response.json(); // Se houver conteúdo, converte para JSON
        })
        .then(veiculos => {
            const veiculoSelect = document.getElementById("veiculo");
            veiculoSelect.innerHTML = "<option value='' selected disabled>Escolha o veículo</option>"; // Limpa a lista antes de adicionar as opções

            if (veiculos.length === 0) {
                // Se não houver veículos, cria um campo sem texto e não selecionável
                const option = document.createElement("option");
                option.value = ''; // Não tem valor
                option.disabled = true; // Não pode ser selecionado
                veiculoSelect.appendChild(option);
                return; // Saímos da função
            }

            // Ordenar os veículos
            veiculos.sort((a, b) => `${a.marca.descricao} - ${a.modelo} - ${a.placa}`.localeCompare(`${b.marca.descricao} - ${b.modelo} - ${b.placa}`));

            veiculos.forEach(veiculo => {
                const option = document.createElement("option");
                option.value = veiculo.id;
                option.textContent = `${veiculo.marca.descricao} - ${veiculo.modelo} - ${veiculo.placa}`;
                veiculoSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar os veículos:", error);
        });
}

// Função para carregar os serviços
function loadServicos() {
    fetch("http://localhost:8080/servico")
        .then(response => response.json())
        .then(servicos => {
            const servicoSelect = document.getElementById("servico");
            servicoSelect.innerHTML = "<option value='' selected disabled>Escolha o serviço</option>"; // Limpa a lista antes de adicionar as opções

            // Ordenar os serviços por descrição
            servicos.sort((a, b) => a.descricao.localeCompare(b.descricao));

            servicos.forEach(servico => {
                const option = document.createElement("option");
                option.value = servico.id;
                option.textContent = servico.descricao;
                option.dataset.preco = servico.preco; // Armazenar o preço do serviço no atributo data-preco
                servicoSelect.appendChild(option);
            });

            // Adiciona o evento de mudança no serviço
            servicoSelect.addEventListener("change", function () {
                const selectedOption = this.options[this.selectedIndex];
                const preco = selectedOption.dataset.preco; // Pega o preço armazenado no data-preco

                // Formatar o valor para o formato R$ 00,00
                const valorFormatado = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(preco);

                // Preenche o campo "Valor em Aberto" com o valor formatado
                document.getElementById("valor-em-aberto").value = valorFormatado;
            });
        })
        .catch(error => {
            console.error("Erro ao carregar os serviços:", error);
        });
}

// Função para carregar as formas de pagamento
function loadFormasPagamento() {
    fetch("http://localhost:8080/pagamento")
        .then(response => response.json())
        .then(formasPgto => {
            const formaPgtoSelect = document.getElementById("forma-pagamento");
            formaPgtoSelect.innerHTML = "<option value='' selected disabled>Escolha a forma de pagamento</option>"; // Limpa a lista antes de adicionar as opções

            // Ordenar as formas de pagamento por descrição
            formasPgto.sort((a, b) => a.descricao.localeCompare(b.descricao));

            formasPgto.forEach(formaPgto => {
                const option = document.createElement("option");
                option.value = formaPgto.pgtoid;
                option.textContent = formaPgto.descricao;
                formaPgtoSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar as formas de pagamento:", error);
        });
}
