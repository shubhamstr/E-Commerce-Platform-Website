// import Image from 'next/image';
import { Col, Container, Row } from "reactstrap"
import LandingSection from "./components/LandingSection"
import PopularProducts from "./components/PopularProducts"
import MostRatedProducts from "./components/MostRatedProducts"
import Collections from "./components/Collections"
import styles from "./page.module.css"

export default function Home() {
  return (
    <Container fluid>
      <Row xs="1" className={styles.bgColor}>
        <Col>
          <LandingSection bgClass="homeBg" />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <Collections />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <PopularProducts />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <MostRatedProducts />
        </Col>
      </Row>
    </Container>
  )
}
