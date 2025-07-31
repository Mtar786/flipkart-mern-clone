import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, reviewSuccess]);

  const addToCartHandler = () => {
    addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty: Number(qty)
    });
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(
        `/api/products/${id}/reviews`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        }
      );
      setReviewSuccess(true);
      setRating(0);
      setComment('');
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      setReviewError(
        err.response && err.response.data.message ? err.response.data.message : err.message
      );
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
        Go Back
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : product ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '4px' }} />
          </div>
          <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>
              <strong>Price:</strong> ${product.price.toFixed(2)}
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
            {product.countInStock > 0 && (
              <>
                <label htmlFor="qty" style={{ marginRight: '0.5rem' }}>
                  Qty
                </label>
                <select
                  id="qty"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  style={{ marginRight: '1rem' }}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addToCartHandler}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#2874f0', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Add To Cart
                </button>
              </>
            )}
            <div style={{ marginTop: '2rem' }}>
              <h3>Reviews</h3>
              {product.reviews.length === 0 && <p>No reviews</p>}
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {product.reviews.map((review) => (
                  <li key={review._id} style={{ borderBottom: '1px solid #ddd', padding: '0.5rem 0' }}>
                    <strong>{review.name}</strong> - {review.rating} ⭐
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '1rem' }}>
                <h4>Write a Customer Review</h4>
                {reviewSuccess && <p style={{ color: 'green' }}>Review submitted successfully</p>}
                {reviewError && <p style={{ color: 'red' }}>{reviewError}</p>}
                {userInfo ? (
                  <form onSubmit={submitReviewHandler}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label htmlFor="rating">Rating</label>
                      <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        style={{ marginLeft: '0.5rem' }}
                      >
                        <option value="0">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label htmlFor="comment">Comment</label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="3"
                        style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
                      ></textarea>
                    </div>
                    <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#2874f0', color: '#fff', border: 'none', cursor: 'pointer' }}>
                      Submit
                    </button>
                  </form>
                ) : (
                  <p>
                    Please <a href="/login">login</a> to write a review
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductScreen;