import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Login from './components/Login';
import Albums from './components/Albums';
import AlbumDetail from './components/AlbumDetail';
function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <ToastContainer
position="bottom-right"
autoClose={2000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover= {false}
theme="light"
/>
     <Routes>
      <Route path = "/" element = {<Login/>}/>
      <Route path = "/albums" element = {<Albums/>}/>
      <Route path = "/album/:albumId" element = {<AlbumDetail/>}/>
     </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
