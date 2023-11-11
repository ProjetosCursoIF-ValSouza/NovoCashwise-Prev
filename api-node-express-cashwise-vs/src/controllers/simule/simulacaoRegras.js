import express from 'express';
import { PrismaClient } from '@prisma/client';
import Big from 'big.js';
const prisma = new PrismaClient();

const router = express.Router();

// Função para obter o índice de atualização monetária com base no mês e ano
async function obterDadosAtualizacaoMonetaria(mesAno) {
  try {
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
  } catch (error) {
    console.error(error);
    return 1;
  }
}

// Função para criar entradas para salario_atualizado
async function criarSalarioAtualizadoEntries(simulacaoId, campoAnoMes, campoSalario) {
  try {
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
        salario_atualizado: salarioAtualizado,
        simulacao_beneficio_id: simulacaoId,
      }
    }));

    return salarioAtualizadoEntries.filter(entry => entry !== null);
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao criar entradas para salario_atualizado');
  }
}

// Função para calcular o valor de salário atualizado
async function calcularSalarioAtualizado(simulacaoId, mesAno, arrCampoAnoMes, arrCampoSalario) {
  try {
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
          salario_atualizado: salarioAtualizado,
          simulacao_beneficio: {
            connect: { id: simulacaoId },
          },
        },
      });

      return {
        mes_ano: mesAno,
        salario_atualizado: salarioAtualizado,
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
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao calcular o salário atualizado');
  }
}

// Função para calcular o mês e ano da aposentadoria
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

// Função para calcular o tempo de contribuição e pendente
function calcularTempoContribuicao(arrCampoAnoMes, periodoContribuicaoMinimo) {
  const tempoContribuicaoMes = arrCampoAnoMes.length;
  const tempoContribuicaoPendente = Math.max(0, periodoContribuicaoMinimo - tempoContribuicaoMes);
  return { tempoContribuicaoMes, tempoContribuicaoPendente };
}

// Função para calcular a idade com base na data de nascimento
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

// Função para calcular o mês de aposentadoria com base na idade
function calcularMesAposentadoria(dataNascimento, genero) {
  const { mesAposentadoria } = calcularAposentadoria(dataNascimento, genero);
  return mesAposentadoria;
}

// Função para calcular o ano de aposentadoria
function calcularAnoAposentadoria(dataNascimento, genero) {
  const { anoAposentadoria } = calcularAposentadoria(dataNascimento, genero);
  return anoAposentadoria;
}

// Função para calcular a idade da aposentadoria
function calcularIdadeAposentadoria(dataNascimento, genero) {
  const hoje = new Date();
  const { anoAposentadoria } = calcularAposentadoria(dataNascimento, genero);
  const dataAposentadoria = new Date(anoAposentadoria, 6 - 1); // 6 representa julho (7º mês)
  const mesAposentadoria = (dataAposentadoria.getMonth() + 1 < 10 ? '0' : '') + (dataAposentadoria.getMonth() + 1);
  
  return {
    idadeAposentadoria: anoAposentadoria,
  };
}

// Função para calcular os requisitos de aposentadoria com base no gênero
function calcularRequisitosAposentadoria(genero) {
  const idadeAposentadoria = genero === 'Masculino' ? 65 : 62;
  const periodoContribuicaoMinimo = 180; // Defina o período mínimo de contribuição necessário
  return {
    idadeAposentadoria,
    periodoContribuicaoMinimo,
  };
}

// Função para calcular o valor do benefício
async function calcularValorBeneficio(simulacaoId) {
  try {
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

    const somaSalariosAtualizados = salarioAtualizado.reduce((acc, salario) => acc.plus(new Big(salario.salario_atualizado)), new Big(0));
    const valorBeneficio = somaSalariosAtualizados.times(0.60).toFixed(2);

    return valorBeneficio;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao calcular o valor do benefício');
  }
}

// Rota POST para processar os dados do formulário de simulação
router.post('/', async (req, res) => {
  try {
    const { campoAnoMes, campoSalario, dataNascimento, genero } = req.body;

    if (!campoAnoMes || !campoSalario || !Array.isArray(campoAnoMes) || !Array.isArray(campoSalario)) {
      return res.status(400).json({ success: false, message: 'Dados ausentes ou inválidos' });
    }

    const idadeAtual = calcularIdade(dataNascimento);
    const { periodoContribuicaoMinimo, idadeAposentadoria } = calcularRequisitosAposentadoria(genero);
    const { tempoContribuicaoMes, tempoContribuicaoPendente } = calcularTempoContribuicao(campoAnoMes, periodoContribuicaoMinimo);

    const mesAposentadoria = calcularMesAposentadoria(idadeAtual, genero);
    const anoAposentadoria = calcularAnoAposentadoria(idadeAtual, genero);

    const simulacao = await prisma.simulacao_beneficio.create({
      data: {
        genero,
        data_nascimento: new Date(dataNascimento),
        idade: idadeAtual,
        tempo_contribuicao_mes: tempoContribuicaoMes,
        tempo_contribuicao_pendente: tempoContribuicaoPendente,
        idade_aposentadoria: idadeAposentadoria,
        mes_aposentadoria: mesAposentadoria,
        anoAposentadoria,
        valor_beneficio: NaN,
        salario_atualizado: {
          create: campoAnoMes.map((mesAno, index) => ({
            mes_ano: mesAno,
            salario_atualizado: 0,
          })),
        },
      },
    });

    const simulacaoId = simulacao.id;

    const salariosAtualizados = await criarSalarioAtualizadoEntries(simulacaoId, campoAnoMes, campoSalario);

    console.log("salarioatualizado", salariosAtualizados);

    await prisma.salario_atualizado.createMany({
      data: salariosAtualizados,
    });

    const valorBeneficio = await calcularValorBeneficio(simulacaoId);

    await prisma.simulacao_beneficio.update({
      where: { id: simulacaoId },
      data: { valor_beneficio: valorBeneficio },
    });

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
