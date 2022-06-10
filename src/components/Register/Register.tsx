import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import validator from 'validator';
import { REGISTER } from '../../graphql';
import { Link, useNavigate } from 'react-router-dom';
import LoadingDots from '../LoadingDots/LoadingDots';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [register, { loading, error, data }] = useMutation(REGISTER);
  const navigate = useNavigate();

  useEffect(() => {
    error && alert(error.graphQLErrors[0].extensions.errors);
  }, [error]);

  useEffect(() => {
    data && navigate('/');
  }, [data, navigate]);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    register({
      variables: {
        username: username.toLocaleLowerCase(),
        email: email.toLocaleLowerCase(),
        password,
        confirmPassword,
      },
    });
  };

  const validate =
    username !== '' &&
    password !== '' &&
    confirmPassword !== '' &&
    confirmPassword === password &&
    validator.isEmail(email);

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="title">Sign Up</div>
      <input
        placeholder="username"
        type="text"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        placeholder="confirm password"
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading || !validate}>
        Sign Up
      </button>
      {loading && <LoadingDots />}
      <Link to="/">
        <div className="link">Have an account?</div>
      </Link>
    </form>
  );
};

export default Register;
