import express from 'express';
import { PrismaClient } from '@prisma/client';
import Big from 'big.js';

const prisma = new PrismaClient();

const router = express.Router();

// Função de middleware para tratamento de erros
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ success: false, message: 'Ocorreu um erro', error: err.message });
}

// Tratar erros em funções assíncronas
async function handleAsyncError(fn) {
  try {
    return await fn();
  } catch (error) {
    console.error('Erro:', error);
    throw new Error('Erro ao processar');
  }
}

// Adicionar ao final das minhas rotas
router.use(errorHandler);

async function obterDadosAtualizacaoMonetaria(mesAno) {
  return await handleAsyncError(async () => {
    const parts = mesAno.split('/');
    if (parts.length === 2) {
      const newDate = parts[1] + '-' + parts[0];
      console.log("Mês ano:", mesAno);
      console.log("Nova data:", newDate);
      const indiceMonetario = await prisma.atualizacao_monetaria.findFirst({
        where: {
          mes_ano: newDate,
        },
      });

      console.log(indiceMonetario);

      if (indiceMonetario) {
        return indiceMonetario.indice;
      } else {
        throw new Error(`Índice de atualização monetária não encontrado para ${mesAno}`);
      }
    } else {
      throw new Error(`Formato de mês/ano inválido: ${mesAno}`);
    }
  });
}

async function criarSalarioAtualizadoEntries(simulacaoId, campoAnoMes, campoSalario) {
  return await handleAsyncError(async () => {
    const simulacao = await prisma.simulacao_beneficio.findUnique({
      where: { id: simulacaoId },
    });

    if (!simulacao) {
      throw new Error(`Simulação não encontrada para o ID: ${simulacaoId}`);
    }

    const salarioAtualizadoEntries = await Promise.all(campoAnoMes.map(async (mesAno, index) => {
      const salario = campoSalario[index];
      const indice = await obterDadosAtualizacaoMonetaria(mesAno);
      const parsedSalario = parseFloat(salario);

      if (isNaN(parsedSalario)) {
        console.log(`Salário inválido para ${mesAno}: ${salario}`);
        return null;
      }

      const salarioAtualizado = new Big(parsedSalario).times(indice).toFixed(2);

      return {
        mes_ano: mesAno,
        salario_atualizado: parseFloat(salarioAtualizado),
        simulacao_beneficio_id: simulacaoId,
      };
    }));

    return salarioAtualizadoEntries.filter(entry => entry !== null);
  });
}

async function calcularSalarioAtualizado(simulacaoId, mesAno, arrCampoAnoMes, arrCampoSalario) {
  return await handleAsyncError(async () => {
    const simulacao = await prisma.simulacao_beneficio.findUnique({
      where: { id: simulacaoId },
    });

    if (!simulacao) {
      throw new Error(`Simulação não encontrada para o ID: ${simulacaoId}`);
    }

    simulacaoId = simulacao.id;

    const salarioAtualizadoEntries = await Promise.all(arrCampoAnoMes.map(async (mesAno, index) => {
      const salario = arrCampoSalario[index];
      const indice = await obterDadosAtualizacaoMonetaria(mesAno);
      const parsedSalario = parseFloat(salario);

      if (isNaN(parsedSalario)) {
        console.log(`Salário inválido para ${mesAno}: ${salario}`);
        return 0;
      }

      const salarioAtualizado = new Big(parsedSalario).times(indice).toFixed(2);

      await prisma.salario_atualizado.create({
        data: {
          mes_ano: mesAno,
          salario_atualizado: parseFloat(salarioAtualizado),
          simulacao_beneficio: {
            connect: { id: simulacaoId },
          },
        },
      });

      return {
        mes_ano: mesAno,
        salario_atualizado: parseFloat(salarioAtualizado),
        simulacao_beneficio: {
          connect: { id: simulacaoId },
        },
      };
    }));

    await prisma.salario_atualizado.createMany({
      data: salarioAtualizadoEntries,
    });

    const salarioAtualizado = salarioAtualizadoEntries.map(entry => entry.salario_atualizado);

    if (salarioAtualizado.some(isNaN)) {
      const valoresInvalidos = salarioAtualizado.filter(isNaN);
      console.log(`Valores de salário atualizado inválidos: ${valoresInvalidos}`);
      throw new Error('Valores de salário atualizado inválidos');
    }

    return salarioAtualizado;
  });
}

function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = nascimento.getMonth();
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

function calcularRequisitosAposentadoria(genero) {
  const MASCULINO = 'Masculino';
  const FEMININO = 'Feminino';

  const requisitos = {
    [MASCULINO]: { periodoContribuicaoMinimo: 240, idadeAposentadoria: 65 },
    [FEMININO]: { periodoContribuicaoMinimo: 180, idadeAposentadoria: 62 },
  };

  return requisitos[genero] || { periodoContribuicaoMinimo: 0, idadeAposentadoria: 0 };
}

function calcularAposentadoria(idade, genero) {
  const idadeAposentadoria = genero === 'Masculino' ? 65 : 62;
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;
  let mesAposentadoria, anoAposentadoria;

  if (mesAtual <= 6) {
    mesAposentadoria = 7;
    anoAposentadoria = anoAtual + idadeAposentadoria - idade;
  } else {
    mesAposentadoria = 7;
    anoAposentadoria = anoAtual + idadeAposentadoria - idade + 1;
  }

  return {
    mesAposentadoria,
    anoAposentadoria
  };
}

function calcularMesAposentadoria(dataNascimento, genero) {
  const { mesAposentadoria } = calcularAposentadoria(dataNascimento, genero);
  return mesAposentadoria;
}

function calcularAnoAposentadoria(dataNascimento, genero) {
  const { anoAposentadoria } = calcularAposentadoria(dataNascimento, genero);
  return anoAposentadoria;

}

function calcularTempoContribuicao(arrCampoAnoMes, periodoContribuicaoMinimo) {
  try {
    const tempoContribuicaoMes = arrCampoAnoMes.length;
    const tempoContribuicaoPendente = Math.max(0, periodoContribuicaoMinimo - tempoContribuicaoMes);

    return { tempoContribuicaoMes, tempoContribuicaoPendente };
  } catch (error) {
    console.error(error);
    // Retorne um objeto padrão em caso de erro
    return { tempoContribuicaoMes: 0, tempoContribuicaoPendente: 0 };
  }
}


async function calcularValorBeneficio(simulacaoId) {
  return await handleAsyncError(async () => {
    const simulacaoBeneficio = await prisma.simulacao_beneficio.findUnique({
      where: { id: simulacaoId },
      include: {
        salario_atualizado: true,
      },
    });

    if (!simulacaoBeneficio) {
      throw new Error('Simulação não encontrada');
    }

    const salarioAtualizado = simulacaoBeneficio.salario_atualizado;

    if (!salarioAtualizado || salarioAtualizado.length === 0) {
      throw new Error('Não há valores de salário atualizado para calcular o benefício');
    }

    const salarioAtualizadoEntries = salarioAtualizado.map(salario => ({
      mes_ano: salario.mes_ano,
      salario_atualizado: new Big(salario.salario_atualizado).toFixed(2),
    }));

    const somaSalariosAtualizados = salarioAtualizadoEntries.reduce((acc, salario) => acc.plus(new Big(salario.salario_atualizado)), new Big(0));

    const valorBeneficio = somaSalariosAtualizados.times(0.60).toFixed(2);

    return valorBeneficio;
  });
}

router.post('/', async (req, res) => {
  let tempoContribuicaoPendente;
  try {
    const { campoAnoMes, campoSalario, dataNascimento, genero } = req.body;

    if (!campoAnoMes || !campoSalario || !Array.isArray(campoAnoMes) || !Array.isArray(campoSalario)) {
      return res.status(400).json({ success: false, message: 'Dados ausentes ou inválidos' });
    }

    const idadeAtual = calcularIdade(dataNascimento);
    const { periodoContribuicaoMinimo, idadeAposentadoria } = calcularRequisitosAposentadoria(genero);
    const { tempoContribuicaoMes } = calcularTempoContribuicao(campoAnoMes, periodoContribuicaoMinimo);
    tempoContribuicaoPendente = calcularTempoContribuicao(campoAnoMes, periodoContribuicaoMinimo).tempoContribuicaoPendente;

    const mesAposentadoria = calcularMesAposentadoria(idadeAtual, genero);
    const anoAposentadoria = calcularAnoAposentadoria(idadeAtual, genero);

    const simulacao = await prisma.simulacao_beneficio.create({
      data: {
        genero,
        data_nascimento: new Date(dataNascimento),
        idade: idadeAtual,
        tempo_contribuicao_mes: tempoContribuicaoMes,
        idade_aposentadoria: idadeAposentadoria,
        mes_aposentadoria: mesAposentadoria,
        anoAposentadoria,
        tempo_contribuicao_pendente: tempoContribuicaoPendente,
      },
    });

    const simulacaoId = simulacao.id;

    const salarioAtualizadoEntries = await criarSalarioAtualizadoEntries(simulacaoId, campoAnoMes, campoSalario);

    await prisma.salario_atualizado.createMany({
      data: salarioAtualizadoEntries,
    });

    const valorBeneficio = await calcularValorBeneficio(simulacaoId);

    const result = {
      success: true,
      message: 'Simulação inserida com sucesso',
      simulacao,
      idSimulacao: simulacaoId,
      idadeAtual,
      periodoContribuicaoMinimo,
      idadeAposentadoria,
      tempoContribuicaoMes,
      tempoContribuicaoPendente,
      mesAposentadoria,
      anoAposentadoria,
      valorBeneficio: isNaN(valorBeneficio) ? 'Valor não apurado' : valorBeneficio,
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao processar a simulação', error: error.message });
  }
});

export default router;
