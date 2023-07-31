import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  const getTodayTimestamp = () => {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var hours = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();

    return (
      year + "-" + month + "-" + day + "" + hours + ":" + minute + ":" + second
    );
  };

  const [product, setProduct] = useState({
    id: 0,
    name: "",
    price: 0,
    stock: 0,
    description: "",
    created_at: getTodayTimestamp(),
  });

  if (id) {
    useEffect(() => {
      setLoading(false);
      axiosClient
        .get(`/products/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setProduct(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const onSubmit = (ev) => {
    ev.preventDefault();

    // if there is product id we update data
    if (product.id) {
      axiosClient
        .put(`/products/${product.id}`, product)
        .then(() => {
          setNotification("Product successfully updated");
          navigate("/products");
        })
        .catch((err) => {
          const response = err.response;

          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/products`, product)
        .then(() => {
          setNotification("Product successfully created");
          navigate("/products");
        })
        .catch((err) => {
          const response = err.response;

          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <>
      {product.id ? (
        <h1>Update Product : {product.name}</h1>
      ) : (
        <h1>New Product</h1>
      )}
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              onChange={(ev) =>
                setProduct({ ...product, name: ev.target.value })
              }
              value={product.name}
              placeholder="Name"
            />
            <input
              type="number"
              onChange={(ev) =>
                setProduct({ ...product, price: parseInt(ev.target.value) })
              }
              value={parseInt(product.price)}
              placeholder="Price"
            />
            <input
              type="number"
              onChange={(ev) =>
                setProduct({ ...product, stock: parseInt(ev.target.value) })
              }
              value={product.stock}
              placeholder="Stocks Quantity"
            />
            <input
              onChange={(ev) =>
                setProduct({ ...product, description: ev.target.value })
              }
              value={product.description}
              placeholder="Description"
            />
            <input
              type="datetime-local"
              onChange={(ev) =>
                setProduct({ ...product, created_at: ev.target.value })
              }
              value={product.created_at}
              placeholder="Date In"
            />
            <button className="btn btn-add">Submit</button>
          </form>
        )}
      </div>
    </>
  );
}
