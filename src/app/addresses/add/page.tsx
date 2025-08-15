import React from 'react';
import { Container, Row, Col } from 'reactstrap';
// import styles from './page.module.css';
import BreadcrumbCompo from '../../components/BreadcrumbCompo';
import AddressAdd from '../../components/AddressAdd';

const page = () => {
  return (
    <Container fluid>
      <Row xs="1">
        <Col>
          <BreadcrumbCompo activeScreenName="Add Address" previousScreenLink="/addresses" previousScreenName="Addresses" />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <AddressAdd />
        </Col>
      </Row>
    </Container>
  );
};

export default page;
