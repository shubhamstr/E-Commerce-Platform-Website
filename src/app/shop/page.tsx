import React, { Suspense } from "react"
import { Container, Row, Col } from "reactstrap"
import LandingSection from "../components/LandingSection"
import BreadcrumbCompo from "../components/BreadcrumbCompo"
import ShopContent from "../components/ShopContent"
import Collections from "../components/Collections"
import styles from "./page.module.css"
import PopularCategories from "../components/PopularCategories"

const page = () => {
  return (
    <Container fluid>
      <Row xs="1" className={styles.bgColor}>
        <Col>
          <LandingSection 
            bgClass="shopBg" 
            badge="# Curated Collections"
            title="Shop All Categories"
            subtitle="Browse through our vast catalog of top-rated items, curated just for you across electronics, home decor, apparel and wellness."
          />
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
          <Suspense fallback={<div className="text-center py-5">Loading shop...</div>}>
            <ShopContent />
          </Suspense>
        </Col>
      </Row>
      <Row xs="1">
        <Col>
          <PopularCategories />
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
