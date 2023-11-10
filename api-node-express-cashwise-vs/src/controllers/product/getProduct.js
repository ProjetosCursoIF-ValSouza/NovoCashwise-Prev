import product from '../../models/productModel.js'; // Importa o modelo de dados 'productModel.js' que lida com operações de produto no banco de dados.

const getProduct = async (req, res) => {
    try {
        const productId = req.params.productId; // Obtém o ID do produto a partir dos parâmetros da URL (usando um URL dinâmico).
        const productData = await product.getById(productId); // Chama a função 'getById' do modelo de dados para obter as informações do produto com base no ID fornecido.

        if (!productData) {
            // Se o produto não for encontrado, responde com um status 404 (Not Found) e uma mensagem de erro.
            res.status(404).json({
                error: `Produto com ID ${productId} não encontrado!`,
            });
        } else {
            // Se o produto for encontrado, responde com um status 200 (OK), uma mensagem de sucesso e os dados do produto em formato JSON.
            res.json({
                success: "Produto encontrado com sucesso",
                product: productData,
            });
        }
    } catch (error) {
        // Se ocorrer um erro durante o processamento, registra o erro no console e retorna uma resposta de status 500 (Internal Server Error).
        console.log(error);
        res.status(500).json({
            error: "Erro no servidor!",
        });
    }
};

export default getProduct; // Exporta a função 'getProduct' para que ela possa ser usada em outros lugares do código.

// Resumindo o funcionamento do arquivo 'getProduct.js':

// Importa o modelo de dados 'productModel.js' para interagir com o banco de dados.
// Define uma função assíncrona chamada getProduct que recebe os objetos req (representando a solicitação HTTP) e res (representando a resposta HTTP).
// Obtém o ID do produto a partir dos parâmetros da URL (usando um URL dinâmico, como '/product/:productId').
// Chama a função getById do modelo de dados para obter as informações do produto com base no ID fornecido.
// Verifica se o produto foi encontrado.
// Se o produto não for encontrado, responde com um status 404 (Not Found) e uma mensagem de erro.
// Se o produto for encontrado, responde com um status 200 (OK), uma mensagem de sucesso e os dados do produto em formato JSON.
// Em caso de erro durante o processamento, captura exceções, registra o erro no console e responde com um status 500 (Internal Server Error)
// com uma mensagem de erro genérica.

// Esse controlador é responsável por obter as informações de um produto com base em seu ID e retornar a resposta apropriada para o cliente, seja as
// informações do produto, um erro ou uma resposta 404 caso o produto não seja encontrado.





