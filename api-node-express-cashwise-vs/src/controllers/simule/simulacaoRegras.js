import express from 'express';
import { PrismaClient } from '@prisma/client';
import Big from 'big.js'; // Importe a biblioteca Big.js

const prisma = new PrismaClient();

const router = express.Router();

// Função para obter o índice de atualização monetária com base no mês e ano
async function obterDadosAtualizacaoMonetaria(mesAno) {
  try {
    const parts = mesAno.split('/');
    if (parts.length === 2) {
      const newDate = parts[1] + '-' + parts[0]; // Convertendo o formato
      console.log("Mês ano:", mesAno); // Certificando-se de que o formato original seja mantido
      console.log("Nova data:", newDate); // Exibindo o formato convertido
      const indiceMonetario = await prisma.atualizacao_monetaria.findFirst({
        where: {
          mes_ano: newDate, // Usando o formato convertido
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
    // Lide com o erro aqui, você pode retornar um valor padrão
    console.error(error);
    return 1; // Valor padrão, você pode definir o valor que fizer sentido em seu contexto
  }
}

// Função para criar entradas para salario_atualizado
async function criarSalarioAtualizadoEntries(simulacaoId, campoAnoMes, campoSalario) {
  try {
    // Obtém a simulação com base no ID
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
        return null; // Ou algum valor padrão apropriado
      }

      const salarioAtualizado = new Big(parsedSalario).times(indice).toFixed(2);

      return {
        mes_ano: mesAno,
        salario_atualizado: salarioAtualizado,
        simulacao_beneficio_id: simulacaoId,
        // simulacao_beneficio: {
        //   connect: { id: simulacaoId },
        // },
      }
    }));

    return salarioAtualizadoEntries.filter(entry => entry !== null); // Remova entradas nulas
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao criar entradas para salario_atualizado');
  }
}

// Função para calcular o valor de salário atualizado
async function calcularSalarioAtualizado(simulacaoId, mesAno, arrCampoAnoMes, arrCampoSalario) {
  try {
    // Obtém a simulação com base no ID
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
        return 0; // Se não for um número válido, defina como 0
      }
      // Use o Big.js para converter e arredondar o número para duas casas decimais
      const salarioAtualizado = new Big(parsedSalario).times(indice).toFixed(2);

      // Conecta o salário atualizado à simulação
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
    

    // Inserir as entradas no banco de dados usando o Prisma
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

// Função para calcular os requisitos de aposentadoria com base no gênero
function calcularRequisitosAposentadoria(genero) {
  return {
    Masculino: { periodoContribuicaoMinimo: 240, idadeAposentadoria: 65 },
    Feminino: { periodoContribuicaoMinimo: 180, idadeAposentadoria: 62 },
  }[genero] || { periodoContribuicaoMinimo: 0, idadeAposentadoria: 0 };
}

// Função para calcular o tempo de contribuição e pendente
function calcularTempoContribuicao(arrCampoAnoMes, periodoContribuicaoMinimo) {
  const tempoContribuicaoMes = arrCampoAnoMes.length;
  const tempoContribuicaoPendente = periodoContribuicaoMinimo - tempoContribuicaoMes;
  return { tempoContribuicaoMes, tempoContribuicaoPendente };
}

// Função para calcular a idade com base na data de nascimento
function calcularIdade(dataNascimento) {
  const dataAtual = new Date();
  const dataNasc = new Date(dataNascimento);
  const diff = dataAtual - dataNasc;
  const idade = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)); // Calcular a idade em anos
  return idade;
}

// Função para calcular o mês de aposentadoria com base na idade
function calcularMesAposentadoria(idadeAtual, idadeAposentadoria, mesNascimento, anoNascimento) {
  const dataAtual = new Date();
  const mesAposentadoria = dataAtual.getMonth() + 1; // O mês atual (1 para janeiro, 2 para fevereiro, etc.)
  const anoAtual = dataAtual.getFullYear();

  const anoAposentadoria = anoNascimento + idadeAposentadoria;
  const dataAposentadoria = new Date(anoAposentadoria, mesNascimento - 1);

  console.log("mes data aposentadoria", dataAposentadoria.getMonth())

  const mesAposentadoriaCorrigido = dataAposentadoria.getMonth() + 1 
  console.log("mes calculado", mesAposentadoriaCorrigido)

  if (idadeAtual >= idadeAposentadoria) {
    // Se a idade atual for maior ou igual à idade de aposentadoria, o mês de aposentadoria é o mês atual
    return mesAposentadoriaCorrigido;
  } else {
    // Se a idade atual for menor do que a idade de aposentadoria, o mês de aposentadoria será o mês em que o usuário completará a idade de aposentadoria
    const mesesRestantes = 12 - mesAposentadoria; // Meses restantes no ano atual
    const mesesNecessários = (idadeAposentadoria - idadeAtual) * 12 - 1; // Meses necessários para atingir a idade de aposentadoria
    
    if (mesesNecessários <= mesesRestantes) {
      console.log(mesAposentadoriaCorrigido + mesesNecessários)
      return mesAposentadoriaCorrigido + mesesNecessários;
    } else {
      console.log(mesesNecessários - mesesRestantes)
      return mesesNecessários - mesesRestantes;
    }
  }
}
// Função para calcular o ano de aposentadoria
function calcularAnoAposentadoria(idadeAtual, idadeAposentadoria) {
  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();
  
  if (idadeAtual >= idadeAposentadoria) {
    // Se a idade atual for maior ou igual à idade de aposentadoria, o ano de aposentadoria é o ano atual
    return anoAtual;
  } else {
    // Se a idade atual for menor do que a idade de aposentadoria, o ano de aposentadoria será o ano em que o usuário completará a idade de aposentadoria
    const anosNecessarios = idadeAposentadoria - idadeAtual; // Anos necessários para atingir a idade de aposentadoria
    return anoAtual + anosNecessarios;
  }
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

    // Verifique se campoAnoMes e campoSalario estão definidos e não vazios
    if (!campoAnoMes || !campoSalario || !Array.isArray(campoAnoMes) || !Array.isArray(campoSalario)) {
      return res.status(400).json({ success: false, message: 'Dados ausentes ou inválidos' });
    }

    const idadeAtual = calcularIdade(dataNascimento);
    const { periodoContribuicaoMinimo, idadeAposentadoria } = calcularRequisitosAposentadoria(genero);
    const { tempoContribuicaoMes, tempoContribuicaoPendente } = calcularTempoContribuicao(campoAnoMes, periodoContribuicaoMinimo);

    const mesAposentadoria = calcularMesAposentadoria(idadeAtual, idadeAposentadoria);
    const anoAposentadoria = calcularAnoAposentadoria(idadeAtual, idadeAposentadoria);

    // Inserir a simulação no banco de dados usando o Prisma
    const simulacao = await prisma.simulacao_beneficio.create({
      data: {
        genero,
        data_nascimento: new Date(dataNascimento),
        idade: idadeAtual,
        tempo_contribuicao_mes: tempoContribuicaoMes,
        idade_aposentadoria: idadeAposentadoria,
        mes_aposentadoria: mesAposentadoria,
        anoAposentadoria,
        valor_beneficio: NaN, // Defina o valor inicial como NaN
        salario_atualizado: {
          create: campoAnoMes.map((mesAno, index) => ({
            mes_ano: mesAno,
            salario_atualizado: 0, // Defina como 0, você pode ajustar conforme necessário
          })),
        },
      },
    });

    // Após a criação da simulação, você pode obter o ID
    const simulacaoId = simulacao.id;

    // Calcular o salário atualizado e inserir na tabela salario_atualizado
    const salariosAtualizados = await criarSalarioAtualizadoEntries(simulacaoId, campoAnoMes, campoSalario);

console.log("salarioatualizado", salariosAtualizados)

    // Inserir as entradas no banco de dados usando o Prisma
    await prisma.salario_atualizado.createMany({
      data: salariosAtualizados,
    });

    // Atualizar o valor do benefício no banco de dados (se for possível calcular)
    const valorBeneficio = await calcularValorBeneficio(simulacaoId);

    await prisma.simulacao_beneficio.update({
      where: { id: simulacaoId },
      data: { valor_beneficio: valorBeneficio },
    });

    // Criar um objeto 'result' com todas as informações
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

    // Retornar os resultados em formato JSON
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao processar a simulação', error: error.message });
  }
});

export default router;