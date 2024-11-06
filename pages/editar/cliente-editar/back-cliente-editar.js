// Função para buscar e preencher a lista de clientes
async function loadClientes() {
    try {
        const response = await fetch('http://localhost:8080/cliente', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao buscar clientes');
        }

        const clientes = await response.json();

        // Obtenha o elemento <select>
        const clienteSelect = document.getElementById('cliente');

        // Limpe qualquer opção existente, exceto o primeiro item "Selecione um cliente"
        clienteSelect.innerHTML = '<option value="" selected disabled>Selecione um cliente</option>';

        // Adicione uma opção para cada cliente
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id; // Substitua 'id' pelo campo que identifica o cliente
            option.textContent = cliente.nome; // Substitua 'nome' pelo campo do nome do cliente
            clienteSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

// Função para exibir os dados do cliente selecionado
async function showClienteInfo() {
    const clienteId = document.getElementById('cliente').value;

    if (clienteId) {
        try {
            const response = await fetch(`http://localhost:8080/cliente/${clienteId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar dados do cliente');
            }

            const cliente = await response.json();

            // Preencha os campos do formulário com os dados do cliente
            document.getElementById('id').value = cliente.id;
            document.getElementById('nome').value = cliente.nome;
            document.getElementById('email').value = cliente.email;
            document.getElementById('cpf1').value = cliente.cpfCnpj;
            document.getElementById('telefone').value = cliente.telefone;

             // Substitua conforme necessário
        } catch (error) {
            console.error(error);
        }
    }

    try {
        const response2 = await fetch(`http://localhost:8080/endereco/cliente/${clienteId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response2.ok) {
            throw new Error('Erro ao buscar dados do cliente');
        }

        const endereco = await response2.json();

        document.getElementById('cep').value = endereco.cep;
        document.getElementById('rua').value = endereco.rua;
        document.getElementById('numero').value = endereco.numero;
        document.getElementById('bairro').value = endereco.bairro;
        document.getElementById('complemento').value = endereco.complemento;

    } catch (error) {
        console.error(error);
    }
}

// Carregar a lista de clientes ao carregar a página
window.onload = loadClientes;