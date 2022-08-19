import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import { useNavigate  } from 'react-router-dom';




const ProductList = () => {
    const [products, setProducts] = useState([]);

  //const [harjul, setHarjul] = useState([]);
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');

    const navigate = useNavigate ();

useEffect(() => {
   refreshToken();
   getProducts();



    //hanya di tambahkan enter doang wkwkw dan tulisan di bawah ini -_- dan ini <a href="# "
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    }

    const axiosJWT = axios.create();
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

  const getProducts = async () => {
    const response = await axiosJWT.get('http://localhost:5000/products', { //axios harus klik button get dulu ==> axiosJWT
      headers : {
         "Content-Type": "application/json",
         "Authorization" : `Bearer ${token}`
      }
    });
    setProducts(response.data);
  };

  const deleteProduct = async (productId) => {
    try {
      await axiosJWT.delete(`http://localhost:5000/products/${productId}`,{
        headers : {
        Authorization: `Bearer ${token}`
      }
      });
      getProducts();

    } catch (error) {
      console.log(error);
    }
  };




  return (
    <div className="container mt-5">
       <h1>Welcome Back: {name}</h1>
       <button onClick={getProducts} className="button is-info">Get Products</button>
      <Link to="/add" className="button is-success">
        Add New
      </Link>


      <div className="columns is-multiline mt-2">
        {products.map((product) => (
          <div className="column is-one-quarter" key={product.id}>
            <div className="card">
              <div className="card-image">
                <figure className="is-4by3">
                  <img src={product.url} alt="" />
                </figure>
              </div>
              <div className="card-content">
                <div className="media">
                  <div className="media-content">

                    <p className="title is-6"> <label className="label">Nama barang</label>{product.name}</p>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-6"> <label className="label">Harga Beli</label> {product.harbel}  </p>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-6"> <label className="label">Harga Jual</label>{product.harjul}</p>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-6"> <label className="label">Stok Barang</label>{product.stok}</p>
                  </div>
                </div>
              </div>
              <footer className="card-footer">
                <Link to={`edit/${product.id}`} className="card-footer-item">
                  Edit
                </Link>
                <a href="# " onClick={() => deleteProduct(product.id)} className="card-footer-item" >
                  Delete
                </a>
              </footer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
