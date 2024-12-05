import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    middleName: '',
    contactNo: '',
    role: 'user', // Default role
  });
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);

  const handleOnChange = (event) => {
    setIsFieldsDirty(true);
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    const { email, password, firstName, lastName, contactNo } = formData;

    if (email && password && firstName && lastName && contactNo) {
      setStatus('loading');
      try {
        await axios.post('/admin/register', formData, {
          headers: { 'Content-Type': 'application/json' },
        });

        setStatus('success');
        alert('User registered successfully');

        // Automatically log in the user after registration
        setTimeout(async () => {
          try {
            const res = await axios.post('/admin/login', { email, password }, {
              headers: { 'Access-Control-Allow-Origin': '*' },
            });
            localStorage.setItem('accessToken', res.data.access_token);
            navigate('/main/movies');
          } catch (error) {
            console.error(error);
          } finally {
            setStatus('idle');
          }
        }, 2000);
      } catch (error) {
        console.error(error);
        setStatus('error');
        alert('Failed to register');
      }
    } else {
      setIsFieldsDirty(true);
      alert('All required fields must be filled out.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRegister();
    }
  };

  return (
    <div className="Register" onKeyDown={handleKeyDown}>
      <div className="main-container">
        <h3>Sign Up</h3>
        <form>
          <div className="form-containerg">
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Middle Name:</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleOnChange}
              />
            </div>
            <div className="form-group">
              <label>Contact No:</label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="submit-container">
              <button
                className="btn-register"
                type="button"
                onClick={handleRegister}
                disabled={status === 'loading'}
              >
                {status === 'idle' ? 'Register' : 'Loading...'}
              </button>
            </div>
            <div className="reg-container">
              <small>Already have an account? </small>
              <a href="/">
                <small>Log In</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
