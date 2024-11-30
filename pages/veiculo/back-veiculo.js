document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const marcaResponse = await fetch(`http://localhost:8080/marca/${document.getElementById('marca').value}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Ocorreu um erro ao se conectar com o servidor.');
        }

        let idMarca = document.getElementById('marca').value;

        // Dados do Veículo
        const veiculoData = {
            modelo: document.getElementById('modelo').value,
            anoDeFabricacao: document.getElementById('ano-fabricacao').value,
            cor: document.getElementById('cor').value,
            placa: document.getElementById('placa').value,
            renavam: document.getElementById('renavam').value,
            cliente: { id: document.getElementById('cliente').value },
            marca: {id: idMarca}
        };

        try {
            // Enviar dados do Veículo
            const veiculoResponse = await fetch('http://localhost:8080/veiculo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(veiculoData)
            });

            if (veiculoResponse.ok) {
                alert('Veículo cadastrado com sucesso!');
                form.reset();
            } else {
                alert('Erro ao cadastrar veículo. Verifique os dados e tente novamente.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Ocorreu um erro ao se conectar com o servidor.');
        }
    });
});

// Função para carregar os Clientes
function carregarClientes() {
    fetch("http://localhost:8080/cliente") // Substitua pelo endereço correto da sua API
        .then(response => response.json())
        .then(data => {
            const clienteSelect = document.getElementById("cliente");

            // Limpar as opções existentes e adicionar o placeholder
            clienteSelect.innerHTML = '<option value="" selected disabled>Selecione um Cliente</option>';

            // Ordenar os clientes alfabeticamente pelo nome
            const clientesOrdenados = data.sort((a, b) => a.nome.localeCompare(b.nome));

            // Adicionar os clientes ao select
            clientesOrdenados.forEach(cliente => {
                const option = document.createElement("option");
                option.value = cliente.id; // Ajuste para o ID do cliente
                option.textContent = cliente.nome;
                clienteSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar os clientes:", error);
        });
}

// Função para carregar as Marcas
function carregarMarcas() {
    fetch("http://localhost:8080/marca") // Substitua pelo endereço correto da sua API
        .then(response => response.json())
        .then(data => {
            const marcaSelect = document.getElementById("marca");

            // Limpar as opções existentes e adicionar o placeholder
            marcaSelect.innerHTML = '<option value="" selected disabled>Selecione uma Marca</option>';

            // Ordenar as marcas alfabeticamente pela descrição
            const marcasOrdenadas = data.sort((a, b) => a.descricao.localeCompare(b.descricao));

            // Adicionar as marcas ao select
            marcasOrdenadas.forEach(marca => {
                const option = document.createElement("option");
                option.value = marca.id; // Ajuste para o ID da marca
                option.textContent = marca.descricao;
                marcaSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar as marcas:", error);
        });
}

// Chamar as funções para carregar os Clientes e Marcas
window.onload = () => {
    carregarClientes();
    carregarMarcas();
};
