import user from "../../models/userModel.js"; // Importa o modelo de dados 'userModel.js' que lida com operações de usuário no banco de dados.

const updateUser = async (req, res) => {
    try {
        const userData = req.body; // Obtém os dados da solicitação HTTP (os novos dados do usuário).
        const [result] = await user.update(userData); // Chama a função 'update' do modelo de dados para atualizar as informações do usuário.

        if (result.affectedRows === 1) {
            // Se a atualização for bem-sucedida (afetou uma única linha no banco de dados), retorna uma resposta JSON com uma mensagem de sucesso e os novos dados do usuário.
            res.json({
                success: "Usuário atualizado com Sucesso!",
                user: {
                    ...userData // Os novos dados do usuário fornecidos na solicitação.
                }
            });
        } else {
            // Se nenhum usuário foi encontrado para atualização, responde com um status 404 (Not Found) e uma mensagem de erro.
            res.status(404).json({
                error: `Usuário id: ${userData.id} não Encontrado!`
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

export default updateUser; // Exporta a função 'updateUser' para que ela possa ser usada em outros lugares do código.

// Resumindo o funcionamento do arquivo 'updateUser.js':

// Importa o modelo de dados 'userModel.js' para interagir com o banco de dados.
// Define uma função assíncrona chamada updateUser que recebe os objetos req (representando a solicitação HTTP) e res (representando a resposta HTTP).
// Obtém os novos dados do usuário da solicitação HTTP, presumivelmente do corpo da solicitação (req.body).
// Chama a função update do modelo de dados para atualizar as informações do usuário no banco de dados.
// Verifica se a atualização foi bem-sucedida (se afetou uma única linha no banco de dados).
// Se a atualização for bem-sucedida, responde com um status 200 (OK), uma mensagem de sucesso e os novos dados do usuário em formato JSON.
// Se nenhum usuário for encontrado para atualização, responde com um status 404 (Not Found) e uma mensagem de erro.
// Em caso de erro durante o processamento, captura exceções, registra o erro no console e responde com um status 500 (Internal Server Error) com uma mensagem
// de erro genérica.

// Esse controlador é responsável por atualizar as informações de um usuário no banco de dados e retornar a resposta apropriada para o cliente, seja um sucesso,
// um erro ou uma resposta 404 caso o usuário não seja encontrado.







