"use client"
import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap"
import { useRouter, useSearchParams } from "next/navigation"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"

const CheckoutSuccessPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get("orderId")
    if (id) {
      setOrderId(id)
    }
  }, [searchParams])

  return (
    <Container className="py-5 my-5">
      <Row className="justify-content-center">
        <Col md="8" lg="6" className="text-center">
          <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
            <CardBody className="p-5">
              <div className="mb-4 text-success scale-up">
                <CheckCircleOutlineIcon style={{ fontSize: "96px" }} />
              </div>
              <h2 className="mb-3 text-dark font-weight-bold">Order Confirmed!</h2>
              <p className="text-muted mb-4 lead">
                Thank you for your purchase. Your order has been placed successfully and is being processed.
              </p>

              {orderId && (
                <div className="bg-light p-3 rounded-3 mb-4 border d-inline-block px-4">
                  <span className="text-muted d-block small text-uppercase font-weight-bold">
                    Order ID
                  </span>
                  <span className="h5 text-danger font-weight-bold">#{orderId}</span>
                </div>
              )}

              <p className="text-muted small mb-5">
                A confirmation email with your order details has been sent. You can check your order status in your account.
              </p>

              <div className="d-flex flex-column sm-flex-row gap-3 justify-content-center">
                <Button
                  color="danger"
                  size="lg"
                  className="px-4 text-uppercase d-flex align-items-center justify-content-center gap-2"
                  onClick={() => router.push("/shop")}
                >
                  <ShoppingBagIcon /> Continue Shopping
                </Button>
                <Button
                  color="secondary"
                  outline
                  size="lg"
                  className="px-4 text-uppercase"
                  onClick={() => router.push("/account")}
                >
                  Go to My Account
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CheckoutSuccessPage
