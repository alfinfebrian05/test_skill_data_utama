import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setNotification } = useStateContext();
  const [currPage, setCurrPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let tableId = 1;

  const getProducts = () => {
    axiosClient
      .get(`/products?page=${currPage}`)
      .then(({ data }) => {
        setLoading(false);
        setProducts(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  const deleteProduct = (id) => {
    const confirmDelete = window.confirm(
      "Anda yakin ingin menghapus produk ini? Anda tidak dapat mengembalikan data yang sudah dihapus!"
    );

    if (confirmDelete) {
      axiosClient
        .delete("/products/" + id)
        .then(({ data }) => {
          setProducts(data);
          setNotification("Success delete product");
        })
        .catch(() => {
          setNotification("Delete product failed");
        });

      getProducts();
    }
  };

  const createInvoice = (productId, productQty) => {
    axiosClient
      .post(`/transactions?product_id=${productId}&quantity=${productQty}`)
      .then(({ data }) => {
        setLoading(false);
        setNotification(data.message);
      })
      .catch(() => setLoading(false));
  };

  const fetchDataPerPage = async (page) => {
    try {
      const response = await axiosClient
        .get(page)
        .then(({ data }) => {
          setProducts(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });

      setTotalPages(response?.meta?.last_page);
    } catch (error) {
      console.error("Error fetching data : ", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrPages(page);
    fetchDataPerPage(page);
  };

  useEffect(() => {
    fetchDataPerPage(currPage);
  }, []);

  return (
    <>
      <div className="flex" style={{ marginBottom: "28px" }}>
        <h2>Manage Products</h2>
        <Link to="/products/add" className="btn btn-add">
          Add Product
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock Quantity</th>
            <th>Description</th>
            <th>Date In</th>
            <th>Action</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan={7} className="text-center">
                Loading Product...
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {products?.data
              ?.sort((a, b) => a.id - b.id)
              .map((product) => (
                <tr key={product.id}>
                  <td>{tableId++}</td>
                  <td>{product.name}</td>
                  <td>{parseInt(product.price)}</td>
                  <td>{product.stock}</td>
                  <td className="text-truncate">{product.description}</td>
                  <td>{product.created_at}</td>
                  <td>
                    <Link className="btn-edit" to={"/products/" + product.id}>
                      Edit
                    </Link>
                    &nbsp;
                    <button
                      className="btn-add"
                      onClick={() => createInvoice(product.id, product.stock)}
                    >
                      Create Invoice
                    </button>
                    &nbsp;
                    <button
                      className="btn-delete"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        )}
      </table>
      <div className="pagination-wrapper">
        {products?.meta?.links.map((link) => (
          <>
            <button
              className="btn btn-add"
              key={link.label}
              onClick={() => handlePageChange(link.url)}
              disabled={link.active}
            >
              {link.label}
            </button>
            &nbsp; &nbsp;
          </>
        ))}
      </div>
    </>
  );
}
