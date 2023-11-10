import Content from "../layout/Content"
import Footer from "../layout/Footer"
import Header  from "../layout/Header"
import Sidebar from "../layout/Sidebar"

const Contato = () => {
  return (
    <>
    <Header />
    <div className="main">
        <Sidebar />
        <Content>
    <h1>Contato</h1>
     </Content>
       
    </div>
    <Footer/>
    </>
  )
}

export default Contato

