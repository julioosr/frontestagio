document.addEventListener('DOMContentLoaded', () => { 
    const form = document.querySelector('.form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            // Enviar dados do Cliente
            const municipioResponse = await fetch(`http://localhost:8080/municipio/${document.getElementById('municipio').value}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Ocorreu um erro ao se conectar com o servidor.');
        }

        // Dados do Cliente
        const clienteData = {
            nome: document.getElementById('nome').value,
            cpfCnpj: document.getElementById('cpf').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value
        };

        try {
            // Enviar dados do Cliente
            const clienteResponse = await fetch('http://localhost:8080/cliente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clienteData)
            });

            if (clienteResponse.ok) {
                const novoCliente = await clienteResponse.json();
                    // Dados do Endereço com o ID do Cliente e Município associados
                    let idMunicipio = document.getElementById('municipio').value;
                    const enderecoData = { 
                        cliente: novoCliente, 
                        cep: document.getElementById('cep').value,
                        rua: document.getElementById('rua').value,
                        numero: document.getElementById('numero').value,
                        bairro: document.getElementById('bairro').value,
                        complemento: document.getElementById('complemento').value,
                        municipio: {id: idMunicipio}
                    };

                    // Enviar dados do Endereço
                    const enderecoResponse = await fetch('http://localhost:8080/endereco', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(enderecoData)
                    });

                    if (enderecoResponse.ok) {
                        alert('Cliente cadastrado com sucesso!');
                        form.reset();
                    } else {
                        alert('Erro ao cadastrar endereço. Verifique os dados e tente novamente.');
                    }
            } else {
                alert('Erro ao cadastrar cliente. Verifique os dados e tente novamente.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Ocorreu um erro ao se conectar com o servidor.');
        }
    });
});

// Função para carregar os UFs únicos
function carregarUFs() {
    fetch("http://localhost:8080/municipio") // Substitua pelo endereço correto da sua API
        .then(response => response.json())
        .then(data => {
            const ufSelect = document.getElementById("uf");
            const ufs = new Set(); // Usar um Set para garantir UFs únicos

            // Adicionar os UFs ao Set
            data.forEach(municipio => {
                ufs.add(municipio.uf);
            });

            // Converter o Set em um array e ordenar alfabeticamente
            const ufsOrdenados = Array.from(ufs).sort();

            // Limpar as opções existentes e adicionar o placeholder
            ufSelect.innerHTML = '<option value="" selected disabled>Selecione um UF</option>';

            // Adicionar os UFs únicos e ordenados ao select de UF
            ufsOrdenados.forEach(uf => {
                const option = document.createElement("option");
                option.value = uf;
                option.textContent = uf;
                ufSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar os UFs:", error);
        });
}

// Função para carregar municípios com base no UF selecionado
function carregarMunicipios() {
    const ufSelect = document.getElementById("uf");
    const municipioSelect = document.getElementById("municipio");

    ufSelect.addEventListener("change", () => {
        const ufSelecionado = ufSelect.value;

        // Fazer uma requisição GET para a API
        fetch("http://localhost:8080/municipio") // Substitua pelo endereço correto da sua API
            .then(response => response.json())
            .then(data => {
                // Limpar as opções existentes e adicionar o placeholder
                municipioSelect.innerHTML = '<option value="" selected disabled>Selecione um Município</option>';

                // Filtrar e ordenar os municípios do UF selecionado
                const municipiosOrdenados = data
                    .filter(municipio => municipio.uf === ufSelecionado)
                    .sort((a, b) => a.nome.localeCompare(b.nome)); // Ordenar alfabeticamente

                // Adicionar os municípios ordenados ao select de município
                municipiosOrdenados.forEach(municipio => {
                    const option = document.createElement("option");
                    option.value = municipio.id; // Ajuste para o ID do município
                    option.textContent = municipio.nome;
                    municipioSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Erro ao carregar os municípios:", error);
            });
    });
}

// Chamar as funções para carregar os UFs e, posteriormente, os municípios
window.onload = () => {
    carregarUFs();
    carregarMunicipios();
};