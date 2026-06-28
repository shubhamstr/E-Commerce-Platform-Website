/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap"
import api from "../../../utils/api"
import { formatPrice } from "../../../utils/currency"
import ProductCard from "../../components/ProductCard"
import CallIcon from "@mui/icons-material/Call"
import MailIcon from "@mui/icons-material/Mail"
import StoreIcon from "@mui/icons-material/Store"
import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import InsertChartIcon from "@mui/icons-material/InsertChart"
import InventoryIcon from "@mui/icons-material/Inventory"
import RateReviewIcon from "@mui/icons-material/RateReview"
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useRouter } from "next/navigation"

export default function SellerProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const [profileData, setProfileData] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("products")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProductsCount, setTotalProductsCount] = useState(0)
  const limit = 8

  useEffect(() => {
    if (!id) return

    const fetchSellerData = async () => {
      try {
        setLoading(true)
        // 1. Fetch profile and analytics
        const profileRes = await api.get(`/api/user/seller-profile?id=${id}`)
        if (profileRes.data && profileRes.data.success) {
          setProfileData(profileRes.data.data)
        }
      } catch (err) {
        console.error("Error fetching seller profile:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSellerData()
  }, [id])

  useEffect(() => {
    if (!id) return

    const fetchSellerProducts = async () => {
      try {
        const filters = JSON.stringify({ createdById: { value: id } })
        const productsRes = await api.get(`/api/product/get`, {
          params: { page: currentPage, limit, filters },
        })
        if (productsRes.data && productsRes.data.success) {
          setProducts(productsRes.data.data.records || [])
          setTotalProductsCount(productsRes.data.data.total || 0)
        }
      } catch (err) {
        console.error("Error fetching seller products:", err)
      }
    }

    fetchSellerProducts()
  }, [id, currentPage])

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading seller profile...</span>
        </div>
      </Container>
    )
  }

  if (!profileData) {
    return (
      <Container className="py-5 text-center">
        <h3 className="text-danger">Seller Not Found</h3>
        <p>The requested seller profile does not exist or has been disabled.</p>
        <Button color="primary" onClick={() => router.push("/shop")}>
          <ArrowBackIcon className="me-2" /> Back to Shop
        </Button>
      </Container>
    )
  }

  const { seller, analytics, reviews } = profileData
  const joinDate = seller.createdAt
    ? new Date(seller.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"

  // Max value for y-axis calculation on monthly trend graph
  const maxRevenue =
    analytics.monthlySalesTrend.length > 0
      ? Math.max(...analytics.monthlySalesTrend.map((t: any) => t.revenue))
      : 0

  // Category chart calculations
  const maxCategoryCount =
    analytics.categoryDistribution.length > 0
      ? Math.max(...analytics.categoryDistribution.map((c: any) => c.count))
      : 0

  return (
    <Container className="py-4">
      {/* Header section with back button and profile title */}
      <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <Button color="secondary" outline onClick={() => router.push("/shop")}>
            <ArrowBackIcon /> Back to Shop
          </Button>
        </Col>
        <Col>
          <h2 className="mb-0 fw-bold text-dark">Seller Dashboard</h2>
        </Col>
      </Row>

      {/* Seller Header Info Card */}
      <Card
        className="mb-4 border-0 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          color: "#ffffff",
          borderRadius: "15px",
        }}
      >
        <CardBody className="p-4 p-md-5">
          <Row className="align-items-center">
            <Col md="auto" className="text-center text-md-start mb-3 mb-md-0">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-white text-primary rounded-circle shadow-sm"
                style={{ width: "80px", height: "80px" }}
              >
                <StoreIcon style={{ fontSize: "40px" }} />
              </div>
            </Col>
            <Col className="text-center text-md-start">
              <h1 className="fw-bold mb-1">
                {seller.firstName} {seller.lastName}
              </h1>
              <p className="opacity-75 mb-3 d-flex align-items-center justify-content-center justify-content-md-start gap-1">
                <CalendarTodayIcon style={{ fontSize: "16px" }} /> Joined: {joinDate}
              </p>
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                {seller.email && (
                  <Button
                    color="light"
                    outline
                    size="sm"
                    className="d-flex align-items-center gap-2"
                    href={`mailto:${seller.email}`}
                  >
                    <MailIcon style={{ fontSize: "18px" }} /> {seller.email}
                  </Button>
                )}
                {seller.mobileNumber && (
                  <Button
                    color="light"
                    size="sm"
                    className="d-flex align-items-center gap-2 font-weight-bold"
                    href={`tel:${seller.mobileNumber}`}
                    style={{ backgroundColor: "#25d366", borderColor: "#25d366", color: "white" }}
                  >
                    <CallIcon style={{ fontSize: "18px" }} /> Call: {seller.mobileNumber}
                  </Button>
                )}
              </div>
            </Col>
            <Col md="auto" className="text-center mt-3 mt-md-0">
              <div className="bg-white text-dark rounded px-4 py-3 shadow-sm border border-light">
                <div className="text-muted small text-uppercase fw-semibold mb-1">Seller Rating</div>
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <span className="fs-3 fw-bold">{analytics.averageRating}</span>
                  <StarIcon style={{ color: "#ffc107", fontSize: "28px" }} />
                </div>
                <div className="text-muted small">({analytics.totalReviews} customer reviews)</div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Analytics Metric Cards Grid */}
      <Row className="g-4 mb-4">
        {[
          {
            title: "Total Products",
            value: analytics.totalProducts,
            icon: <InventoryIcon className="text-primary" />,
            border: "border-primary",
          },
          {
            title: "Items Sold",
            value: analytics.totalItemsSold,
            icon: <MonetizationOnIcon className="text-success" />,
            border: "border-success",
          },
          {
            title: "Total Revenue",
            value: formatPrice(analytics.totalRevenue),
            icon: <MonetizationOnIcon className="text-warning" />,
            border: "border-warning",
          },
          {
            title: "Total Reviews",
            value: analytics.totalReviews,
            icon: <RateReviewIcon className="text-info" />,
            border: "border-info",
          },
        ].map((item, idx) => (
          <Col key={idx} xs="12" sm="6" lg="3">
            <Card className={`h-100 border-0 border-start border-4 ${item.border} shadow-sm`}>
              <CardBody className="d-flex align-items-center justify-content-between p-4">
                <div>
                  <h6 className="text-muted text-uppercase mb-1 small fw-semibold">{item.title}</h6>
                  <h3 className="fw-bold mb-0">{item.value}</h3>
                </div>
                <div className="bg-light rounded p-3">{item.icon}</div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Graphs / Analytics Charts Section */}
      <Row className="mb-4 g-4">
        {/* Sales Revenue Trend SVG Graph */}
        <Col lg="8">
          <Card className="border-0 shadow-sm h-100">
            <CardBody className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Sales Analytics Trend</h5>
                <span className="badge bg-primary-subtle text-primary py-2 px-3 fw-semibold">Monthly Breakdown</span>
              </div>

              {analytics.monthlySalesTrend.length === 0 ? (
                <div
                  className="d-flex flex-column align-items-center justify-content-center text-muted"
                  style={{ height: "220px" }}
                >
                  <InsertChartIcon style={{ fontSize: "48px", opacity: 0.5 }} className="mb-2" />
                  <p>No sales revenue data available yet</p>
                </div>
              ) : (
                <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
                  <svg viewBox="0 0 500 240" className="w-100" style={{ minWidth: "400px" }}>
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d6efd" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0d6efd" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Y-axis helper lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
                      <line
                        key={i}
                        x1="40"
                        y1={20 + r * 160}
                        x2="480"
                        y2={20 + r * 160}
                        stroke="#e9ecef"
                        strokeDasharray="4 4"
                      />
                    ))}

                    {/* Draw the area and trend lines */}
                    {(() => {
                      const points = analytics.monthlySalesTrend.map((t: any, i: number) => {
                        const x = 40 + (i / Math.max(1, analytics.monthlySalesTrend.length - 1)) * 440
                        const y = maxRevenue > 0 ? 180 - (t.revenue / maxRevenue) * 160 + 20 : 180
                        return { x, y, month: t.month, revenue: t.revenue }
                      })

                      const dPath = points.map((p: any, i: number) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
                      const dArea = points.length > 0
                        ? `${dPath} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z`
                        : ""

                      return (
                        <>
                          {dArea && <path d={dArea} fill="url(#salesGrad)" />}
                          {dPath && <path d={dPath} fill="none" stroke="#0d6efd" strokeWidth="3" />}
                          
                          {/* Data points (circles with Tooltip value) */}
                          {points.map((p: any, i: number) => (
                            <g key={i}>
                              <circle cx={p.x} cy={p.y} r="5" fill="#0d6efd" stroke="#ffffff" strokeWidth="2" />
                              <text x={p.x} y={p.y - 10} fontSize="10" textAnchor="middle" fontWeight="bold" fill="#212529">
                                {formatPrice(p.revenue)}
                              </text>
                            </g>
                          ))}
                        </>
                      )
                    })()}

                    {/* X-axis labels */}
                    {analytics.monthlySalesTrend.map((t: any, i: number) => {
                      const x = 40 + (i / Math.max(1, analytics.monthlySalesTrend.length - 1)) * 440
                      return (
                        <text key={i} x={x} y="200" fontSize="10" textAnchor="middle" fill="#6c757d">
                          {t.month}
                        </text>
                      )
                    })}
                  </svg>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>

        {/* Rating Breakdown & Category Distribution Panel */}
        <Col lg="4">
          <Card className="border-0 shadow-sm h-100">
            <CardBody className="p-4 d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold mb-3">Ratings Distribution</h5>
                <div className="d-flex flex-column gap-2 mb-4">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = analytics.ratingDistribution[stars] || 0
                    const percent = analytics.totalReviews > 0 ? (count / analytics.totalReviews) * 100 : 0
                    return (
                      <div key={stars} className="d-flex align-items-center gap-2">
                        <span className="small text-muted" style={{ width: "45px" }}>
                          {stars} Star
                        </span>
                        <div className="progress flex-grow-1" style={{ height: "8px" }}>
                          <div
                            className="progress-bar bg-warning rounded"
                            role="progressbar"
                            style={{ width: `${percent}%` }}
                            aria-valuenow={percent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <span className="small text-muted" style={{ width: "25px", textAlign: "right" }}>
                          {count}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <hr />

              <div>
                <h5 className="fw-bold mb-3">Product Categories</h5>
                {analytics.categoryDistribution.length === 0 ? (
                  <p className="text-muted small">No categories found</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {analytics.categoryDistribution.map((cat: any, i: number) => {
                      const percent = maxCategoryCount > 0 ? (cat.count / maxCategoryCount) * 100 : 0
                      return (
                        <div key={i}>
                          <div className="d-flex justify-content-between small text-muted mb-1">
                            <span>{cat.category}</span>
                            <span className="fw-semibold">{cat.count} products</span>
                          </div>
                          <div className="progress" style={{ height: "6px" }}>
                            <div
                              className="progress-bar bg-success rounded"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Tabs Menu */}
      <Nav tabs className="mb-4">
        <NavItem>
          <NavLink
            className={`fw-semibold cursor-pointer ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
            style={{ cursor: "pointer" }}
          >
            Seller Products ({totalProductsCount})
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={`fw-semibold cursor-pointer ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
            style={{ cursor: "pointer" }}
          >
            Customer Reviews ({analytics.totalReviews})
          </NavLink>
        </NavItem>
      </Nav>

      {/* Tabs Content */}
      <TabContent activeTab={activeTab}>
        {/* Products Grid Pane */}
        <TabPane tabId="products">
          {products.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <h4>No products listed by this seller</h4>
            </div>
          ) : (
            <>
              <Row className="g-4 mb-4">
                {products.map((p, idx) => (
                  <Col key={idx} xs="12" sm="6" md="4" lg="3" className="d-flex justify-content-center">
                    <ProductCard index={idx} product={p} screen="shop" />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalProductsCount > limit && (
                <div className="d-flex justify-content-center">
                  <Pagination>
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink previous onClick={() => setCurrentPage((c) => Math.max(1, c - 1))} />
                    </PaginationItem>
                    {Array.from({ length: Math.ceil(totalProductsCount / limit) }).map((_, i) => (
                      <PaginationItem active={currentPage === i + 1} key={i}>
                        <PaginationLink onClick={() => setCurrentPage(i + 1)}>{i + 1}</PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === Math.ceil(totalProductsCount / limit)}>
                      <PaginationLink next onClick={() => setCurrentPage((c) => Math.min(Math.ceil(totalProductsCount / limit), c + 1))} />
                    </PaginationItem>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </TabPane>

        {/* Reviews Panel */}
        <TabPane tabId="reviews">
          {reviews.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <h4>No reviews yet for this seller&apos;s products</h4>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {reviews.map((rev: any, idx: number) => {
                const reviewDate = rev.createdAt
                  ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"
                return (
                  <Card key={idx} className="border-0 shadow-sm">
                    <CardBody className="p-4">
                      <Row className="align-items-start">
                        <Col className="flex-grow-1">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <h6 className="fw-bold mb-0">
                              {rev.user ? `${rev.user.firstName} ${rev.user.lastName}` : "Anonymous Buyer"}
                            </h6>
                            <span className="small text-muted">{reviewDate}</span>
                          </div>
                          
                          <div className="d-flex align-items-center mb-2">
                            {Array.from({ length: 5 }).map((_, i) =>
                              i < rev.rating ? (
                                <StarIcon key={i} style={{ color: "#ffc107", fontSize: "18px" }} />
                              ) : (
                                <StarBorderIcon key={i} style={{ color: "#6c757d", fontSize: "18px" }} />
                              )
                            )}
                            <span className="ms-2 small text-muted">
                              for{" "}
                              <span className="fw-semibold text-secondary">
                                {rev.product ? rev.product.name : "Unknown Product"}
                              </span>
                            </span>
                          </div>
                          
                          <p className="mb-0 text-dark-emphasis">{rev.comment || "No comment left."}</p>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          )}
        </TabPane>
      </TabContent>
    </Container>
  )
}
