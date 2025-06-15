/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from "react"
import { useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  Col,
  Container,
  NavLink,
  Row,
} from "reactstrap"

const BreadcrumbCompo = ({
  activeScreenName,
  previousScreenLink,
  previousScreenName,
}: any) => {
  const router = useRouter()
  return (
    <Container fluid="sm">
      <Row xs="1" className="py-3">
        <Col>
          {previousScreenLink && previousScreenName ? (
            <Breadcrumb>
              <BreadcrumbItem>
                <NavLink
                  href="/"
                  className="text-primary"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push("/")
                  }}
                >
                  Home
                </NavLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <NavLink
                  href={previousScreenLink}
                  className="d-inline text-primary"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push(previousScreenLink)
                  }}
                >
                  {previousScreenName}
                </NavLink>
              </BreadcrumbItem>
              <BreadcrumbItem active>{activeScreenName}</BreadcrumbItem>
            </Breadcrumb>
          ) : (
            <Breadcrumb>
              <BreadcrumbItem>
                <NavLink
                  href="/"
                  className="text-primary"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push("/")
                  }}
                >
                  Home
                </NavLink>
              </BreadcrumbItem>
              <BreadcrumbItem active>{activeScreenName}</BreadcrumbItem>
            </Breadcrumb>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default BreadcrumbCompo
