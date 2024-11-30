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

        // Ordenar clientes em ordem alfabética pelo nome
        clientes.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

        // Obtenha o elemento <select>
        const clienteSelect = document.getElementById('cliente');

        // Limpe qualquer opção existente, exceto o primeiro item "Selecione um cliente"
        clienteSelect.innerHTML = '<option value="" selected disabled>Selecione um cliente</option>';

        // Adicione uma opção para cada cliente
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = cliente.nome;
            clienteSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

// Função para exibir os dados do cliente selecionado
async function showClienteInfo() {
    const clienteId = document.getElementById('cliente').value;

    try {
        const response = await fetch(`http://localhost:8080/endereco/cliente/${clienteId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar dados do cliente');
        }

        const endereco = await response.json();

        document.getElementById('cep').value = endereco.cep;
        document.getElementById('idEndereco').value = endereco.id; 
        document.getElementById('rua').value = endereco.rua;
        document.getElementById('numero').value = endereco.numero;
        document.getElementById('bairro').value = endereco.bairro;
        document.getElementById('complemento').value = endereco.complemento;
        document.getElementById('id').value = endereco.cliente.id;
        document.getElementById('nome').value = endereco.cliente.nome;
        document.getElementById('email').value = endereco.cliente.email;
        document.getElementById('cpf1').value = endereco.cliente.cpfCnpj;
        document.getElementById('telefone').value = endereco.cliente.telefone;
        document.getElementById('uf').value = endereco.municipio.uf;
        carregarMunicipios(endereco.municipio.uf, endereco.municipio.id);

    } catch (error) {
        console.error(error);
    }
}

// Função para carregar os UFs únicos em ordem alfabética
function carregarUFs() {
    fetch("http://localhost:8080/municipio")
        .then(response => response.json())
        .then(data => {
            const ufSelect = document.getElementById("uf");
            const ufs = new Set();

            // Adicionar os UFs ao Set para garantir que sejam únicos
            data.forEach(municipio => {
                ufs.add(municipio.uf);
            });

            // Converter o Set em um array, ordenar alfabeticamente, e limpar o <select>
            const ufsOrdenados = Array.from(ufs).sort((a, b) => a.localeCompare(b, 'pt-BR'));
            ufSelect.innerHTML = '<option value="" selected disabled>Selecione um UF</option>';

            // Adicionar os UFs únicos e ordenados ao <select> de UF
            ufsOrdenados.forEach(uf => {
                const option = document.createElement("option");
                option.value = uf;
                option.textContent = uf;
                ufSelect.appendChild(option);
            });

            // Adicionar evento para carregar municípios ao mudar o UF
            ufSelect.addEventListener("change", () => {
                carregarMunicipios(ufSelect.value);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar os UFs:", error);
        });
}

// Função para carregar os municípios conforme o UF selecionado, em ordem alfabética
function carregarMunicipios(uf, municipioIdSelecionado = null) {
    const municipioSelect = document.getElementById("municipio");

    fetch("http://localhost:8080/municipio")
        .then(response => response.json())
        .then(municipios => {
            // Filtrar os municípios pela UF
            const municipiosFiltrados = municipios
                .filter(municipio => municipio.uf === uf)
                .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

            // Limpar as opções existentes e adicionar o placeholder
            municipioSelect.innerHTML = '<option value="" disabled>Selecione um Município</option>';

            // Adicionar os municípios filtrados e ordenados ao <select>
            municipiosFiltrados.forEach(municipio => {
                const option = document.createElement("option");
                option.value = municipio.id;
                option.textContent = municipio.nome;
                if (municipio.id === municipioIdSelecionado) {
                    option.selected = true; // Selecionar o município retornado, se especificado
                }
                municipioSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar os municípios:", error);
        });
}

// Chamar as funções ao carregar a página
window.onload = () => {
    loadClientes();
    carregarUFs();
    showClienteInfo(); // Exibir dados do cliente ao carregar a página
};

// Função para validar o formulário e abrir o modal
function validateForm() {
    // Lógica para validação se necessário
    document.getElementById('modal').style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Função para redirecionar ou atualizar os dados
async function redirectToHome() {
    const clienteId = document.getElementById('id').value;
    const nome = document.getElementById('nome').value;
    const cpfCnpj = document.getElementById('cpf1').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const enderecoId = document.getElementById('idEndereco').value;
    const municipioId = document.getElementById('municipio').value;
    const cep = document.getElementById('cep').value;
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const complemento = document.getElementById('complemento').value;

    try {
        // Realiza a requisição PUT para atualizar os dados do cliente
        const clienteResponse = await fetch(`http://localhost:8080/cliente/${clienteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                cpfCnpj: cpfCnpj,
                telefone: telefone,
                email: email
            })
        });

        if (!clienteResponse.ok) {
            throw new Error('Erro ao atualizar os dados do cliente');
        }

        // Atualização foi bem-sucedida
        alert('Dados atualizados com sucesso!');
        closeModal(); // Fecha o modal
        window.location.reload(); // Atualiza a página
    } catch (error) {
        console.error('Erro ao atualizar os dados:', error);
        alert('Ocorreu um erro ao atualizar os dados. Tente novamente.');
    }

    try {
        const enderecoResponse = await fetch(`http://localhost:8080/endereco/${enderecoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cliente: { id: clienteId },
                cep: cep,
                rua: rua,
                numero: numero,
                bairro: bairro,
                complemento: complemento,
                municipio: { id: municipioId }
            })
        });

        if (!enderecoResponse.ok) {
            throw new Error('Erro ao atualizar o endereço');
        }

        // Atualização foi bem-sucedida
        alert('Endereço atualizado com sucesso!');
        closeModal(); // Fecha o modal
        window.location.reload(); // Atualiza a página
    } catch (error) {
            console.error('Erro ao atualizar o endereço:', error);
            alert('Endereço atualizado com sucesso!');
        }
}