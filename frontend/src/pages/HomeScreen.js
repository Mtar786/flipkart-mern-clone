import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const keyword = params.get('keyword') || '';
  const pageNumber = params.get('page') || 1;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`);
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, pageNumber]);

  const handlePageChange = (newPage) => {
    navigate(`/?keyword=${keyword}&page=${newPage}`);
  };

  return (
    <div>
      <h1>Latest Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                style={{
                  margin: '0 0.25rem',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #ccc',
                  backgroundColor: page === i + 1 ? '#2874f0' : '#fff',
                  color: page === i + 1 ? '#fff' : '#000',
                  cursor: 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomeScreen;