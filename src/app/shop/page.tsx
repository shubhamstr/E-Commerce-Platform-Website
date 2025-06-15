import React from "react"
import { Container, Row, Col } from "reactstrap"
import LandingSection from "../components/LandingSection"
import BreadcrumbCompo from "../components/BreadcrumbCompo"
import ShopContent from "../components/ShopContent"
import Collections from "../components/Collections"
import styles from "./page.module.css"

const page = () => {
  return (
    <Container fluid>
      <Row xs="1" className={styles.bgColor}>
        <Col>
          <LandingSection bgClass="shopBg" />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <BreadcrumbCompo
            activeScreenName="Shop"
            previousScreenLink=""
            previousScreenName=""
          />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <ShopContent />
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <Collections />
        </Col>
      </Row>
    </Container>
  )
}

export default page
