import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Payments() {
  const [payments, setPayments] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState({
    rental: '',
    customer: '',
    amount: '',
    paymentType: 'Rental',
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    transactionId: '',
  });

  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadData = async () => {
    try {
      const [paymentRes, rentalRes, customerRes] = await Promise.all([
        axios.get('http://localhost:5000/api/payments/', { headers }),
        axios.get('http://localhost:5000/api/rentals/', { headers }),
        axios.get('http://localhost:5000/api/customers/', { headers }),
      ]);

      setPayments(paymentRes.data.payments || []);
      setRentals(rentalRes.data.rentals || []);
      setCustomers(customerRes.data.customers || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRentalChange = e => {
    const selectedRental = rentals.find(
      rental => rental._id === e.target.value
    );

    setForm({
      ...form,
      rental: e.target.value,
      customer: selectedRental?.customer?._id || '',
      amount: selectedRental?.rentalRate || '',
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/payments/add', form, {
        headers,
      });

      alert('Payment added successfully!');

      setForm({
        rental: '',
        customer: '',
        amount: '',
        paymentType: 'Rental',
        paymentMethod: 'Cash',
        paymentStatus: 'Paid',
        transactionId: '',
      });

      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Payment failed');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Payment Management</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Add Payment</h2>

        <label>Select Rental</label>
        <select
          value={form.rental}
          onChange={handleRentalChange}
          required
          style={styles.input}
        >
          <option value="">Select Rental</option>
          {rentals.map(rental => (
            <option key={rental._id} value={rental._id}>
              {rental.product?.name || 'Product'} - {rental._id}
            </option>
          ))}
        </select>

        <label>Select Customer</label>
        <select
          value={form.customer}
          onChange={e =>
            setForm({
              ...form,
              customer: e.target.value,
            })
          }
          required
          style={styles.input}
        >
          <option value="">Select Customer</option>
          {customers.map(customer => (
            <option key={customer._id} value={customer._id}>
              {customer.name}
            </option>
          ))}
        </select>

        <label>Amount (₹)</label>
        <input
          type="number"
          min="1"
          placeholder="Enter Amount"
          value={form.amount}
          onChange={e =>
            setForm({
              ...form,
              amount: e.target.value,
            })
          }
          required
          style={styles.input}
        />

        <label>Payment Type</label>
        <select
          value={form.paymentType}
          onChange={e =>
            setForm({
              ...form,
              paymentType: e.target.value,
            })
          }
          style={styles.input}
        >
          <option value="Rental">Rental</option>
          <option value="Security Deposit">Security Deposit</option>
          <option value="Late Fee">Late Fee</option>
          <option value="Damage Fee">Damage Fee</option>
        </select>

        <label>Payment Method</label>
        <select
          value={form.paymentMethod}
          onChange={e =>
            setForm({
              ...form,
              paymentMethod: e.target.value,
            })
          }
          style={styles.input}
        >
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>

        <label>Payment Status</label>
        <select
          value={form.paymentStatus}
          onChange={e =>
            setForm({
              ...form,
              paymentStatus: e.target.value,
            })
          }
          style={styles.input}
        >
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        <label>Transaction ID</label>
        <input
          type="text"
          placeholder="Enter Transaction ID"
          value={form.transactionId}
          onChange={e =>
            setForm({
              ...form,
              transactionId: e.target.value,
            })
          }
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Add Payment
        </button>
      </form>

      <h2>Payment History</h2>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.cell}>Customer</th>
              <th style={styles.cell}>Amount</th>
              <th style={styles.cell}>Type</th>
              <th style={styles.cell}>Method</th>
              <th style={styles.cell}>Status</th>
              <th style={styles.cell}>Transaction ID</th>
            </tr>
          </thead>

          <tbody>
            {payments.map(payment => (
              <tr key={payment._id}>
                <td style={styles.cell}>{payment.customer?.name || 'N/A'}</td>
                <td style={styles.cell}>₹{payment.amount}</td>
                <td style={styles.cell}>{payment.paymentType}</td>
                <td style={styles.cell}>{payment.paymentMethod}</td>
                <td style={styles.cell}>{payment.paymentStatus}</td>
                <td style={styles.cell}>{payment.transactionId || '-'}</td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td colSpan="6" style={styles.cell}>
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
    width: '100%',
    maxWidth: '500px',
    background: 'white',
    padding: 'clamp(15px, 4vw, 25px)',
    borderRadius: '10px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    boxSizing: 'border-box',
  },
  input: {
    width: '100%',
    maxWidth: '100%',
    padding: '11px',
    margin: '8px 0 18px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    boxSizing: 'border-box',
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
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
    background: 'white',
    borderRadius: '10px',
    padding: '10px',
    boxSizing: 'border-box',
  },
  table: {
    width: '100%',
    minWidth: '650px',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  cell: {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
  },
};

export default Payments;
