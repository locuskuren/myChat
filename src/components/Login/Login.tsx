import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { authVar } from '../../graphql';
import { Link } from 'react-router-dom';
import { LOGIN } from '../../graphql';
import { AuthUser } from '../../graphql';
import LoadingDots from '../LoadingDots/LoadingDots';

interface Response {
  login: AuthUser;
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error, data }] = useMutation<Response>(LOGIN);

  useEffect(() => {
    error && alert(error.message);
  }, [error]);

  useEffect(() => {
    if (data) {
      window.localStorage.setItem('user', JSON.stringify(data.login));
      authVar(data.login);
      window.location.reload(); //this func is here to reestablish connection with websocket
    }
  }, [data]);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    login({
      variables: {
        username: username.toLocaleLowerCase(),
        password,
      },
    });
  };

  const validate = username !== '' && password !== '';

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="title">Log In</div>
      <input
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading || !validate}>
        Log In
      </button>
      {loading && <LoadingDots />}
      <Link to="/register">
        <div className="link">Don't have an account?</div>
      </Link>
    </form>
  );
};

export default Login;
