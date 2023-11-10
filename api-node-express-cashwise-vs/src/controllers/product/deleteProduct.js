import product from "../../models/productModel.js"; // Importa o modelo de dados 'productModel.js' que lida com operações de produto no banco de dados.

const deleteProduct = async (req, res) => {
    try {
        const productData = req.body; // Obtém os dados da solicitação HTTP (presumivelmente, o ID do produto a ser excluído).

        const [result] = await product.remove(productData.id); // Chama a função 'remove' do modelo de dados para excluir o produto com base no ID fornecido.

        if (result.affectedRows === 1) {
            // Se a exclusão for bem-sucedida (afetou uma única linha no banco de dados), responde com um status 200 (OK) e uma mensagem de sucesso.
            res.json({
                success: "Produto Apagado com Sucesso!",
            });
        } else {
            // Se nenhum produto foi encontrado para exclusão, responde com um status 404 (Not Found) e uma mensagem de erro.
            res.status(404).json({
                error: `Produto id: ${productData.id} não Encontrado!`,
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

export default deleteProduct; // Exporta a função 'deleteProduct' para que ela possa ser usada em outros lugares do código.


// Resumindo o funcionamento do arquivo 'deleteProduct.js':

// Importa o modelo de dados 'productModel.js' para interagir com o banco de dados.
// Define uma função assíncrona chamada deleteProduct que recebe os objetos req (representando a solicitação HTTP) e res (representando a resposta HTTP).
// Obtém os dados da solicitação HTTP, presumivelmente o ID do produto a ser excluído.
// Chama a função remove do modelo de dados para excluir o produto com base no ID fornecido.
// Verifica se a exclusão foi bem-sucedida (se afetou uma única linha no banco de dados).
// Se a exclusão for bem-sucedida, responde com um status 200 (OK) e uma mensagem de sucesso.
// Se nenhum produto for encontrado para exclusão, responde com um status 404 (Not Found) e uma mensagem de erro.
// Em caso de erro durante o processamento, captura exceções, registra o erro no console e responde com um status 500 (Internal Server Error) com uma 
// mensagem de erro genérica.
// Esse controlador é responsável por excluir um produto com base em seu ID no banco de dados e retornar a resposta apropriada para o cliente, seja um sucesso,
// um erro ou uma resposta 404 caso o produto não seja encontrado.