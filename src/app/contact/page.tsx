// import Image from 'next/image';
import { Col, Container, Row } from 'reactstrap';
import styles from './page.module.css';
import BreadcrumbCompo from '../components/BreadcrumbCompo';
import ContactSection from '../components/ContactSection';

const page = () => {
  return (
    <Container fluid>
      <Row xs="1" className={styles.headerSection}>
        <div className={styles.overlay} />
        <Col className={`d-flex flex-column justify-content-center align-items-center text-white text-center ${styles.contentContainer}`}>
          <h1 className={`display-4 fw-bold text-uppercase ${styles.textShadow}`}>Contact Us</h1>
          <p className={`lead fw-medium ${styles.textShadow}`}>We are here to help and answer any questions you might have</p>
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <BreadcrumbCompo activeScreenName="Contact" previousScreenLink="" previousScreenName="" />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <Container fluid="sm">
            <h3>Get in Touch</h3>
          </Container>
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <ContactSection />
        </Col>
      </Row>
    </Container>
  );
};

export default page;
