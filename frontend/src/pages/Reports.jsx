import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Reports() {
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState('');

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:5000/api/reports/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReport(response.data);
      setMessage('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load reports');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Rental Reports</h1>

      {message && <p style={styles.message}>{message}</p>}

      {report && (
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Total Rentals</h3>
            <h2 style={styles.number}>{report.totalRentals}</h2>
          </div>

          <div style={styles.card}>
            <h3>Active Rentals</h3>
            <h2 style={styles.number}>{report.activeRentals}</h2>
          </div>

          <div style={styles.card}>
            <h3>Completed Rentals</h3>
            <h2 style={styles.number}>{report.completedRentals}</h2>
          </div>

          <div style={styles.card}>
            <h3>Total Revenue</h3>
            <h2 style={styles.number}>₹{report.totalRevenue}</h2>
          </div>

          <div style={styles.card}>
            <h3>Total Late Fee</h3>
            <h2 style={styles.number}>₹{report.totalLateFee}</h2>
          </div>

          <div style={styles.card}>
            <h3>Total Income</h3>
            <h2 style={styles.number}>₹{report.totalIncome}</h2>
          </div>
        </div>
      )}

      <button onClick={fetchReports} style={styles.button}>
        Refresh Reports
      </button>
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
  message: {
    color: '#dc2626',
    overflowWrap: 'anywhere',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
    gap: '20px',
    marginTop: '25px',
    width: '100%',
  },
  card: {
    background: 'white',
    padding: 'clamp(18px, 3vw, 25px)',
    borderRadius: '10px',
    minWidth: 0,
    overflowWrap: 'anywhere',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  number: {
    fontSize: 'clamp(22px, 4vw, 28px)',
    overflowWrap: 'anywhere',
  },
  button: {
    marginTop: '25px',
    width: '100%',
    maxWidth: '220px',
    padding: '12px 20px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default Reports;
