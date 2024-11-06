document.addEventListener('DOMContentLoaded', () => { 
    const form = document.querySelector('.form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

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
                debugger
                    // Dados do Endereço com o ID do Cliente e Município associados
                    const enderecoData = { 
                        cliente: novoCliente, 
                        cep: document.getElementById('cep').value,
                        rua: document.getElementById('rua').value,
                        numero: document.getElementById('numero').value,
                        bairro: document.getElementById('bairro').value,
                        complemento: document.getElementById('complemento').value
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
