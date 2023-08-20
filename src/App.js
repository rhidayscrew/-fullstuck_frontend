import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Tableregister from "./components/tableregister/Tableregister";
import ProductList from "./components/product/ProductList";
import AddProduct from "./components/product/AddProduct";
import EditProduct from "./components/product/EditProduct";
import UserpsList from "./components/userps/UserpsList";



function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
         <Route path="/" element={<Login/>}/>
         <Route path="register" element={<Register/>}/>
         <Route path='dashboard' element={<><Navbar /> <Dashboard /></>} />
         <Route path='tableregister' element={<><Navbar /> <Tableregister /></>} />
         <Route path="productlist" element={<><Navbar /> <ProductList/></>} />
         <Route path="add" element={<><Navbar /> <AddProduct/></>} />
         <Route path="userpslist" element={<><Navbar /> <UserpsList/></>} />
         <Route path="productlist/edit/:id" element={<><Navbar /> <EditProduct/></>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
