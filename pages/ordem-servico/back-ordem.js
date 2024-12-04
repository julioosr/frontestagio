document.addEventListener("DOMContentLoaded", function () {
    // Carregar os dados ao iniciar a página
    loadClientes();
    loadVeiculos();
    loadServicos();
    loadFormasPagamento();
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
        })
        .catch(error => {
            console.error("Erro ao carregar os clientes:", error);
        });
}

// Função para carregar os veículos
function loadVeiculos() {
    fetch("http://localhost:8080/veiculo")
        .then(response => response.json())
        .then(veiculos => {
            const veiculoSelect = document.getElementById("veiculo");
            veiculoSelect.innerHTML = "<option value='' selected disabled>Escolha o veículo</option>"; // Limpa a lista antes de adicionar as opções

            // Ordenar os veículos por marca e modelo
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
                servicoSelect.appendChild(option);
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
