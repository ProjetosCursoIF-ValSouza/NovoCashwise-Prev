import user from '../../models/userModel.js'; // Importa o modelo de dados 'userModel.js' que lida com operações de usuário no banco de dados.

const listUsers = async (req, res) => {
    try {
        const [rows] = await user.getAll(); // Chama a função 'getAll' do modelo de dados para buscar todos os usuários.

        if (rows.length === 0) {
            // Se nenhum usuário for encontrado, responde com um status 404 (Not Found) e uma mensagem de erro.
            res.status(404).json({
                error: `Nenhum usuário encontrado!`
            });
        } else {
            // Se pelo menos um usuário for encontrado, responde com um status 200 (OK), uma mensagem de sucesso e a lista de usuários em formato JSON.
            res.json({
                success: "Usuário(s) Encontrado(s) com Sucesso!",
                users: rows
            });
        }
    } catch (error) {
        // Se ocorrer um erro durante o processamento, registra o erro no console e retorna uma resposta de status 500 (Internal Server Error).
        console.log(error);
        res.status(500).json({
            error: "Erro no servidor!",
        });
    }
}

export default listUsers; // Exporta a função 'listUsers' para que ela possa ser usada em outros lugares do código.


// Resumindo o funcionamento do arquivo 'listUsers.js':

// Importa o modelo de dados 'userModel.js' para interagir com o banco de dados.
// Define uma função assíncrona chamada listUsers que recebe os objetos req (representando a solicitação HTTP) e res (representando a resposta HTTP).
// Chama a função getAll do modelo de dados para buscar todos os usuários no banco de dados.
// Verifica se a busca retornou pelo menos um usuário.
// Se nenhum usuário for encontrado, responde com um status 404 (Not Found) e uma mensagem de erro.
// Se pelo menos um usuário for encontrado, responde com um status 200 (OK), uma mensagem de sucesso e a lista de usuários em formato JSON.
// Em caso de erro durante o processamento, captura exceções, registra o erro no console e responde com um status 500 (Internal Server Error) com uma mensagem de
// erro genérica.

// Esse controlador é responsável por listar todos os usuários no banco de dados e retornar a resposta apropriada para o cliente, seja a lista de usuários, um erro 
// ou uma resposta 404 caso nenhum usuário seja encontrado.






