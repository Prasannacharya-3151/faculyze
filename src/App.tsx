import './App.css'
import AppRouter from './router/AppRouter'
import { ToastContainer } from 'react-toastify'
// import {pdfjs} from "react-pdf"

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  return (
    <>
    <AppRouter />
     <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
    
  )
}

export default App
