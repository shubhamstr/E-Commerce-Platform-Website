/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from "react"
import { Button, Col, Container, Row } from "reactstrap"
import { useRouter } from "next/navigation"
import styles from "./landing.module.css"

const LandingSection = ({ bgClass, badge = "# New Summer Collection 2025", title = "Arrivals Sales", subtitle }: any) => {
  const router = useRouter()
  return (
    <Container fluid="sm">
      <Row xs="1" sm="2">
        <Col>
          <div className={`${styles.landingImg} ${styles[bgClass]}`}>
            {/* <Image src="/model_3.png" alt="model" fill={true} style={{ objectFit: 'cover' }} /> */}
          </div>
        </Col>
        <Col
          className={`d-flex flex-column justify-content-center align-items-center`}
        >
          <p className="text-black text-uppercase fw-medium text-center">
            {badge}
          </p>
          <h1 className="text-black text-uppercase fw-bolder text-center">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted text-center mt-2 px-3">
              {subtitle}
            </p>
          )}
          <Button
            color="primary"
            outline
            className="mt-3"
            onClick={(e) => {
              e.preventDefault()
              router.push("/shop")
            }}
          >
            Shop Now
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default LandingSection
