/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Container, Row, Col } from 'reactstrap';
// import styles from './page.module.css';
import BreadcrumbCompo from '../../components/BreadcrumbCompo';
import AddressAdd from '../../components/AddressAdd';

const page = async ({ params }: any) => {
  const { slug } = await params
  return (
    <Container fluid>
      <Row xs="1">
        <Col>
          <BreadcrumbCompo activeScreenName={`${slug ? "Edit" : "Add"} Address`} previousScreenLink="/addresses" previousScreenName="Addresses" />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <AddressAdd adId={slug} />
        </Col>
      </Row>
    </Container>
  );
};

export default page;
