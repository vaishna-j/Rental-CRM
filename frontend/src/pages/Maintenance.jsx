import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Maintenance() {
  const [maintenance, setMaintenance] = useState([]);
  const [products, setProducts] = useState([]);

  const [product, setProduct] = useState('');
  const [issue, setIssue] = useState('');
  const [maintenanceDate, setMaintenanceDate] = useState('');
  const [cost, setCost] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const maintenanceResponse = await axios.get(
        'http://localhost:5000/api/maintenance/',
        { headers }
      );

      const productResponse = await axios.get(
        'http://localhost:5000/api/products/'
      );

      setMaintenance(maintenanceResponse.data.maintenance);
      setProducts(productResponse.data.products);
    } catch (error) {
      setMessage('Unable to load maintenance details');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addMaintenance = async e => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:5000/api/maintenance/add',
        {
          product,
          issue,
          maintenanceDate,
          cost: Number(cost),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Maintenance added successfully!');

      setProduct('');
      setIssue('');
      setMaintenanceDate('');
      setCost('');

      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Maintenance adding failed');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/maintenance/update/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Maintenance status updated!');
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Status update failed');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Maintenance Management</h1>

      <form onSubmit={addMaintenance} style={styles.form}>
        <h3>Add Maintenance Record</h3>

        <label>Select Product</label>
        <select
          value={product}
          onChange={e => setProduct(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Select Product</option>

          {products.map(item => (
            <option key={item._id} value={item._id}>
              {item.name} - {item.serialNumber}
            </option>
          ))}
        </select>

        <input
          placeholder="Issue Description"
          value={issue}
          onChange={e => setIssue(e.target.value)}
          required
          style={styles.input}
        />

        <label>Maintenance Date</label>
        <input
          type="date"
          value={maintenanceDate}
          onChange={e => setMaintenanceDate(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="number"
          min="0"
          placeholder="Maintenance Cost"
          value={cost}
          onChange={e => setCost(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Add Maintenance
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>

      <h2>All Maintenance Records ({maintenance.length})</h2>

      <div style={styles.grid}>
        {maintenance.map(item => (
          <div key={item._id} style={styles.card}>
            <h3>{item.product?.name || 'Product'}</h3>

            <p style={styles.detail}>Issue: {item.issue}</p>
            <p style={styles.detail}>
              Date: {new Date(item.maintenanceDate).toLocaleDateString()}
            </p>
            <p>Cost: ₹{item.cost}</p>
            <p>Status: {item.status}</p>

            <label>Update Status</label>

            <select
              value={item.status}
              onChange={e => updateStatus(item._id, e.target.value)}
              style={styles.input}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        ))}

        {maintenance.length === 0 && <p>No maintenance records found</p>}
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
    margin: '8px 0 15px',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
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

export default Maintenance;
