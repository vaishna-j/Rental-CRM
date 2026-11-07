import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Staff() {
  const [staff, setStaff] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchStaff = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/staff/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStaff(response.data.staff);
    } catch (error) {
      setMessage('Unable to load staff');
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const addStaff = async e => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:5000/api/staff/add',
        { name, email, password, phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Staff added successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');

      fetchStaff();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Staff adding failed');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Staff Management</h1>

      <form onSubmit={addStaff} style={styles.form}>
        <h3>Add New Staff</h3>

        <input
          placeholder="Staff Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Add Staff
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>

      <h2>All Staff ({staff.length})</h2>

      <div style={styles.grid}>
        {staff.map(item => (
          <div key={item._id} style={styles.card}>
            <h3>{item.name}</h3>
            <p style={styles.detail}>Email: {item.email}</p>
            <p style={styles.detail}>Phone: {item.phone || 'N/A'}</p>
            <p style={styles.detail}>Role: {item.role}</p>
          </div>
        ))}

        {staff.length === 0 && <p>No staff found</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 'clamp(15px, 4vw, 30px)',
    background: '#f1f5f9',
    minHeight: '100vh',
    fontFamily: 'Arial',
    width: '100%',
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },
  heading: {
    fontSize: 'clamp(22px, 4vw, 30px)',
    marginBottom: '25px',
  },
  form: {
    background: 'white',
    padding: 'clamp(15px, 4vw, 25px)',
    width: '100%',
    maxWidth: '450px',
    borderRadius: '10px',
    marginBottom: '30px',
    boxSizing: 'border-box',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  input: {
    width: '100%',
    maxWidth: '100%',
    padding: '12px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '12px',
    overflowWrap: 'anywhere',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
    gap: '20px',
    width: '100%',
  },
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    minWidth: 0,
    overflowWrap: 'anywhere',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  detail: {
    overflowWrap: 'anywhere',
  },
};

export default Staff;
