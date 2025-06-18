import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignUpForm } from '../components/auth/SignUpForm';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.scss';

export const SignUp: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className={styles.container}>
      <SignUpForm />
      <p className={styles.switch}>
        Already have an account?{' '}
        <Link to="/signin" className={styles.link}>
          Sign In
        </Link>
      </p>
    </div>
  );
}; 