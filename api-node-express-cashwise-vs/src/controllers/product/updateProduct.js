import product from "../../models/productModel.js"; // Importa o modelo de dados 'productModel.js' que lida com operações de produto no banco de dados.

const updateProduct = async (req, res) => {
    try {
        const productData = req.body; // Obtém os dados da solicitação HTTP (os novos dados do produto a ser atualizado).

        const [result] = await product.update(productData); // Chama a função 'update' do modelo de dados para atualizar o produto com base nos novos dados fornecidos.

        if (result.affectedRows === 1) {
            // Se a atualização for bem-sucedida (afetou uma única linha no banco de dados), responde com um status 200 (OK), uma mensagem de sucesso e os dados do produto atualizado em formato JSON.
            res.json({
                success: "Produto atualizado com Sucesso!",
                product: {
                    ...productData // Os novos dados do produto.
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

export default updateProduct; // Exporta a função 'updateProduct' para que ela possa ser usada em outros lugares do código.


// Resumindo o funcionamento do arquivo 'updateProduct.js':

// Importa o modelo de dados 'productModel.js' para interagir com o banco de dados.
// Define uma função assíncrona chamada updateProduct que recebe os objetos req (representando a solicitação HTTP) e res (representando a resposta HTTP).
// Obtém os novos dados do produto da solicitação HTTP, presumivelmente do corpo da solicitação (req.body).
// Chama a função update do modelo de dados para atualizar o produto com base nos novos dados fornecidos.
// Verifica se a atualização foi bem-sucedida (se afetou uma única linha no banco de dados).
// Se a atualização for bem-sucedida, responde com um status 200 (OK), uma mensagem de sucesso e os dados do produto atualizado em formato JSON.
// Em caso de erro durante o processamento, captura exceções, registra o erro no console e responde com um status 500 (Internal Server Error) com uma
//  mensagem de erro genérica.

// Esse controlador é responsável por atualizar os dados de um produto no banco de dados e retornar a resposta apropriada para o cliente, seja um 
// sucesso ou uma resposta 500 em caso de falha no servidor.