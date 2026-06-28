'use client';
import React, { useState } from 'react';
import { Form, Row, Col, FormGroup, Label, Input, Button, Card, CardBody, CardSubtitle, CardText, Container, Spinner, Alert } from 'reactstrap';
import api from '../../utils/api';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [alertState, setAlertState] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertState(null);

    if (!formData.firstName.trim() || !formData.email.trim()) {
      setAlertState({ type: 'danger', message: 'First name and email are required.' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/contact/create', formData);
      const { success, message } = res.data;
      if (success) {
        setAlertState({ type: 'success', message });
        setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
      } else {
        setAlertState({ type: 'danger', message: message || 'Failed to send message.' });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'An error occurred. Please try again.';
      setAlertState({ type: 'danger', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid="sm">
      <Row xs="1" sm="2">
        <Col xs="12" sm="6" md="7">
          <Form className="border p-5" onSubmit={handleSubmit}>
            {alertState && (
              <Alert color={alertState.type} toggle={() => setAlertState(null)}>
                {alertState.message}
              </Alert>
            )}
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="message">Message</Label>
              <Input
                id="message"
                name="message"
                type="textarea"
                rows={5}
                value={formData.message}
                onChange={handleChange}
              />
            </FormGroup>
            <Button color="success" className="text-uppercase w-100" type="submit" disabled={loading}>
              {loading ? <><Spinner size="sm" className="me-2" />Sending...</> : 'Send Message'}
            </Button>
          </Form>
        </Col>
        <Col xs="12" sm="6" md="5">
          <Card className="w-100 border-0 shadow-sm">
            <CardBody>
              <CardSubtitle className="mb-2 fw-bold text-dark" tag="h6">
                🎧 Customer Support
              </CardSubtitle>
              <CardText className="text-muted small">
                Our support team is here to help with orders, returns, product questions, and more. Reach out anytime!
              </CardText>
            </CardBody>
          </Card>
          <Card className="w-100 mt-3 border-0 shadow-sm">
            <CardBody>
              <CardSubtitle className="mb-2 fw-bold text-dark" tag="h6">
                🕐 Business Hours
              </CardSubtitle>
              <CardText className="text-muted small mb-1">Monday – Friday: 9:00 AM – 6:00 PM (PST)</CardText>
              <CardText className="text-muted small mb-1">Saturday: 10:00 AM – 4:00 PM (PST)</CardText>
              <CardText className="text-muted small">Sunday: Closed</CardText>
            </CardBody>
          </Card>
          <Card className="w-100 mt-3 border-0 shadow-sm">
            <CardBody>
              <CardSubtitle className="mb-2 fw-bold text-dark" tag="h6">
                ⚡ Quick Response
              </CardSubtitle>
              <CardText className="text-muted small">
                We typically respond within 24 hours on business days. For urgent inquiries, call us at <strong>+1 (800) 123-4567</strong>.
              </CardText>
            </CardBody>
          </Card>
          <Card className="w-100 mt-3 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardBody>
              <CardSubtitle className="mb-2 fw-bold text-white" tag="h6">
                📧 Email Us Directly
              </CardSubtitle>
              <CardText className="text-white small" style={{ opacity: 0.9 }}>
                support@shopnest.com
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactSection;
