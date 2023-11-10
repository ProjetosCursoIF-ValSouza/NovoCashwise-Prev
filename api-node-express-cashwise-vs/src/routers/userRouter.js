import express from 'express' // Importa o framework Express.
import getUser from '../controllers/user/getUser.js' // Importa a função controladora para obter um usuário.
import listUsers from '../controllers/user/listUsers.js' // Importa a função controladora para listar todos os usuários.
import insertUser from '../controllers/user/insertUser.js' // Importa a função controladora para inserir um usuário.
import updateUser from '../controllers/user/updateUser.js' // Importa a função controladora para atualizar um usuário.
import deleteUser from '../controllers/user/deleteUser.js' // Importa a função controladora para excluir um usuário.

const router = express.Router() // Cria uma instância de roteador Express. Essa instância é usada para definir rotas
// e gerenciar o sistema de roteamento do aplicativo de forma mais organizada e
// associa as funções controladoras às rotas HTTP correspondentes.

// Rota GET para obter um usuário pelo ID.
router.get('/', getUser)

// Rota GET para listar todos os usuários.
router.get('/list', listUsers)

// Rota POST para inserir um novo usuário.
router.post('/', insertUser)

// Rota PUT para atualizar um usuário existente.
router.put('/', updateUser)

// Rota DELETE para excluir um usuário pelo ID.
router.delete('/', deleteUser)

export default router // Exporta o roteador configurado para que ele possa ser usado em outros lugares do código.


// Este arquivo é responsável por definir as rotas relacionadas a usuários na API e encaminhar as solicitações HTTP
// correspondentes para as funções controladoras apropriadas. Ele ajuda a manter o código organizado e separa as 
//preocupações de roteamento das operações de negócios.
