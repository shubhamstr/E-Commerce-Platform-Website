// import Image from 'next/image';
import { Col, Container, Row } from "reactstrap"
import LandingSection from "./components/LandingSection"
import PopularProducts from "./components/PopularProducts"
import MostRatedProducts from "./components/MostRatedProducts"
import Collections from "./components/Collections"
import PopularCategories from "./components/PopularCategories"
import styles from "./page.module.css"

export default function Home() {
  return (
    <Container fluid>
      <Row xs="1" className={styles.bgColor}>
        <Col>
          <LandingSection 
            bgClass="homeBg" 
            badge="# Explore the Ultimate Variety"
            title="All-in-One Marketplace"
            subtitle="Explore high-quality electronics, home essentials, beauty products, fashion wear & more, all delivered straight to your door."
          />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <Collections />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <PopularCategories />
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
