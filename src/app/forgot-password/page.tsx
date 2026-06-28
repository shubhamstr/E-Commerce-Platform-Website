"use client"
import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import BreadcrumbCompo from '../components/BreadcrumbCompo';
import { forgotPassword } from '../../services/authService';
import { showSuccess, showError } from '../../utils/toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      const { success, message } = res.data;
      if (success) {
        showSuccess(message || 'Password reset link sent to your email.');
        setEmail('');
      } else {
        showError(message || 'Failed to send password reset link.');
      }
    } catch (error: any) {
      console.error(error);
      showError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row xs="1">
        <Col>
          <BreadcrumbCompo activeScreenName="Forgot Password" previousScreenLink="" previousScreenName="" />
        </Col>
      </Row>
      <Container fluid="sm" className="mt-5">
        <Row>
          <Col xs="12" sm={{ offset: 4, size: 4 }}>
            <div className="p-5 border border-secondary shadow rounded mb-5 bg-white">
              <h3 className="text-center mb-4">Forgot Password</h3>
              <p className="text-muted text-center mb-4" style={{ fontSize: '14px' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="email">Email Address</Label>
                  <Input
                    id="email"
                    value={email}
                    name="email"
                    placeholder="abc@example.com"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup className="text-center mt-4">
                  <Button color="primary" type="submit" disabled={loading} className="w-100">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </FormGroup>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default ForgotPasswordPage;
