import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  CalendarDays,
  CreditCard,
  LogOut,
} from 'lucide-react';

function StaffDashboard() {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/staff-dashboard' },
    { name: 'Products', icon: Package, path: '/products' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Rentals', icon: CalendarDays, path: '/rentals' },
    { name: 'Payments', icon: CreditCard, path: '/payments' },
  ];

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2>Rental CRM</h2>
        <p>Staff Portal</p>

        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              style={styles.menuItem}
              onClick={() => navigate(item.path)}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </div>
          );
        })}

        <button onClick={logout} style={styles.logout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main style={styles.main}>
        <h1>Staff Dashboard</h1>
        <p>Welcome to Rental CRM Front Desk Portal!</p>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Customer Management</h3>
            <p>Register and manage customers.</p>
            <button onClick={() => navigate('/customers')}>
              View Customers
            </button>
          </div>

          <div style={styles.card}>
            <h3>Product Availability</h3>
            <p>Check available rental products.</p>
            <button onClick={() => navigate('/products')}>View Products</button>
          </div>

          <div style={styles.card}>
            <h3>Rental Management</h3>
            <p>Create and process rental bookings.</p>
            <button onClick={() => navigate('/rentals')}>Manage Rentals</button>
          </div>

          <div style={styles.card}>
            <h3>Payment Management</h3>
            <p>Record customer payments and view history.</p>
            <button onClick={() => navigate('/payments')}>
              Manage Payments
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f1f5f9',
    fontFamily: 'Arial',
  },
  sidebar: {
    width: '230px',
    background: '#172554',
    color: 'white',
    padding: '25px 15px',
    boxSizing: 'border-box',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '13px 10px',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    padding: '30px',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginTop: '30px',
  },
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  logout: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '30px',
    padding: '12px',
    background: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default StaffDashboard;
