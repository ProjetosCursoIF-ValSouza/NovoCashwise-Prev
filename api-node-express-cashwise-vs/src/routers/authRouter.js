import express from 'express'; // Importa o framework Express.
import login from '../controllers/auth/login.js'; // Importa a função controladora para lidar com o login.
import logout from '../controllers/auth/logout.js'; // Importa a função controladora para lidar com o logout.

const router = express.Router(); // Cria uma instância de roteador Express.

// Associa as funções controladoras às rotas HTTP correspondentes.

// Rota POST para lidar com a autenticação/login.
router.post('/login', login);

// Rota POST para lidar com o logout.
router.post('/logout', logout);

export default router; // Exporta o roteador configurado para que ele possa ser usado em outros lugares do código.


// O arquivo 'authRouter.js' é um arquivo de roteamento (router) que lida com as funcionalidades de autenticação na API.
// Ele importa funções controladoras relacionadas ao login e logout de usuários e as associa a rotas específicas HTTP (POST). 
// Ele ajuda a manter o código organizado e separar as preocupações de roteamento das operações de autenticação.