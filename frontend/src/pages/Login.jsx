// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const navigate = useNavigate();

//   const handleLogin = async e => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/users/login',
//         {
//           email,
//           password,
//         }
//       );

//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));

//       if (response.data.user.role === 'admin') {
//         navigate('/dashboard');
//       } else {
//         navigate('/staff-dashboard');
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         background: '#adb7c2',
//       }}
//     >
//       <form
//         onSubmit={handleLogin}
//         style={{
//           width: '350px',
//           padding: '35px',
//           background: 'white',
//           borderRadius: '12px',
//           boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
//         }}
//       >
//         <h2 style={{ textAlign: 'center' }}>Rental CRM</h2>

//         <p style={{ textAlign: 'center', color: '#2222a1' }}>
//           Login to your account
//         </p>

//         {message && <p style={{ color: 'red' }}>{message}</p>}

//         <label>Email</label>

//         <input
//           type="email"
//           placeholder="Enter email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           required
//           style={inputStyle}
//         />

//         <label>Password</label>

//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           required
//           style={inputStyle}
//         />

//         <button type="submit" style={buttonStyle}>
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }

// const inputStyle = {
//   width: '100%',
//   padding: '12px',
//   margin: '8px 0 18px',
//   border: '1px solid #cbd5e1',
//   borderRadius: '6px',
//   boxSizing: 'border-box',
// };

// const buttonStyle = {
//   width: '100%',
//   padding: '12px',
//   background: '#2563eb',
//   color: 'white',
//   border: 'none',
//   borderRadius: '6px',
//   cursor: 'pointer',
// };

// export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Package, LockKeyhole, Mail, ArrowRight } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (response.data.user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/staff-dashboard');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <Package size={30} color="white" />
          </div>

          <h1 style={styles.title}>Rental CRM</h1>
          <p style={styles.subtitle}>Equipment Rental Management System</p>
        </div>

        <div style={styles.welcome}>
          <h2>Welcome Back!</h2>
          <p>Login to access your account</p>
        </div>

        <form onSubmit={handleLogin}>
          <label style={styles.label}>Email Address</label>

          <div style={styles.inputBox}>
            <Mail size={19} color="#7c3aed" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <label style={styles.label}>Password</label>

          <div style={styles.inputBox}>
            <LockKeyhole size={19} color="#7c3aed" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {message && <p style={styles.error}>{message}</p>}

          <button type="submit" style={styles.button}>
            Login to Dashboard
            <ArrowRight size={19} />
          </button>
        </form>

        <div style={styles.footer}>© 2026 Rental CRM. All Rights Reserved.</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #172554, #312e81, #7c3aed)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },

  card: {
    width: '100%',
    maxWidth: '430px',
    background: '#ffffff',
    padding: '35px',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  },

  logo: {
    textAlign: 'center',
    marginBottom: '30px',
  },

  logoIcon: {
    width: '65px',
    height: '65px',
    background: 'linear-gradient(135deg, #172554, #7c3aed)',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
  },

  title: {
    color: '#172554',
    fontSize: '30px',
    margin: '10px 0',
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#64748b',
    fontSize: '13px',
  },

  welcome: {
    marginBottom: '25px',
  },

  label: {
    display: 'block',
    marginBottom: '8px',
    marginTop: '18px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#172554',
  },

  inputBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '9px',
    padding: '0 12px',
  },

  input: {
    width: '100%',
    border: 'none',
    outline: 'none',
    padding: '13px 0',
    fontSize: '14px',
    background: 'transparent',
  },

  button: {
    width: '100%',
    marginTop: '25px',
    padding: '14px',
    background: 'linear-gradient(135deg, #172554, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '9px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },

  error: {
    color: '#dc2626',
    fontSize: '13px',
    marginTop: '12px',
  },

  footer: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '11px',
    marginTop: '28px',
  },
};

export default Login;
