import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:5000/api/customers/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCustomers(response.data.customers);
    } catch (error) {
      setMessage('Unable to load customers');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addCustomer = async e => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/customers/add',
        { name, email, phone, address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Customer added successfully!');

      setName('');
      setEmail('');
      setPhone('');
      setAddress('');

      fetchCustomers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Customer adding failed');
    }
  };

  const filteredCustomers = customers.filter(
    customer =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search)
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Customer Management</h1>

      <form onSubmit={addCustomer} style={styles.form}>
        <h3>Add New Customer</h3>

        <input
          placeholder="Customer Name"
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
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          style={styles.input}
        />

        <input
          placeholder="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Add Customer
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>

      <h2>All Customers ({filteredCustomers.length})</h2>

      <input
        type="text"
        placeholder="Search by name, email or phone..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={styles.search}
      />

      <div style={styles.grid}>
        {filteredCustomers.map(customer => (
          <div key={customer._id} style={styles.card}>
            <h3>{customer.name}</h3>

            <p>Email: {customer.email}</p>
            <p>Phone: {customer.phone}</p>
            <p>Address: {customer.address || 'N/A'}</p>
          </div>
        ))}

        {filteredCustomers.length === 0 && <p>No customers found.</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 'clamp(15px, 4vw, 30px)',
    minHeight: '100vh',
    background: '#f1f5f9',
    fontFamily: 'Arial',
    width: '100%',
    boxSizing: 'border-box',
  },

  heading: {
    fontSize: 'clamp(22px, 4vw, 32px)',
    marginBottom: '25px',
  },

  form: {
    background: 'white',
    padding: 'clamp(15px, 3vw, 25px)',
    width: '100%',
    maxWidth: '450px',
    borderRadius: '10px',
    marginBottom: '30px',
    boxSizing: 'border-box',
  },

  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
  },

  button: {
    padding: '12px 20px',
    width: '100%',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },

  message: {
    color: 'green',
    marginTop: '12px',
  },

  search: {
    width: '100%',
    maxWidth: '450px',
    padding: '12px',
    marginBottom: '20px',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
    gap: '20px',
  },

  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflowWrap: 'anywhere',
  },
};

export default Customers;
