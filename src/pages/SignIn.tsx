import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SignInForm } from '../components/auth/SignInForm';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.scss';

export const SignIn: React.FC = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return (
    <div className={styles.container}>
      <SignInForm />
      <p className={styles.switch}>
        Don't have an account?{' '}
        <Link to="/signup" className={styles.link}>
          Sign Up
        </Link>
      </p>
    </div>
  );
}; 