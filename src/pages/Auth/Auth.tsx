import Login from '../../components/Login/Login';
import Register from '../../components/Register/Register';

import './Auth.scss';

const Auth = () => {
  const pathname = window.location.pathname;

  return (
    <div className="auth">
      <div className="image-container">myChat</div>
      {pathname === '/' && <Login />}
      {pathname === '/register' && <Register />}
    </div>
  );
};

export default Auth;
