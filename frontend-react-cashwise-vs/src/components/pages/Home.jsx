import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"
import Content from "../layout/Content"
import Footer from "../layout/Footer"


const Home = () => {
  return (
    <>
      <Header />
      <div id="main">
        <Sidebar />
        <Content>
          <h1>Home</h1>
        </Content>

      </div>
      <Footer />
    </>

  )
}

export default Home