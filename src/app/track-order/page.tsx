/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap"
import { trackOrder } from "../../services/orderService"
import { showError } from "../../utils/toast"
import BreadcrumbCompo from "../components/BreadcrumbCompo"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"
import SettingsIcon from "@mui/icons-material/Settings"

const TrackOrderContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderId, setOrderId] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleTrack = async (idToTrack: string) => {
    if (!idToTrack.trim()) {
      showError("Please enter a valid Order ID.")
      return
    }
    setLoading(true)
    setSearched(true)
    setOrder(null)
    try {
      const res = await trackOrder(idToTrack)
      if (res.data.success) {
        setOrder(res.data.data)
      } else {
        showError(res.data.message || "Order not found.")
      }
    } catch (error: any) {
      console.error("Track order error:", error)
      showError(error.response?.data?.message || "Order not found. Please verify the Order ID.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const idParam = searchParams.get("orderId")
    if (idParam) {
      setOrderId(idParam)
      handleTrack(idParam)
    }
  }, [searchParams])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/track-order?orderId=${orderId}`)
  }

  const getStatusStep = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("cancelled")) return -1
    if (s === "pending") return 1
    if (s === "processing") return 2
    if (s === "shipped") return 3
    if (s === "delivered") return 4
    return 1
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const step = order ? getStatusStep(order.status) : 0

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <BreadcrumbCompo activeScreenName="Track Order" previousScreenLink="/shop" previousScreenName="Shop" />
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md="8" lg="6" className="mx-auto">
          <Card className="shadow-lg border-0 rounded-4">
            <CardBody className="p-4 p-md-5">
              <div className="text-center mb-4">
                <LocalShippingIcon className="text-danger mb-3" style={{ fontSize: "56px" }} />
                <h2 className="font-weight-bold text-dark">Track Your Order</h2>
                <p className="text-muted">Enter your order ID below to check the real-time delivery status.</p>
              </div>
              <Form onSubmit={onSubmit}>
                <FormGroup className="mb-4">
                  <Label for="orderId" className="font-weight-bold text-muted small text-uppercase">Order ID</Label>
                  <Input
                    type="text"
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. 1024"
                    className="form-control-lg rounded-3 border-2"
                    style={{ borderColor: "#ced4da" }}
                  />
                </FormGroup>
                <Button color="danger" size="lg" block className="rounded-3 text-uppercase font-weight-bold py-3" disabled={loading}>
                  {loading ? "Locating Order..." : "Track Now"}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {searched && !loading && !order && (
        <Row>
          <Col md="8" className="mx-auto">
            <Alert color="danger" className="border-0 shadow-sm rounded-3 p-4 text-center">
              <h5 className="font-weight-bold">Order Not Found</h5>
              <p className="mb-0 text-muted">
                We couldn&apos;t find an order matching ID <strong>#{orderId}</strong>. Please double check the ID and try again.
              </p>
            </Alert>
          </Col>
        </Row>
      )}

      {order && !loading && (
        <Row className="gy-4">
          <Col lg="8" className="mx-auto">
            {/* Tracking Progress Card */}
            <Card className="shadow-lg border-0 rounded-4 mb-4 overflow-hidden">
              <div className="bg-dark text-white p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <span className="text-light small text-uppercase d-block font-weight-bold">Order Status</span>
                  <span className="h4 font-weight-bold mb-0 text-danger text-uppercase">{order.status}</span>
                </div>
                <div className="text-end">
                  <span className="text-light small text-uppercase d-block font-weight-bold">Estimated Delivery</span>
                  <span className="h5 font-weight-bold mb-0">
                    {order.status.toLowerCase() === "delivered" ? "Delivered successfully" : "3-5 Business Days"}
                  </span>
                </div>
              </div>

              <CardBody className="p-4 p-md-5 bg-white">
                {step === -1 ? (
                  <div className="text-center py-4">
                    <CancelIcon color="error" style={{ fontSize: "64px" }} className="mb-3" />
                    <h4 className="font-weight-bold text-dark">This Order was Cancelled</h4>
                    <p className="text-muted">
                      This order has been cancelled and will not be processed further. If this was a mistake, please reach out to our customer support.
                    </p>
                  </div>
                ) : (
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center position-relative my-4 gap-4">
                    {/* Background Progress Line */}
                    <div
                      className="d-none d-md-block position-absolute bg-light"
                      style={{
                        height: "4px",
                        left: "10%",
                        right: "10%",
                        top: "35px",
                        zIndex: 1,
                      }}
                    />
                    <div
                      className="d-none d-md-block position-absolute bg-danger transition-all duration-500"
                      style={{
                        height: "4px",
                        left: "10%",
                        width: `${((step - 1) / 3) * 80}%`,
                        top: "35px",
                        zIndex: 2,
                      }}
                    />

                    {/* Step 1: Pending */}
                    <div className="text-center d-flex flex-column align-items-center" style={{ zIndex: 3 }}>
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center border-3 ${
                          step >= 1 ? "bg-danger text-white border-danger" : "bg-white text-muted border-light"
                        }`}
                        style={{ width: "70px", height: "70px", borderWidth: "3px", borderStyle: "solid" }}
                      >
                        <HourglassEmptyIcon style={{ fontSize: "28px" }} />
                      </div>
                      <h6 className={`mt-3 font-weight-bold ${step >= 1 ? "text-dark" : "text-muted"}`}>Pending</h6>
                      <span className="small text-muted d-block">Order Confirmed</span>
                    </div>

                    {/* Step 2: Processing */}
                    <div className="text-center d-flex flex-column align-items-center" style={{ zIndex: 3 }}>
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center border-3 ${
                          step >= 2 ? "bg-danger text-white border-danger" : "bg-white text-muted border-light"
                        }`}
                        style={{ width: "70px", height: "70px", borderWidth: "3px", borderStyle: "solid" }}
                      >
                        <SettingsIcon style={{ fontSize: "28px" }} />
                      </div>
                      <h6 className={`mt-3 font-weight-bold ${step >= 2 ? "text-dark" : "text-muted"}`}>Processing</h6>
                      <span className="small text-muted d-block">Preparing items</span>
                    </div>

                    {/* Step 3: Shipped */}
                    <div className="text-center d-flex flex-column align-items-center" style={{ zIndex: 3 }}>
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center border-3 ${
                          step >= 3 ? "bg-danger text-white border-danger" : "bg-white text-muted border-light"
                        }`}
                        style={{ width: "70px", height: "70px", borderWidth: "3px", borderStyle: "solid" }}
                      >
                        <LocalShippingIcon style={{ fontSize: "28px" }} />
                      </div>
                      <h6 className={`mt-3 font-weight-bold ${step >= 3 ? "text-dark" : "text-muted"}`}>Shipped</h6>
                      <span className="small text-muted d-block">In transit</span>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="text-center d-flex flex-column align-items-center" style={{ zIndex: 3 }}>
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center border-3 ${
                          step >= 4 ? "bg-success text-white border-success" : "bg-white text-muted border-light"
                        }`}
                        style={{ width: "70px", height: "70px", borderWidth: "3px", borderStyle: "solid" }}
                      >
                        <CheckCircleIcon style={{ fontSize: "28px" }} />
                      </div>
                      <h6 className={`mt-3 font-weight-bold ${step >= 4 ? "text-success" : "text-muted"}`}>Delivered</h6>
                      <span className="small text-muted d-block">Arrived safely</span>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Order Details & Summary Card */}
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden mb-4">
              <CardBody className="p-4 p-md-5">
                <Row className="gy-4">
                  <Col md="6">
                    <h5 className="font-weight-bold text-dark border-bottom pb-2 mb-3">Order Info</h5>
                    <div className="d-flex flex-column gap-2 text-muted">
                      <div>
                        <strong>Order ID:</strong> #{order.id}
                      </div>
                      <div>
                        <strong>Placed On:</strong> {formatDate(order.createdAt)}
                      </div>
                      <div>
                        <strong>Payment Status:</strong> Paid (Total: <span className="text-danger font-weight-bold">${parseFloat(order.totalAmount).toFixed(2)}</span>)
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <h5 className="font-weight-bold text-dark border-bottom pb-2 mb-3">Shipping Destination</h5>
                    {order.address ? (
                      <div className="text-muted">
                        <div className="font-weight-bold text-dark mb-1">Standard Home Delivery</div>
                        <div>{order.address.city}, {order.address.state}</div>
                        <div>{order.address.pinCode}</div>
                      </div>
                    ) : (
                      <span className="text-muted italic">No address details available</span>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {/* Items Ordered Card */}
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="bg-light px-4 py-3 border-bottom">
                <h5 className="font-weight-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <ShoppingBagIcon className="text-danger" /> Items in Order
                </h5>
              </div>
              <CardBody className="p-4">
                <div className="d-flex flex-column gap-3">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={item.id || idx} className="d-flex justify-content-between align-items-center pb-3 border-bottom last-border-none">
                      <div>
                        <span className="font-weight-bold text-dark d-block h6 mb-1">
                          {item.product?.name || "Unknown Product"}
                        </span>
                        <span className="text-muted small">
                          Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                        </span>
                      </div>
                      <span className="font-weight-bold text-dark h6">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}

const TrackOrderPage = () => {
  return (
    <Suspense fallback={
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  )
}

export default TrackOrderPage
