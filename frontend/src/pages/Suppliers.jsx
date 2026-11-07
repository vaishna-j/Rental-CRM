import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuppliers(response.data.suppliers);
    } catch (error) {
      setMessage('Unable to load suppliers');
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const addSupplier = async e => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:5000/api/suppliers/add',
        { name, email, phone, company, address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Supplier added successfully!');
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setAddress('');

      fetchSuppliers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Supplier adding failed');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Supplier Management</h1>

      <form onSubmit={addSupplier} style={styles.form}>
        <h3>Add New Supplier</h3>

        <input
          placeholder="Supplier Name"
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
          style={styles.input}
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          style={styles.input}
        />

        <input
          placeholder="Company"
          value={company}
          onChange={e => setCompany(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Add Supplier
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>

      <h2>All Suppliers ({suppliers.length})</h2>

      <div style={styles.grid}>
        {suppliers.map(item => (
          <div key={item._id} style={styles.card}>
            <h3>{item.name}</h3>
            <p>Email: {item.email || 'N/A'}</p>
            <p>Phone: {item.phone}</p>
            <p>Company: {item.company || 'N/A'}</p>
            <p>Address: {item.address || 'N/A'}</p>
          </div>
        ))}

        {suppliers.length === 0 && <p>No suppliers found</p>}
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
};

export default Suppliers;
