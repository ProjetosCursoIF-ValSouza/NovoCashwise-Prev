import user from '../../models/userModel.js'; // Importa o modelo de dados 'userModel.js' que lida com operações de usuário no banco de dados.

const insertUser = async (req, res) => {
    try {
        const userData = req.body; // Obtém os dados da solicitação HTTP (os dados do novo usuário).
        const [result] = await user.create(userData); // Chama a função 'create' do modelo de dados para inserir um novo usuário.

        if (result.affectedRows === 1) {
            // Se a inserção for bem-sucedida (afetou uma única linha no banco de dados), retorna uma resposta JSON com uma mensagem de sucesso e os dados do usuário inserido.
            res.json({
                success: "Usuário inserido com Sucesso!",
                user: {
                    id: result.insertId, // O ID do usuário inserido.
                    ...userData // Os dados do usuário fornecidos na solicitação.
                }
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

export default insertUser; // Exporta a função 'insertUser' para que ela possa ser usada em outros lugares do código.


//Resumindo o funcionamento do arquivo 'insertUser.js':

//Importa o modelo de dados 'userModel.js' para interagir com o banco de dados.
//Define uma função assíncrona chamada insertUser que recebe os objetos req (representando a solicitação HTTP) e res (representando a resposta HTTP).
//Obtém os dados do novo usuário da solicitação HTTP, presumivelmente do corpo da solicitação (req.body).
//Chama a função create do modelo de dados para inserir o novo usuário no banco de dados.
//Verifica se a inserção foi bem-sucedida (se afetou uma única linha no banco de dados).
//Se a inserção for bem-sucedida, responde com um status 200 (OK), uma mensagem de sucesso e os dados do usuário inserido em formato JSON.
//Em caso de erro, captura exceções, registra o erro no console e responde com um status 500 (Internal Server Error) com uma mensagem de erro genérica.

//Esse controlador é responsável por inserir um novo usuário no banco de dados e retornar a resposta apropriada para o cliente, seja um sucesso, um erro
// ou uma resposta 500 em caso de falha no servidor.