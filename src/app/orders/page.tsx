/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, CardBody, Badge, Button, Collapse } from "reactstrap"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { getMyOrders } from "../../services/orderService"
import { showError } from "../../utils/toast"
import BreadcrumbCompo from "../components/BreadcrumbCompo"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"

const OrdersPage = () => {
  const router = useRouter()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const userData = useSelector((state: RootState) => state.auth.userData)

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openOrders, setOpenOrders] = useState<{ [key: number]: boolean }>({})

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders()
      const { success, data, message } = res.data
      if (success) {
        setOrders(data || [])
      } else {
        showError(message || "Failed to load orders")
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error)
      showError("Failed to load orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("ecomToken")
      if (!token) {
        router.push("/login")
        return
      }
    }
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  const toggleOrder = (orderId: number) => {
    setOpenOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning"
      case "processing":
        return "info"
      case "shipped":
        return "primary"
      case "delivered":
        return "success"
      case "cancelled":
        return "danger"
      default:
        return "secondary"
    }
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

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <BreadcrumbCompo activeScreenName="My Orders" previousScreenLink="/account" previousScreenName="Account" />
        </Col>
      </Row>

      <Row>
        <Col lg="10" className="mx-auto">
          <h2 className="mb-4 text-dark font-weight-bold d-flex align-items-center gap-2">
            <ShoppingBagIcon fontSize="large" color="error" /> My Orders
          </h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <Card className="shadow-sm border-0 rounded-3 text-center p-5">
              <CardBody>
                <div className="mb-4 text-muted">
                  <ShoppingBagIcon style={{ fontSize: "72px" }} />
                </div>
                <h4 className="font-weight-bold">No Orders Placed Yet</h4>
                <p className="text-muted mb-4">
                  Looks like you haven&apos;t made any purchases yet. Head over to our shop to find something you love!
                </p>
                <Button color="danger" size="lg" className="px-5 text-uppercase" onClick={() => router.push("/shop")}>
                  Start Shopping
                </Button>
              </CardBody>
            </Card>
          ) : (
            <div className="d-flex flex-column gap-4">
              {orders.map((order) => {
                const isOpen = !!openOrders[order.id]
                return (
                  <Card key={order.id} className="shadow-sm border-0 rounded-4 overflow-hidden">
                    <div className="bg-light p-4 border-bottom d-flex flex-wrap justify-content-between align-items-center gap-3">
                      <div>
                        <span className="text-muted d-block small text-uppercase font-weight-bold">Order ID</span>
                        <span className="font-weight-bold text-dark h5">#{order.id}</span>
                      </div>
                      <div>
                        <span className="text-muted d-block small text-uppercase font-weight-bold">Date Placed</span>
                        <span className="font-weight-bold text-dark">{formatDate(order.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-muted d-block small text-uppercase font-weight-bold">Total Amount</span>
                        <span className="font-weight-bold text-danger h5">${parseFloat(order.totalAmount).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted d-block small text-uppercase font-weight-bold mb-1">Status</span>
                        <Badge color={getStatusBadgeColor(order.status)} className="px-3 py-2 text-uppercase">
                          {order.status}
                        </Badge>
                      </div>
                      <div>
                        <Button color="secondary" outline size="sm" onClick={() => toggleOrder(order.id)} className="d-flex align-items-center gap-1">
                          {isOpen ? <>Hide Details <ExpandLessIcon /></> : <>View Details <ExpandMoreIcon /></>}
                        </Button>
                      </div>
                    </div>

                    <Collapse isOpen={isOpen}>
                      <CardBody className="p-4 bg-white">
                        <Row className="gy-4">
                          <Col md="7">
                            <h6 className="text-dark font-weight-bold text-uppercase border-bottom pb-2 mb-3">Items Ordered</h6>
                            <div className="d-flex flex-column gap-3">
                              {order.items?.map((item: any, idx: number) => (
                                <div key={item.id || idx} className="d-flex align-items-center justify-content-between border-bottom pb-2">
                                  <div>
                                    <span className="font-weight-bold text-dark d-block">{item.product?.name || "Unknown Product"}</span>
                                    <span className="text-muted small">Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}</span>
                                  </div>
                                  <span className="font-weight-bold text-dark">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </Col>

                          <Col md="5" className="border-start-md">
                            <h6 className="text-dark font-weight-bold text-uppercase border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                              <LocalShippingIcon color="action" /> Shipping Address
                            </h6>
                            {order.address ? (
                              <div className="text-muted small lh-lg">
                                <span className="font-weight-bold text-dark d-block mb-1">
                                  {userData?.firstName} {userData?.lastName}
                                </span>
                                {order.address.addressLine1}
                                {order.address.addressLine2 && `, ${order.address.addressLine2}`}
                                <br />
                                {order.address.city}, {order.address.state} - {order.address.pinCode}
                                {order.address.country && <><br />{order.address.country}</>}
                                {order.address.mobileNumber && <><br />Phone: {order.address.mobileNumber}</>}
                              </div>
                            ) : (
                              <p className="text-muted small">No shipping address recorded.</p>
                            )}
                          </Col>
                        </Row>
                      </CardBody>
                    </Collapse>
                  </Card>
                )
              })}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default OrdersPage
