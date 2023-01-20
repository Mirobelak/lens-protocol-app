import Navbar from '../components/Nabar'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div style={{padding : "20px"}}>
      <Navbar/>     
       <Component {...pageProps} />
    </div>
  )
}

export default MyApp
