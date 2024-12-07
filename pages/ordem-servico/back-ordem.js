document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    // Função para remover a formatação do valor monetário
    const removeFormatting = (value) => {
        return parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.').trim()) || 0;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Captura os valores do formulário
        let idServico = document.getElementById('servico').value;
        let valorPago = removeFormatting(document.getElementById('valor-pago').value);
        let desconto = removeFormatting(document.getElementById('desconto').value);
        let valor_em_aberto = removeFormatting(document.getElementById('valor-em-aberto').value);
        let formaPgto = document.getElementById('forma-pagamento').value;

        // Calcula o total com base nas condições
        let total = valorPago > 0 ? valorPago + desconto : desconto + valor_em_aberto;

        // Dados da ordem de serviço (OS)
        const osData = {
            dataAgenda: null,
            horario: document.getElementById('horario').value,
            dataRealizada: document.getElementById('data').value,
            total: total,
            cliente: { id: parseInt(document.getElementById('cliente').value) },
            veiculo: { id: parseInt(document.getElementById('veiculo').value) },
            usuario: null,
            servico: { servicoID: idServico }
        };

        // Tente enviar a ordem de serviço e obter o ID gerado
        try {
            const osResponse = await fetch('http://localhost:8080/ordemservico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(osData)
            });

            if (!osResponse.ok) {
                const osErrorResponse = await osResponse.json();
                console.error(`Erro ao lançar ordem de serviço: ${osErrorResponse.message || 'Erro desconhecido.'}`);
                alert(`Erro ao lançar ordem de serviço: ${osErrorResponse.message || 'Verifique os dados.'}`);
                return;
            }

            const osResponseData = await osResponse.json();  
            const osId = osResponseData.id; 

            console.log('Ordem de serviço lançada com sucesso!');

            // Dados do recebimento com o ID da OS gerada
            const recebimentoData = {
                data: document.getElementById('data').value,
                valor: valorPago,
                desconto: desconto,
                os: { id: osId }, 
                formaPgto: { id: formaPgto },
                usuario: null, 
                valor_em_aberto: valor_em_aberto
            };

            // POST para Recebimento
            const recebimentoResponse = await fetch('http://localhost:8080/recebimento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recebimentoData)
            });

            if (recebimentoResponse.ok) {
                alert('Recebimento registrado com sucesso!');
                form.reset();
            } else {
                const recebimentoErrorResponse = await recebimentoResponse.json();
                alert(`Erro ao registrar recebimento: ${recebimentoErrorResponse.message || 'Verifique os dados.'}`);
            }

        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Ocorreu um erro ao se conectar com o servidor.');
        }
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
                option.value = servico.servicoID;
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
                option.value = formaPgto.id;
                option.textContent = formaPgto.descricao;
                formaPgtoSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar as formas de pagamento:", error);
        });
}

window.onload = () => {
    loadClientes();
    loadServicos();
    loadFormasPagamento();
};