import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import QuemSomos from "./components/pages/QuemSomos";
import Produtos from "./components/pages/Produtos";
import Page404 from "./components/pages/Page404";
import Contato from "./components/pages/Contato";
import Simule from "./components/pages/Simule";
import Resultado from "./components/layout/Resultado";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quem-somos" element={<QuemSomos />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/contato" element={<Contato />} />
      <Route path="/simule" element={<Simule />} />
      <Route path="/resultado" element={<Resultado />} />
      <Route path="/*" element={<Page404 />} />
    </Routes>
  );
};

export default App;
