/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, CardBody, Badge, Button, Collapse, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from "reactstrap"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { getMyOrders, cancelOrder, submitReview } from "../../services/orderService"
import { showError, showSuccess } from "../../utils/toast"
import BreadcrumbCompo from "../components/BreadcrumbCompo"
import { formatPrice } from "../../utils/currency"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import RateReviewIcon from "@mui/icons-material/RateReview"

const OrdersPage = () => {
  const router = useRouter()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const userData = useSelector((state: RootState) => state.auth.userData)

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openOrders, setOpenOrders] = useState<{ [key: number]: boolean }>({})
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const observerRef = React.useRef<HTMLDivElement | null>(null)

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewOrderId, setReviewOrderId] = useState<number | null>(null)
  const [reviewProductId, setReviewProductId] = useState<number | null>(null)
  const [reviewProductName, setReviewProductName] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)

  const openReviewModal = (orderId: number, productId: number | null, productName: string, existingReview?: any) => {
    setReviewOrderId(orderId)
    setReviewProductId(productId)
    setReviewProductName(productName)
    if (existingReview) {
      setRating(existingReview.rating)
      setComment(existingReview.comment || "")
    } else {
      setRating(0)
      setComment("")
    }
    setIsReviewModalOpen(true)
  }

  const handleReviewSubmit = async () => {
    if (!reviewOrderId) return
    if (rating === 0) {
      showError("Please select a rating of at least 1 star.")
      return
    }

    setSubmittingReview(true)
    try {
      const res = await submitReview({
        orderId: reviewOrderId,
        productId: reviewProductId,
        rating,
        comment,
      })
      if (res.data.success) {
        showSuccess(res.data.message || "Review submitted successfully.")
        setIsReviewModalOpen(false)
        setPage(1)
        fetchOrders(1, true)
      } else {
        showError(res.data.message || "Failed to submit review.")
      }
    } catch (error: any) {
      console.error("Error submitting review:", error)
      showError(error.response?.data?.message || "Failed to submit review.")
    } finally {
      setSubmittingReview(false)
    }
  }

  const fetchOrders = async (pageNum = 1, shouldReset = false) => {
    if (pageNum === 1 || shouldReset) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    try {
      const res = await getMyOrders({ page: pageNum, limit: 5 })
      const { success, data, message } = res.data
      if (success) {
        const records = data.records || []
        const total = data.total || 0
        if (pageNum === 1 || shouldReset) {
          setOrders(records)
          setHasMore(records.length < total)
        } else {
          setOrders((prev) => [...prev, ...records])
          setHasMore((prevOrders: any) => (prevOrders.length + records.length) < total)
        }
      } else {
        showError(message || "Failed to load orders")
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error)
      showError("Failed to load orders. Please try again.")
    } finally {
      setLoading(false)
      setLoadingMore(false)
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
      setPage(1)
      setHasMore(true)
      fetchOrders(1, true)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated && page > 1) {
      fetchOrders(page)
    }
  }, [page])

  // Scroll observer logic
  useEffect(() => {
    if (!hasMore || loadingMore || loading) return

    const currentRef = observerRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasMore, loadingMore, loading])

  const toggleOrder = (orderId: number) => {
    setOpenOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return
    }
    setCancellingId(orderId)
    try {
      const res = await cancelOrder(orderId)
      const { success, message } = res.data
      if (success) {
        showSuccess(message || "Order cancelled successfully.")
        setPage(1)
        fetchOrders(1, true)
      } else {
        showError(message || "Failed to cancel order.")
      }
    } catch (error: any) {
      console.error("Error cancelling order:", error)
      showError(error.response?.data?.message || "Failed to cancel order.")
    } finally {
      setCancellingId(null)
    }
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
      case "cancelled by customer":
      case "cancelled by seller":
      case "cancelled by admin":
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
                         <span className="font-weight-bold text-danger h5">{formatPrice(order.totalAmount)}</span>
                      </div>
                      <div>
                        <span className="text-muted d-block small text-uppercase font-weight-bold mb-1">Status</span>
                        <Badge color={getStatusBadgeColor(order.status)} className="px-3 py-2 text-uppercase">
                          {order.status}
                        </Badge>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {(order.status === "pending" || order.status === "processing") && (
                          <Button
                            color="danger"
                            size="sm"
                            className="text-uppercase font-weight-bold"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancellingId === order.id}
                          >
                            {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
                          </Button>
                        )}
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
                              {order.items?.map((item: any, idx: number) => {
                                const isDelivered = order.status?.toLowerCase() === "delivered"
                                const existingReview = isDelivered ? order.reviews?.find((r: any) => r.productId === item.productId) : null
                                return (
                                  <div key={item.id || idx} className="border-bottom pb-3 mb-2">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div>
                                        <span className="font-weight-bold text-dark d-block">{item.product?.name || "Unknown Product"}</span>
                                         <span className="text-muted small">Qty: {item.quantity} × {formatPrice(item.price)}</span>
                                      </div>
                                       <span className="font-weight-bold text-dark">{formatPrice(parseFloat(item.price) * item.quantity)}</span>
                                    </div>
                                    {isDelivered && (
                                      <div className="d-flex align-items-center justify-content-between mt-2 pt-1 border-top border-light">
                                        <div>
                                          {existingReview ? (
                                            <div className="d-flex align-items-center gap-1 flex-wrap">
                                              <span className="text-muted small">Your rating:</span>
                                              <span className="text-warning font-weight-bold d-flex align-items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                  star <= existingReview.rating ? (
                                                    <StarIcon key={star} style={{ fontSize: "16px" }} />
                                                  ) : (
                                                    <StarBorderIcon key={star} style={{ fontSize: "16px", color: "#ccc" }} />
                                                  )
                                                ))}
                                              </span>
                                              {existingReview.comment && (
                                                <span className="text-muted small italic ml-2">({existingReview.comment})</span>
                                              )}
                                            </div>
                                          ) : (
                                            <span className="text-muted small italic">Not reviewed yet</span>
                                          )}
                                        </div>
                                        <Button
                                          color="warning"
                                          outline
                                          size="sm"
                                          style={{ fontSize: "11px", padding: "2px 8px" }}
                                          className="d-flex align-items-center gap-1"
                                          onClick={() => openReviewModal(order.id, item.productId, item.product?.name || "Product", existingReview)}
                                        >
                                          <RateReviewIcon style={{ fontSize: "12px" }} /> {existingReview ? "Edit Review" : "Write Review"}
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                            {order.couponCode && (
                              <div className="bg-light p-3 rounded mt-3 small border border-light">
                                <div className="d-flex justify-content-between mb-1">
                                  <span className="text-muted">Subtotal:</span>
                                  <span className="font-weight-bold text-dark">{formatPrice(order.subTotal || order.totalAmount)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1">
                                  <span className="text-muted">Coupon Discount ({order.couponCode}):</span>
                                  <span className="font-weight-bold text-success">-{formatPrice(order.discountAmount)}</span>
                                </div>
                                <div className="d-flex justify-content-between border-top pt-1 font-weight-bold">
                                  <span>Final Total:</span>
                                  <span className="text-danger">{formatPrice(order.totalAmount)}</span>
                                </div>
                              </div>
                            )}
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

                            {order.status?.toLowerCase() === "delivered" && (
                              <div className="mt-4 pt-3 border-top">
                                <h6 className="text-dark font-weight-bold text-uppercase pb-2 mb-2 d-flex align-items-center gap-2">
                                  <RateReviewIcon color="action" /> Rate Order Experience
                                </h6>
                                {(() => {
                                  const orderReview = order.reviews?.find((r: any) => r.productId === null)
                                  return (
                                    <div className="d-flex flex-column gap-2">
                                      {orderReview ? (
                                        <div className="d-flex align-items-center gap-1 flex-wrap">
                                          <span className="text-muted small">Your rating:</span>
                                          <span className="text-warning font-weight-bold d-flex align-items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              star <= orderReview.rating ? (
                                                <StarIcon key={star} style={{ fontSize: "16px" }} />
                                              ) : (
                                                <StarBorderIcon key={star} style={{ fontSize: "16px", color: "#ccc" }} />
                                              )
                                            ))}
                                          </span>
                                          {orderReview.comment && (
                                            <div className="text-muted small italic w-100">&ldquo;{orderReview.comment}&rdquo;</div>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-muted small italic">You haven&apos;t rated this order experience yet.</span>
                                      )}
                                      <Button
                                        color="primary"
                                        outline
                                        size="sm"
                                        className="mt-2 w-100 d-flex align-items-center justify-content-center gap-1"
                                        onClick={() => openReviewModal(order.id, null, `Order #${order.id}`, orderReview)}
                                      >
                                        <RateReviewIcon style={{ fontSize: "14px" }} /> {orderReview ? "Edit Order Rating" : "Rate Order"}
                                      </Button>
                                    </div>
                                  )
                                })()}
                              </div>
                            )}
                          </Col>
                        </Row>
                      </CardBody>
                    </Collapse>
                  </Card>
                )
              })}
              <div ref={observerRef} className="text-center py-4 mt-3">
                {loadingMore && (
                  <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
                {!hasMore && orders.length > 0 && (
                  <p className="text-muted small">No more orders to show.</p>
                )}
              </div>
            </div>
          )}
        </Col>
      </Row>
      {/* Review Modal */}
      <Modal isOpen={isReviewModalOpen} toggle={() => setIsReviewModalOpen(false)} centered>
        <ModalHeader toggle={() => setIsReviewModalOpen(false)} className="border-0 pb-0">
          <span className="font-weight-bold text-dark h4">
            {reviewProductId ? "Product Review" : "Order Review"}
          </span>
        </ModalHeader>
        <ModalBody className="pt-2">
          <p className="text-muted mb-4">
            {reviewProductId ? (
              <>How would you rate <strong>{reviewProductName}</strong>?</>
            ) : (
              <>How would you rate your experience for <strong>{reviewProductName}</strong>?</>
            )}
          </p>

          <FormGroup className="mb-4 text-center">
            <Label className="d-block text-muted small text-uppercase font-weight-bold mb-3">Star Rating</Label>
            <div className="d-flex justify-content-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= (hoverRating || rating)
                return (
                  <button
                    key={star}
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "transform 0.15s ease",
                      transform: hoverRating === star ? "scale(1.2)" : "scale(1)",
                    }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {isActive ? (
                      <StarIcon style={{ fontSize: "40px", color: "#ffb400" }} />
                    ) : (
                      <StarBorderIcon style={{ fontSize: "40px", color: "#ccc" }} />
                    )}
                  </button>
                )
              })}
            </div>
            {rating > 0 && (
              <span className="d-block mt-2 font-weight-bold text-warning" style={{ fontSize: "14px" }}>
                {rating === 1 ? "Terrible" : rating === 2 ? "Bad" : rating === 3 ? "Average" : rating === 4 ? "Good" : "Excellent"}
              </span>
            )}
          </FormGroup>

          <FormGroup className="mb-3">
            <Label className="text-muted small text-uppercase font-weight-bold mb-2">Write your review (optional)</Label>
            <Input
              type="textarea"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked or disliked about this product..."
              className="form-control rounded-3 border-light shadow-sm"
              style={{ resize: "none", backgroundColor: "#f9f9f9" }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter className="border-0 pt-0">
          <Button color="light" className="text-uppercase font-weight-bold px-4" onClick={() => setIsReviewModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="warning"
            className="text-uppercase font-weight-bold px-4 text-white"
            onClick={handleReviewSubmit}
            disabled={submittingReview}
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  )
}

export default OrdersPage
