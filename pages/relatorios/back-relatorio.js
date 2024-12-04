document.addEventListener('DOMContentLoaded', function() {
    // Função para buscar os clientes da API
    fetch('http://localhost:8080/cliente') // Substitua com a URL da sua API
        .then(response => response.json()) // Espera que a resposta seja no formato JSON
        .then(data => {
            // Ordena os clientes por nome (alfabeticamente)
            const clientesOrdenados = data.sort((a, b) => {
                // Assumindo que a propriedade de nome do cliente seja 'nome'
                return a.nome.localeCompare(b.nome);
            });

            // Seleciona o elemento select no HTML
            const selectCliente = document.getElementById('cliente');

            // Adiciona as opções ordenadas ao select
            clientesOrdenados.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id; // ou qualquer propriedade única do cliente
                option.textContent = cliente.nome; // Assumindo que 'nome' seja a propriedade
                selectCliente.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar clientes:', error);
        });
});
