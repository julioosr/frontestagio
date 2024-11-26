document.addEventListener('DOMContentLoaded', () => {
    // Evento para capturar o envio do formulário
    const form = document.querySelector('.form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Previne o comportamento padrão do formulário

            const nome = document.getElementById('nome').value.trim();
            const descricao = document.getElementById('descricao').value.trim();
            let preco = document.getElementById('valor').value.trim();

            // Remove "R$ " e substitui vírgula por ponto
            preco = preco.replace('R$ ', '').replace(',', '.');

            if (!nome || !descricao || !preco || isNaN(preco) || parseFloat(preco) <= 0) {
                alert('Por favor, preencha todos os campos corretamente.');
                return;
            }

            try {
                const requestBody = {
                    nome,
                    descricao,
                    preco: parseFloat(preco) // Garante que é um número válido
                };

                const response = await fetch('http://localhost:8080/servico', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    console.error('Erro na resposta da API:', errorResponse);
                    alert(`Erro ao salvar o serviço: ${errorResponse.message || 'Erro desconhecido'}`);
                    return;
                }

                alert('Serviço cadastrado com sucesso!');
                form.reset();
            } catch (error) {
                console.error('Erro ao cadastrar o serviço:', error);
                alert('Ocorreu um erro ao cadastrar o serviço. Verifique a conexão com o servidor.');
            }
        });
    } else {
        console.error('Formulário não encontrado!');
    }

    // Formatação do campo "preço" no formato BR
    document.getElementById('valor').addEventListener('input', function (e) {
        let value = e.target.value;

        // Remove todos os caracteres que não são números
        value = value.replace(/\D/g, '');

        // Se não houver valor, exibe R$ 0,00
        if (value.length === 0) {
            e.target.value = 'R$ 0,00';
            return;
        }

        // Divide por 100 para obter o formato correto
        value = (parseFloat(value) / 100).toFixed(2);

        // Substitui ponto por vírgula para o formato BR
        value = value.replace('.', ',');

        // Adiciona "R$ " no início
        e.target.value = 'R$ ' + value;
    });
});
