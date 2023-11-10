import express from 'express'; // Importa o framework Express.
import getProduct from '../controllers/product/getProduct.js'; // Importa a função controladora para obter um produto.
import insertProduct from '../controllers/product/insertProduct.js'; // Importa a função controladora para inserir um produto.
import updateProduct from '../controllers/product/updateProduct.js'; // Importa a função controladora para atualizar um produto.
import deleteProduct from '../controllers/product/deleteProduct.js'; // Importa a função controladora para excluir um produto.

const router = express.Router(); // Cria uma instância de roteador Express e Associa as funções controladoras às rotas HTTP correspondentes.

// Rota GET para buscar uma lista de produtos ou um produto específico.
router.get('/', getProduct);

// Rota POST para criar um novo produto.
router.post('/', insertProduct);

// Rota PUT para atualizar um produto existente com base no ID.
router.put('/', updateProduct);

// Rota DELETE para excluir um produto existente com base no ID.
router.delete('/', deleteProduct);

export default router; // Exporta o roteador configurado para que ele possa ser usado em outros lugares do código.

// Este arquivo é responsável por definir as rotas relacionadas a produtos na API e encaminhar as solicitações HTTP correspondentes
// para as funções controladoras apropriadas. Ele segue uma estrutura semelhante ao 'userRouter.js' e ajuda a manter o código organizado
// e separar as preocupações de roteamento das operações de negócios.