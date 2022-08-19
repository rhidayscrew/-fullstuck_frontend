import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
//import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const [title, setTitle] = useState("");
  const [harbel, setHarbel] = useState("");
  const [harjul, setHarjul] = useState("");
  const [stok, setStok] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [msg, setMsg] = useState('');
  const { id } = useParams();
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getProductById();


    //hanya di tambahkan enter doang wkwkw dan tulisan di bawah ini -_- dan ini <a href="# "
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


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

  const getProductById = async () => {
    const response = await axiosJWT.get(`http://localhost:5000/products/${id}`,{
        headers : {
         "Content-Type": "application/json",
         "Authorization" : `Bearer ${token}`
      }

    });
    setTitle(response.data.name);
    setHarbel(response.data.harbel);
    setHarjul(response.data.harjul);
    setStok(response.data.stok);
    setFile(response.data.image);
    setPreview(response.data.url);
  };

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("harbel", harbel);
    formData.append("harjul", harjul);
    formData.append("stok", stok);
    try {
      await axiosJWT.patch(`http://localhost:5000/products/${id}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
           "Authorization" : `Bearer ${token}`,
        },
      });
      navigate("/productlist");
    } catch (error) {
       if (error.response) {
                setMsg(error.response.data.msg);
            }
    }
  };

  return (
    <div className="columns is-centered mt-5">
      <div className="column is-half">
         <h1>Welcome Back: {name}</h1>
        <form onSubmit={updateProduct}>
          <p className="has-text-centered">{msg}</p>
          <div className="field">
            <label className="label">Nama barang</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nama Barang"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Harga beli</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={harbel}
                onChange={(e) => setHarbel(e.target.value)}
                placeholder="Harga beli"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Harga jual</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={harjul}
                onChange={(e) => setHarjul(e.target.value)}
                placeholder="Harga Jual"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Stok Barang</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                placeholder="Harga Jual"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Image</label>
            <div className="control">
              <div className="file">
                <label className="file-label">
                  <input
                    type="file"
                    className="file-input"
                    onChange={loadImage}
                  />
                  <span className="file-cta">
                    <span className="file-label">Choose a file...</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {preview ? (
            <figure className="image is-128x128">
              <img src={preview} alt="" />
            </figure>
          ) : (
            ""
          )}

          <div className="field">
            <div className="control">
              <button type="submit" className="button is-success">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
