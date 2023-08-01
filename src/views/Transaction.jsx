import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [searchedData, setSearchedData] = useState(transactions?.data);
  const [loading, setLoading] = useState(true);
  const [currPage, setCurrPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { setSearchParam, searchParam } = useStateContext();
  let tableIdx = 1;

  function getAllData() {
    axiosClient
      .get("/transactions")
      .then((data) => {
        setTransactions(data?.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    getAllData();
  }, []);

  const fetchDataPerPage = async (page) => {
    try {
      const res = await axiosClient
        .get(page)
        .then((data) => {
          setTransactions(data?.data);
          setTotalPages(data?.meta?.last_page);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
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

  const searchProduct = (ev) => {
    const searchValue = ev.target.value;
    setSearchParam(searchValue);
    const data = transactions?.data;
    const filteredData = data?.filter((item) =>
      item.reference_no.includes(searchParam)
    );
    setSearchedData(filteredData);
  };

  return (
    <>
      <div className="flex" style={{ marginBottom: "1.3rem" }}>
        <h2>Manage Transaction</h2>
        <input
          type="text"
          style={{ maxWidth: 200 }}
          value={searchParam}
          placeholder="Search product..."
          onChange={(ev) => searchProduct(ev)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Reference No.</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Payment Amount</th>
            <th>Created At</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan={7} className="text-center">
                Loading Transactions...
              </td>
            </tr>
          </tbody>
        ) : transactions?.length < 1 ? (
          <tbody>
            <tr style={{ color: "red" }}>
              <td colSpan={7} className="text-center">
                Belum ada transaksi
              </td>
            </tr>
          </tbody>
        ) : searchedData ? (
          <tbody>
            {searchedData?.map((transaction, id) => (
              <tr key={id}>
                <td>{tableIdx++}</td>
                <td>{transaction.reference_no}</td>
                <td>{parseInt(transaction.price)}</td>
                <td>{transaction.quantity}</td>
                <td>{parseInt(transaction.payment_amount)}</td>
                <td>{transaction.created_at}</td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            {transactions?.data?.map((transaction, id) => (
              <tr key={transaction}>
                <td>{tableIdx++}</td>
                <td>{transaction.reference_no}</td>
                <td>{parseInt(transaction.price)}</td>
                <td>{transaction.quantity}</td>
                <td>{parseInt(transaction.payment_amount)}</td>
                <td>{transaction.created_at}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      <div className="pagination-wrapper">
        {transactions?.meta?.links.map((link) => (
          <>
            <button
              className="btn btn-add"
              key={link}
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
