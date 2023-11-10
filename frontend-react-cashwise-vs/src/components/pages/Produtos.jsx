import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"
import Content from "../layout/Content"
import Footer from "../layout/Footer"
import CardUser from "../ui/CardUser"
import { useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

const Produtos = () => {
    const [product, setProduct] = useState([])
    const [showModal, setShowModal] = useState(false)
     
    useEffect(()=>{
      
      const getProduct = async () => {
        const response = await fetch('http://localhost:3300/product/list')
        const data = await response.json()
        console.log(data.success)
        console.log(data.product)
        setUsers(data.product)
      }

      getProduct()
      
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        const newProduct = {
          name: event.target.name.value,
          descricao: event.target.descricao.value,
          preco: event.target.preco.value,
        }
        
        const response = await fetch('http://localhost:3300/product',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProduct)
        })
  
        if(response.ok){
          const data = await response.json()
          alert(data.success)
          setShowModal(false)
          setProduct([...product, data.product])
          
        }
      }  
  
      return (
        <>
            <Header />
            <div id="main">
                <Sidebar />
                <Content>
                  <h1>Produtos</h1>
                  <Button as="button" variant="primary" onClick={() => setShowModal(true)}>Cadastrar Novos Produtos</Button>
    
                  <Modal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title id="contained-modal-title-vcenter">
                        Cadastrar Produto
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nome</Form.Label>
                          <Form.Control type="text" name="name"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Descricao</Form.Label>
                          <Form.Control type="descricao" name="descricao" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Preco</Form.Label>
                          <Form.Control type="preco" name="preco" />
                        </Form.Group>
                      
                        <Button variant="primary" type="submit">Cadastrar</Button>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={() => setShowModal(false)}>Close</Button>
                    </Modal.Footer>
                  </Modal>
    
                  {
  product.length > 0 ? product.map((item) => {
    return <CardUser key={item.id} user={item} />
  }) : <p>Carregando...</p>
}

                </Content>
            </div>
            <Footer />
        </>
      )
    }





export default Produtos
