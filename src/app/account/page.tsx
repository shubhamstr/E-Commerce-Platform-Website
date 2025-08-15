import React from 'react';
import { Container, Row, Col } from 'reactstrap';
// import styles from './page.module.css';
import BreadcrumbCompo from '../components/BreadcrumbCompo';
import AccountForm from '../components/AccountForm'

const page = () => {
  return (
    <Container fluid>
      <Row xs="1">
        <Col>
          <BreadcrumbCompo activeScreenName="Account" previousScreenLink="" previousScreenName="" />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <AccountForm />
        </Col>
      </Row>
    </Container>
  );
};

export default page;
