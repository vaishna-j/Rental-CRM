import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [rentalRate, setRentalRate] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const [filterStatus, setFilterStatus] = useState('All');

  // Get all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/');

      setProducts(response.data.products);
    } catch (error) {
      setMessage('Unable to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const addProduct = async e => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/products/add',
        {
          name,
          category,
          serialNumber,
          rentalRate: Number(rentalRate),
          securityDeposit: Number(securityDeposit),
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Product added successfully!');

      setName('');
      setCategory('');
      setSerialNumber('');
      setRentalRate('');
      setSecurityDeposit('');
      setDescription('');

      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Product adding failed');
    }
  };

  // Filter products by availability
  const filteredProducts = products.filter(product => {
    if (filterStatus === 'All') {
      return true;
    }

    return product.status === filterStatus;
  });

  return (
    <div style={pageStyle}>
      <h1>Product Management</h1>

      {/* Add Product Form */}
      <form onSubmit={addProduct} style={formStyle}>
        <h3>Add New Product</h3>

        <input
          placeholder="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          placeholder="Serial Number"
          value={serialNumber}
          onChange={e => setSerialNumber(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Rental Rate"
          value={rentalRate}
          onChange={e => setRentalRate(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Security Deposit"
          value={securityDeposit}
          onChange={e => setSecurityDeposit(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Add Product
        </button>

        {message && <p>{message}</p>}
      </form>

      {/* Product List */}
      <h2>All Products ({filteredProducts.length})</h2>

      {/* Availability Filter */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Filter by Availability:</label>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={selectStyle}
        >
          <option value="All">All Products</option>
          <option value="Available">Available</option>
          <option value="Rented">Rented</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>

      {/* Products Grid */}
      <div style={gridStyle}>
        {filteredProducts.map(product => (
          <div key={product._id} style={cardStyle}>
            <h3>{product.name}</h3>

            <p>Category: {product.category}</p>

            <p>Serial: {product.serialNumber}</p>

            <p>Rental Rate: ₹{product.rentalRate}</p>

            <p>Deposit: ₹{product.securityDeposit}</p>

            <p>
              Status: <strong>{product.status}</strong>
            </p>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <p>No products found for this status.</p>
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  padding: '30px',
  fontFamily: 'Arial',
  background: '#f1f5f9',
  minHeight: '100vh',
};

const formStyle = {
  background: 'white',
  padding: '20px',
  maxWidth: '450px',
  borderRadius: '10px',
  marginBottom: '30px',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '12px',
  boxSizing: 'border-box',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
};

const buttonStyle = {
  padding: '12px 20px',
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const selectStyle = {
  padding: '10px',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '20px',
};

const cardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};

export default Products;
