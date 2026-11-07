import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customer, setCustomer] = useState('');
  const [product, setProduct] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [rentalRate, setRentalRate] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [message, setMessage] = useState('');

  const [selectedRental, setSelectedRental] = useState(null);
  const [returnCondition, setReturnCondition] = useState('Good');
  const [damageDescription, setDamageDescription] = useState('');
  const [damageCost, setDamageCost] = useState('');

  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch Data
  const fetchData = async () => {
    try {
      const rentalResponse = await axios.get(
        'http://localhost:5000/api/rentals/',
        { headers }
      );

      const customerResponse = await axios.get(
        'http://localhost:5000/api/customers/',
        { headers }
      );

      const productResponse = await axios.get(
        'http://localhost:5000/api/products/'
      );

      setRentals(rentalResponse.data.rentals);
      setCustomers(customerResponse.data.customers);
      setProducts(productResponse.data.products);
    } catch (error) {
      setMessage('Unable to load rental details');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create Rental
  const addRental = async e => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:5000/api/rentals/create',
        {
          customer,
          product,
          startDate,
          dueDate,
          rentalRate: Number(rentalRate),
          securityDeposit: Number(securityDeposit),
        },
        { headers }
      );

      setMessage('Rental created successfully!');

      setCustomer('');
      setProduct('');
      setStartDate('');
      setDueDate('');
      setRentalRate('');
      setSecurityDeposit('');

      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Rental creation failed');
    }
  };

  // Dispatch Rental
  const dispatchRental = async id => {
    try {
      await axios.put(
        `http://localhost:5000/api/rentals/dispatch/${id}`,
        {},
        { headers }
      );

      setMessage('Rental dispatched successfully!');
      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Dispatch failed');
    }
  };

  // Open Damage Inspection
  const openReturnForm = item => {
    setSelectedRental(item);
    setReturnCondition('Good');
    setDamageDescription('');
    setDamageCost('');
    setMessage('');
  };

  // Return Rental
  const returnRental = async e => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/rentals/return/${selectedRental._id}`,
        {
          returnCondition,
          damageDescription,
          damageCost: Number(damageCost) || 0,
        },
        { headers }
      );

      setMessage('Rental returned successfully!');
      setSelectedRental(null);

      fetchData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Return failed');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Rental Management</h1>

      {message && <p style={styles.message}>{message}</p>}

      {/* Create Rental */}
      <form onSubmit={addRental} style={styles.form}>
        <h3>Create New Rental</h3>

        <label>Customer</label>
        <select
          value={customer}
          onChange={e => setCustomer(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Select Customer</option>

          {customers.map(item => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>

        <label>Product</label>
        <select
          value={product}
          onChange={e => {
            const selected = products.find(item => item._id === e.target.value);

            setProduct(e.target.value);
            setRentalRate(selected?.rentalRate || '');
            setSecurityDeposit(selected?.securityDeposit || '');
          }}
          required
          style={styles.input}
        >
          <option value="">Select Product</option>

          {products
            .filter(item => item.status === 'Available')
            .map(item => (
              <option key={item._id} value={item._id}>
                {item.name} - {item.serialNumber}
              </option>
            ))}
        </select>

        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
          style={styles.input}
        />

        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          required
          style={styles.input}
        />

        <label>Rental Rate (₹)</label>
        <input type="number" value={rentalRate} readOnly style={styles.input} />

        <label>Security Deposit (₹)</label>
        <input
          type="number"
          value={securityDeposit}
          readOnly
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Create Rental
        </button>
      </form>

      {/* Damage Inspection */}
      {selectedRental && (
        <form onSubmit={returnRental} style={styles.form}>
          <h2>Damage Inspection</h2>

          <p>
            Product: <b>{selectedRental.product?.name}</b>
          </p>

          <label>Return Condition</label>
          <select
            value={returnCondition}
            onChange={e => setReturnCondition(e.target.value)}
            style={styles.input}
          >
            <option value="Good">Good</option>
            <option value="Damaged">Damaged</option>
          </select>

          {returnCondition === 'Damaged' && (
            <>
              <label>Damage Description</label>

              <textarea
                value={damageDescription}
                onChange={e => setDamageDescription(e.target.value)}
                placeholder="Enter damage details"
                required
                style={{
                  ...styles.input,
                  minHeight: '90px',
                  resize: 'vertical',
                }}
              />

              <label>Damage / Repair Cost (₹)</label>

              <input
                type="number"
                min="0"
                value={damageCost}
                onChange={e => setDamageCost(e.target.value)}
                required
                style={styles.input}
              />
            </>
          )}

          <button type="submit" style={styles.button}>
            Confirm Return
          </button>

          <button
            type="button"
            onClick={() => setSelectedRental(null)}
            style={{
              ...styles.button,
              background: '#64748b',
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {/* All Rentals */}
      <h2>All Rentals ({rentals.length})</h2>

      <div style={styles.grid}>
        {rentals.map(item => (
          <div key={item._id} style={styles.card}>
            <h3>{item.product?.name}</h3>

            <p>Customer: {item.customer?.name}</p>

            <p>Start Date: {new Date(item.startDate).toLocaleDateString()}</p>

            <p>Due Date: {new Date(item.dueDate).toLocaleDateString()}</p>

            <p>Rental Rate: ₹{item.rentalRate}</p>
            <p>Deposit: ₹{item.securityDeposit}</p>

            <p>
              Status: <b>{item.status}</b>
            </p>

            <p>Late Fee: ₹{item.lateFee}</p>

            {item.status === 'Reserved' && (
              <button
                onClick={() => dispatchRental(item._id)}
                style={styles.button}
              >
                Dispatch Rental
              </button>
            )}

            {item.status === 'Dispatched' && (
              <button
                onClick={() => openReturnForm(item)}
                style={styles.button}
              >
                Return Product
              </button>
            )}

            {item.status === 'Returned' && (
              <>
                <p>Return Condition: {item.returnCondition}</p>
                <p>Damage Description: {item.damageDescription || 'None'}</p>
                <p>Damage Cost: ₹{item.damageCost}</p>
              </>
            )}
          </div>
        ))}

        {rentals.length === 0 && <p>No rentals found.</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 'clamp(15px, 4vw, 30px)',
    background: '#f1f5f9',
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'Arial',
  },

  heading: {
    fontSize: 'clamp(23px, 4vw, 32px)',
  },

  message: {
    color: 'green',
    fontWeight: 'bold',
    overflowWrap: 'anywhere',
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
    margin: '8px 0 15px',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '15px',
    maxWidth: '100%',
  },

  button: {
    padding: '12px 20px',
    width: '100%',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '10px',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
    gap: '20px',
  },

  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflowWrap: 'anywhere',
    minWidth: 0,
  },
};

export default Rentals;
