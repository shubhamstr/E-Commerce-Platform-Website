import React from 'react';
import { Container, Row, Col } from 'reactstrap';
// import styles from './page.module.css';
import BreadcrumbCompo from '../components/BreadcrumbCompo';
import AddressList from '../components/AddressList';

const page = () => {
  return (
    <Container fluid>
      <Row xs="1">
        <Col>
          <BreadcrumbCompo activeScreenName="Addresses" previousScreenLink="" previousScreenName="" />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <AddressList />
        </Col>
      </Row>
    </Container>
  );
};

export default page;
