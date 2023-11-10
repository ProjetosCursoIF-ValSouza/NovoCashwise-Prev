import express from 'express';
import SimulacaoBeneficio from '../models/SimulacaoBeneficio.js';
const router = express.Router();
const simulacaoModel = new SimulacaoBeneficio();

// Função de tratamento de erros
const errorHandler = (error, req, res, next) => {
  console.error(error); // Registre o erro para depuração
  res.status(500).json({ success: false, message: 'Erro interno no servidor', error: error.message });
};

// Rota para criar uma nova simulação
router.post('/', async (req, res, next) => {
  try {
    const simulacao = req.body; // Certifique-se de que o corpo da solicitação contém os dados da simulação
    const result = await simulacaoModel.criar(simulacao);
    
    res.json(result); // Envie os resultados como resposta em formato JSON

  } catch (error) {
    next(error); // Passe o erro para o middleware de tratamento de erros
  }
});

// Rota para obter todas as simulações
router.get('/', async (req, res) => {
  try {
    const result = await simulacaoModel.listarTodos();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar as simulações.', error: error.message });
  }
});

// Rota para obter uma simulação pelo ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await simulacaoModel.consultarPorId(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao obter a simulação.', error: error.message });
  }
});

// Rota para excluir uma simulação pelo ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await simulacaoModel.deletar(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao excluir a simulação.', error: error.message });
  }
});

router.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Ocorreu um erro no servidor!');
});

export default router;
