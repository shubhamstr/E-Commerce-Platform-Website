"use client"
import React, { useState, Suspense } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useSearchParams, useRouter } from 'next/navigation';
import BreadcrumbCompo from '../components/BreadcrumbCompo';
import { resetPassword } from '../../services/authService';
import { showSuccess, showError } from '../../utils/toast';

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !token) {
      showError('Invalid reset password link. Missing email or token.');
      return;
    }

    if (!password) {
      showError('Please enter a new password.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({
        email,
        token,
        password,
      });
      const { success, message } = res.data;
      if (success) {
        showSuccess(message || 'Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        showError(message || 'Failed to reset password.');
      }
    } catch (error: any) {
      console.error(error);
      showError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 border border-secondary shadow rounded mb-5 bg-white">
      <h3 className="text-center mb-4">Reset Password</h3>
      <p className="text-muted text-center mb-4" style={{ fontSize: '14px' }}>
        Please enter your new password below.
      </p>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="password">New Password</Label>
          <Input
            id="password"
            value={password}
            name="password"
            placeholder="Enter new password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            value={confirmPassword}
            name="confirmPassword"
            placeholder="Confirm new password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup className="text-center mt-4">
          <Button color="primary" type="submit" disabled={loading} className="w-100">
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </FormGroup>
      </Form>
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <Container fluid>
      <Row xs="1">
        <Col>
          <BreadcrumbCompo activeScreenName="Reset Password" previousScreenLink="" previousScreenName="" />
        </Col>
      </Row>
      <Container fluid="sm" className="mt-5">
        <Row>
          <Col xs="12" sm={{ offset: 4, size: 4 }}>
            <Suspense fallback={<div className="text-center">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default ResetPasswordPage;
