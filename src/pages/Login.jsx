import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import basicurl from './basicUrl';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();


    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    // ✅ Store token
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);

    // ✅ Redirect based on role
    if (data.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/supervisor');
    }

  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
};

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;