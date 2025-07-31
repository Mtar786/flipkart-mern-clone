import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminUsersScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [successDelete, setSuccessDelete] = useState(false);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
      return;
    }
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setUsers(data);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    };
    fetchUsers();
  }, [userInfo, navigate, successDelete]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setSuccessDelete(!successDelete);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    }
  };

  return (
    <div>
      <h1>Users</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Admin</th>
            <th style={{ border: '1px solid #ddd', padding: '0.5rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{user._id.substring(user._id.length - 6)}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{user.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{user.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{user.isAdmin ? 'Yes' : 'No'}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                {/* Edit feature could go here */}
                <button
                  onClick={() => deleteHandler(user._id)}
                  style={{ padding: '0.25rem 0.5rem', backgroundColor: '#d9534f', color: '#fff', border: 'none', marginRight: '0.5rem', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersScreen;