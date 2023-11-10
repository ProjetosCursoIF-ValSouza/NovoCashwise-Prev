import express from 'express';
// import simulacaoRegras from './controllers/simule/simulacaoRegras.js';

const router = express.Router();

// Rota de simulação com simulacaoRegras
// router.use('/simule', simulacaoRegras);

// Middleware de tratamento de erros
router.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message) {
    return res.status(500).json({ error: err.message });
  }
  res.status(500).json({ error: 'Erro interno do servidor' });
});

export default router;
