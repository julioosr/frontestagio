// Função para carregar os veículos na lista
document.addEventListener("DOMContentLoaded", function () {
    loadVeiculos();
    loadMarcas();  // Carregar as marcas
    loadClientes();  // Carregar os clientes
});

// Função para carregar os veículos do banco de dados
function loadVeiculos() {
    fetch("http://localhost:8080/veiculo")
        .then(response => response.json())
        .then(veiculos => {
            const veiculoSelect = document.getElementById("veiculo");
            veiculoSelect.innerHTML = "<option value='' selected disabled>Escolha um veículo</option>"; // Limpa e adiciona opção inicial

            veiculos.sort((a, b) => {
                const aTexto = `${a.marca.descricao} ${a.modelo} ${a.placa}`.toLowerCase();
                const bTexto = `${b.marca.descricao} ${b.modelo} ${b.placa}`.toLowerCase();
                return aTexto.localeCompare(bTexto);
            });

            veiculos.forEach(veiculo => {
                const option = document.createElement("option");
                option.value = veiculo.id;
                option.textContent = `${veiculo.marca.descricao} - ${veiculo.modelo} - ${veiculo.placa}`;
                veiculoSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar os veículos:", error);
            alert("Não foi possível carregar os veículos.");
        });
}

// Função para carregar as marcas na lista
function loadMarcas() {
    fetch("http://localhost:8080/marca")  // Assumindo que você tem um endpoint para as marcas
        .then(response => response.json())
        .then(marcas => {
            const marcaSelect = document.getElementById("marca");
            marcaSelect.innerHTML = "<option value='' selected disabled>Escolha a marca</option>"; // Limpa e adiciona opção inicial

            // Ordenar as marcas em ordem alfabética
            marcas.sort((a, b) => a.descricao.localeCompare(b.descricao));

            marcas.forEach(marca => {
                const option = document.createElement("option");
                option.value = marca.id;
                option.textContent = marca.descricao;
                marcaSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar as marcas:", error);
        });
}


// Função para carregar os clientes na lista
function loadClientes() {
    fetch("http://localhost:8080/cliente")  // Assumindo que você tem um endpoint para os clientes
        .then(response => response.json())
        .then(clientes => {
            const clienteSelect = document.getElementById("cliente");
            clienteSelect.innerHTML = "<option value='' selected disabled>Escolha o cliente</option>"; // Limpa e adiciona opção inicial

            // Ordenar os clientes em ordem alfabética pelo nome
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


// Função para exibir os dados do veículo selecionado
async function showVeiculoInfo() {
    const veiculoId = document.getElementById("veiculo").value;

    try {
        const response = await fetch(`http://localhost:8080/veiculo/${veiculoId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do veículo');
        }

        const veiculo = await response.json();

        // Preencher os campos com os dados do veículo
        document.getElementById("id").value = veiculo.id;
        document.getElementById("modelo").value = veiculo.modelo;
        document.getElementById("ano-fabricacao").value = veiculo.anoDeFabricacao;
        document.getElementById("cor").value = veiculo.cor;
        document.getElementById("placa").value = veiculo.placa;
        document.getElementById("renavam").value = veiculo.renavam;

        // Preencher os selects com a marca e cliente relacionados
        document.getElementById("marca").value = veiculo.marca.id;
        document.getElementById("cliente").value = veiculo.cliente.id;

        // Preencher os hidden fields (caso necessário)
        document.getElementById("idMarca").value = veiculo.marca.id;
        document.getElementById("idCliente").value = veiculo.cliente.id;
    } catch (error) {
        console.error("Erro ao exibir os dados do veículo:", error);
    }
}

// Função para redirecionar ou atualizar os dados do veículo
async function redirectToHome() {
    const veiculoId = document.getElementById('id').value;
    const modelo = document.getElementById('modelo').value;
    const anoFabricacao = document.getElementById('ano-fabricacao').value;
    const cor = document.getElementById('cor').value;
    const placa = document.getElementById('placa').value;
    const renavam = document.getElementById('renavam').value;

    // Captura o valor da marca e cliente diretamente dos selects
    const marcaId = document.getElementById('marca').value;  // Usar 'marca' diretamente
    const clienteId = document.getElementById('cliente').value;  // Usar 'cliente' diretamente

    try {
        // Realiza a requisição PUT para atualizar os dados do veículo
        const veiculoResponse = await fetch(`http://localhost:8080/veiculo/${veiculoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                modelo: modelo,
                anoDeFabricacao: anoFabricacao,
                cor: cor,
                placa: placa,
                renavam: renavam,
                marca: { id: marcaId },  // Passando o id da marca selecionada
                cliente: { id: clienteId }  // Passando o id do cliente selecionado
            })
        });

        if (!veiculoResponse.ok) {
            throw new Error('Erro ao atualizar os dados do veículo');
        }

        // Atualização foi bem-sucedida
        alert('Dados do veículo atualizados com sucesso!');
        closeModal(); // Fecha o modal
        window.location.reload(); // Atualiza a página
    } catch (error) {
        console.error('Erro ao atualizar os dados do veículo:', error);
        alert('Ocorreu um erro ao atualizar os dados do veículo. Tente novamente.');
    }
}
