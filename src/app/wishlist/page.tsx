import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import styles from './page.module.css';
import BreadcrumbCompo from '../components/BreadcrumbCompo';
import FavoriteProducts from '../components/FavoriteProducts';

const page = () => {
  return (
    <Container fluid>
      <Row xs="1" className={styles.headerSection}>
        <div className={styles.overlay} />
        <Col className={`d-flex flex-column justify-content-center align-items-center text-white text-center ${styles.contentContainer}`}>
          <h1 className={`display-4 fw-bold text-uppercase ${styles.textShadow}`}>Your Wishlist</h1>
          <p className={`lead fw-medium ${styles.textShadow}`}>Save the items you love and keep track of your shopping list</p>
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <BreadcrumbCompo activeScreenName="Wishlist" previousScreenLink="" previousScreenName="" />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <FavoriteProducts />
        </Col>
      </Row>
    </Container>
  );
};

export default page;
