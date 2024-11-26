document.addEventListener('DOMContentLoaded', () => {
    const servicoSelect = document.getElementById('servico');
    const nomeInput = document.getElementById('nome');
    const descricaoTextarea = document.getElementById('descricao');
    const valorInput = document.getElementById('valor');
    const idInput = document.getElementById('id');
    const modal = document.getElementById('modal');
    const confirmEditBtn = document.getElementById('confirmEdit');
    const confirmNoBtn = document.getElementById('confirmNo');

    // Função para carregar os serviços cadastrados
    async function loadServicos() {
        try {
            const response = await fetch('http://localhost:8080/servico');
            if (!response.ok) {
                throw new Error('Erro ao carregar os serviços.');
            }

            const servicos = await response.json();

            servicoSelect.innerHTML = '<option value="" selected disabled>Escolha um serviço</option>'; 
            servicos.forEach((servico) => {
                const option = document.createElement('option');
                option.value = servico.servicoID;  
                option.textContent = servico.nome;
                servicoSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
        }
    }

    // Função para preencher os campos do formulário ao selecionar um serviço
    async function loadServicoDetails(servicoId) {
        if (!servicoId) {
            console.error('Serviço não selecionado.');
            return;  
        }

        try {
            const response = await fetch(`http://localhost:8080/servico/${servicoId}`);
            if (!response.ok) {
                throw new Error('Erro ao carregar detalhes do serviço.');
            }

            const servico = await response.json();

            // Preencher os campos do formulário
            idInput.value = servico.servicoID || '';
            nomeInput.value = servico.nome || '';
            descricaoTextarea.value = servico.descricao || '';
            valorInput.value = servico.preco ? `R$ ${servico.preco.toFixed(2).replace('.', ',')}` : '';
        } catch (error) {
            console.error('Erro ao carregar detalhes do serviço:', error);
        }
    }

    // Evento para carregar os detalhes do serviço ao selecionar
    servicoSelect.addEventListener('change', (event) => {
        const selectedServicoId = event.target.value;
        if (selectedServicoId) {
            loadServicoDetails(selectedServicoId);
        } else {
            console.error('Nenhum serviço selecionado');
        }
    });

    // Função para abrir o modal de confirmação
    function openModal() {
        modal.style.display = 'block';
    }

    // Função para fechar o modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Função para validar o formulário e abrir o modal
    function validateForm() {
        openModal();
    }

    // Função para confirmar a edição do serviço
    async function updateServico() {
    const servicoId = idInput.value;
    const nome = nomeInput.value;
    const descricao = descricaoTextarea.value;
    const valor = valorInput.value.replace('R$', '').replace(',', '.');  // Remover R$ e ajustar vírgula para ponto

    if (!nome || !valor) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const updatedServico = {
        nome,
        descricao,
        preco: parseFloat(valor),
    };

    try {
        const response = await fetch(`http://localhost:8080/servico/${servicoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedServico),
        });

        if (response.ok) {
            alert('Serviço atualizado com sucesso!');
            // Esperar o alerta antes de fechar o modal
            setTimeout(() => {
                closeModal();
            }, 500); // Aguarda meio segundo antes de fechar o modal
        } else {
            console.error('Erro ao atualizar serviço:', response.statusText);
            alert('Erro ao atualizar serviço.');
        }
    } catch (error) {
        console.error('Erro ao atualizar serviço:', error);
        alert('Erro ao atualizar serviço.');
        }   
    }

    // Confirmar a edição ao clicar no botão "Confirmar"
    confirmEditBtn.addEventListener('click', updateServico);

    // Cancelar a edição ao clicar no botão "Cancelar"
    confirmNoBtn.addEventListener('click', closeModal);

    // Carregar os serviços ao inicializar
    loadServicos();
});
