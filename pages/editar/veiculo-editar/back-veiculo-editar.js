// Função para carregar os veículos na lista
document.addEventListener("DOMContentLoaded", function () {
    loadVeiculos();
});

// Função para carregar os veículos do banco de dados
function loadVeiculos() {
    fetch("http://localhost:8080/veiculo")
        .then(response => response.json())
        .then(veiculos => {
            const veiculoSelect = document.getElementById("veiculo");
            veiculoSelect.innerHTML = "<option value='' selected disabled>Escolha um veículo</option>"; // Limpa e adiciona opção inicial

            // Ordena os veículos por marca, modelo e placa (ordem alfabética)
            veiculos.sort((a, b) => {
                const aTexto = `${a.marca.descricao} ${a.modelo} ${a.placa}`.toLowerCase();
                const bTexto = `${b.marca.descricao} ${b.modelo} ${b.placa}`.toLowerCase();
                return aTexto.localeCompare(bTexto);
            });

            // Preenche a lista de veículos com marca, modelo e placa
            veiculos.forEach(veiculo => {
                const option = document.createElement("option");
                option.value = veiculo.id; // ID do veículo
                option.textContent = `${veiculo.marca.descricao} - ${veiculo.modelo} - ${veiculo.placa}`; // Marca, Modelo e Placa
                veiculoSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar os veículos:", error);
            alert("Não foi possível carregar os veículos.");
        });
}
