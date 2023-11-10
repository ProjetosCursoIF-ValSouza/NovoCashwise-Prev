import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import { useLocation } from 'react-router-dom';
import { Container, Button } from "react-bootstrap";
import "./Resultado.css"; // Importe os estilos CSS

function ResultadoPage() {
  const location = useLocation();
  const simulationResults = location.state;

  console.log(simulationResults)

  const generoLabel = simulationResults.simulacao.genero === 'm' ? 'Masculino' : 'Feminino';
  const navigate = useNavigate();



  return (
    <div className="body">
      <Header />
      <main className="main">
        <div className="bloco">
          <Container className="container">
            <div className="titulo">
              <h2><b>Dados Pessoais</b></h2>
            </div>
            <div className="barra">
              <div>
                <p><i>Gênero:</i> <span>{generoLabel}</span></p>
              </div>
              <div>
                <p><i>Idade Atual:</i> <span>{simulationResults.idadeAtual} anos</span></p>
              </div>
              <div>
                <p><i>Tempo de Contribuição:</i> <span>{simulationResults.simulacao.tempo_contribuicao_mes} meses</span></p>
              </div>
            </div>
          </Container>
          <Container className="container">
            <div className= "titulo">
              <h2><b>Resultados</b></h2>
            </div>
            <div className="barra">
              <div>
                <p><i>Idade da Aposentadoria:</i> <span>{simulationResults.idadeAposentadoria} anos</span></p>
              </div>
              <div>
                <p><i>Mês e ano da Aposentadoria:</i> <span>{simulationResults.mesAposentadoria} / {simulationResults.anoAposentadoria}</span></p>
              </div>
              <div>
                <p><i>Quanto tempo falta para contribuir:</i><br /><span>{simulationResults.tempoContribuicaoPendente} meses</span></p>
              </div>
              <div>
                <p><i>O valor mínimo do meu benefício será:</i> <span id="valorBeneficio">R$ {parseFloat(simulationResults.valorBeneficio).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</span></p>
              </div>
            </div>
          </Container>
          <div className="botao">
            <Button variant="secondary" className="envio" onClick={() => {
              navigate("/simule"); // Navegue de volta para a página de simulação
            }}>Nova Consulta</Button>
          </div>
          <div className="imagem">
            <img src="img/senhor.png" alt="" width="200px" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResultadoPage;
