import user from '../../models/userModel.js'; // Importa o modelo de dados 'userModel.js' que lida com operações de usuário no banco de dados.

const getUser = async (req, res) => {
    try {
        const userData = req.body; // Obtém os dados da solicitação HTTP (presumivelmente, o ID do usuário).
        const [rows] = await user.getById(userData.id); // Chama a função 'getById' do modelo de dados para obter informações do usuário com base no ID.

        if (rows.length === 0) {
            // Se nenhum usuário foi encontrado, retorna uma resposta de status 404 (Not Found) com uma mensagem de erro.
            res.status(404).json({
                error: `Usuário id: ${userData.id} não Encontrado!`
            });
        } else {
            // Se um usuário foi encontrado, retorna uma resposta JSON com uma mensagem de sucesso e os dados do usuário.
            res.json({
                success: "Usuário Encontrado com Sucesso",
                user: rows[0]
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

export default getUser; // Exporta a função 'getUser' para que ela possa ser usada em outros lugares do código.


// O arquivo 'getUser.js' é um controlador responsável por lidar com a solicitação de obtenção de informações de um usuário
// com base em seu ID. Ele utiliza o modelo de dados 'userModel.js' para interagir com o banco de dados e retornar as informações
// do usuário. 