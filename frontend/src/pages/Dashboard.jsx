import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  CalendarDays,
  UserCog,
  Truck,
  Wrench,
  FileText,
  CreditCard,
  LogOut,
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    activeRentals: 0,
    totalIncome: 0,
  });

  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [productRes, customerRes, rentalRes, reportRes] =
          await Promise.all([
            axios.get('http://localhost:5000/api/products/'),
            axios.get('http://localhost:5000/api/customers/', { headers }),
            axios.get('http://localhost:5000/api/rentals/', { headers }),
            axios.get('http://localhost:5000/api/reports/', { headers }),
          ]);

        setStats({
          products: productRes.data.products?.length || 0,
          customers: customerRes.data.customers?.length || 0,
          activeRentals: reportRes.data.activeRentals || 0,
          totalIncome: reportRes.data.totalIncome || 0,
        });
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    fetchDashboard();
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Products', icon: Package, path: '/products' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Rentals', icon: CalendarDays, path: '/rentals' },
    { name: 'Payments', icon: CreditCard, path: '/payments' },
    { name: 'Staff', icon: UserCog, path: '/staff' },
    { name: 'Suppliers', icon: Truck, path: '/suppliers' },
    { name: 'Maintenance', icon: Wrench, path: '/maintenance' },
    { name: 'Reports', icon: FileText, path: '/reports' },
  ];

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <h2>Rental CRM</h2>
        <p style={{ color: '#0f59b4' }}>Admin Portal</p>

        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="dashboard-menu-item"
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

      <main className="app-main">
        <h1 style={styles.heading}>Admin Dashboard</h1>
        <p>Welcome to Rental CRM Admin Portal!</p>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Total Products</h3>
            <h2>{stats.products}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Total Customers</h3>
            <h2>{stats.customers}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Active Rentals</h3>
            <h2>{stats.activeRentals}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Total Income</h3>
            <h2>₹{stats.totalIncome}</h2>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  heading: {
    fontSize: 'clamp(22px, 4vw, 30px)',
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
    width: '100%',
  },
};

export default Dashboard;
