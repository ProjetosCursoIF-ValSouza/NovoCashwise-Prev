import product from '../../models/productModel.js'; // Importa o modelo de dados 'productModel.js' que lida com operações de produto no banco de dados.

const insertProduct = async (req, res) => {
    try {
        const productData = req.body; // Obtém os dados da solicitação HTTP (presumivelmente, os dados do novo produto).

        // Verifica se o campo "name" está preenchido
        if (!productData.name) {
            return res.status(400).json({ error: 'O campo "name" é obrigatório.' });
        }

        const [result] = await product.create(productData); // Chama a função 'create' do modelo de dados para inserir o novo produto.

        if (result.affectedRows === 1) {
            // Se a inserção for bem-sucedida (afetou uma única linha no banco de dados), responde com um status 200 (OK), uma mensagem de sucesso e os dados do produto inserido em formato JSON.
            res.json({
                success: "Produto inserido com Sucesso!",
                user: {
                    id: result.insertId, // O ID do produto inserido.
                    ...productData // Os dados do produto fornecidos na solicitação.
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

export default insertProduct; // Exporta a função 'insertProduct' para que ela possa ser usada em outros lugares do código.


// Resumindo o funcionamento do arquivo 'insertProduct.js':

// Importa o modelo de dados 'productModel.js' para interagir com o banco de dados.
// Define uma função assíncrona chamada insertProduct que recebe os objetos req (representando a solicitação HTTP) e res (representando a resposta HTTP).
// Obtém os dados do novo produto da solicitação HTTP, presumivelmente do corpo da solicitação (req.body).
// Verifica se o campo "name" está preenchido. Se não estiver preenchido, responde com um status 400 (Bad Request) e uma mensagem de erro.
// Chama a função create do modelo de dados para inserir o novo produto no banco de dados.
// Verifica se a inserção foi bem-sucedida (se afetou uma única linha no banco de dados).
// Se a inserção for bem-sucedida, responde com um status 200 (OK), uma mensagem de sucesso e os dados do produto inserido em formato JSON.
// Em caso de erro durante o processamento, captura exceções, registra o erro no console e responde com um status 500 (Internal Server Error) com uma
// mensagem de erro genérica.

// Esse controlador é responsável por inserir um novo produto no banco de dados e retornar a resposta apropriada para o cliente, seja um sucesso,
// um erro de validação ou uma resposta 500 em caso de falha no servidor.