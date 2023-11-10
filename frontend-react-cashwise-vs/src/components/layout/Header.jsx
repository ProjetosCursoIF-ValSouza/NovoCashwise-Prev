import './Header.css';
import { NavLink } from 'react-router-dom';
import Button from '../ui/Button';
import { Image } from 'react-bootstrap'; // Importe o componente Image do React Bootstrap
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" />


// Substitua pela URL direta da imagem no GitHub
const logocashwise = 'https://github.com/ProjetosCursoIF-ValSouza/PrevidenciaAqui/blob/main/public/img/logocashwise.png?raw=true';


const Header = () => {
  return (
    <header>
      <div className="logo">
        <img
          src={logocashwise}
          alt="Logo da CashWise"
          style={{ maxWidth: '50px', height: 'auto' }}
        />
        <h1>CashWise</h1>
      </div>
      <nav>
        <ul>
          <li><NavLink to='/'>Home</NavLink></li>
          <li><NavLink to="/quem-somos">Sobre</NavLink></li>
          <li><NavLink to="/contato">Contato</NavLink></li>
          <li><NavLink to="/produtos">Boletim Informativo</NavLink></li>
          <li><NavLink to="/simule">Previdencia</NavLink></li>
       
        </ul>
      </nav>
    </header>
  );
}

export default Header;
