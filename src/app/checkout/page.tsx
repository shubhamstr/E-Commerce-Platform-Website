/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Badge,
} from "reactstrap"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { RootState } from "../../store"
import { getUserAddresses, addAddress } from "../../services/authService"
import { placeOrder, validateCoupon } from "../../services/orderService"
import { clearCartState } from "../../store/slices/cartSlice"
import { showSuccess, showError } from "../../utils/toast"
import { formatPrice } from "../../utils/currency"
import { SERVER_URL } from "../../utils/constants"
import BreadcrumbCompo from "../components/BreadcrumbCompo"
import Image from "next/image"

const CheckoutPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const userData = useSelector((state: RootState) => state.auth.userData)
  const cartItems = useSelector((state: RootState) => state.cart.items)

  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("cod")
  const [loading, setLoading] = useState<boolean>(false)
  const [showAddAddressForm, setShowAddAddressForm] = useState<boolean>(false)

  // Coupon states
  const [couponCode, setCouponCode] = useState<string>("")
  const [couponLoading, setCouponLoading] = useState<boolean>(false)
  const [couponError, setCouponError] = useState<string>("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.")
      return
    }
    setCouponLoading(true)
    setCouponError("")
    try {
      const res = await validateCoupon(couponCode, subtotal)
      if (res.data && res.data.success) {
        setAppliedCoupon(res.data.data)
        showSuccess("Coupon applied successfully!")
      } else {
        setCouponError(res.data.message || "Failed to apply coupon.")
        showError(res.data.message || "Failed to apply coupon.")
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to validate coupon."
      setCouponError(msg)
      showError(msg)
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    setCouponError("")
  }

  // New address form state
  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    addressType: "home",
    mobileNumber: "",
  })

  // Redirect if not logged in or if cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      showError("Please log in to checkout.")
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const fetchAddresses = async () => {
    if (!userData?.userId) return
    try {
      const res = await getUserAddresses(userData.userId)
      if (res.data && res.data.success) {
        const addrList = res.data.data || []
        setAddresses(addrList)
        // Set default address if it exists
        const defaultAddr = addrList.find((a: any) => a.isDefault)
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id)
        } else if (addrList.length > 0) {
          setSelectedAddressId(addrList[0].id)
        }
      }
    } catch (error: any) {
      console.error("Error fetching addresses:", error)
    }
  }

  useEffect(() => {
    if (userData?.userId) {
      fetchAddresses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.userId])

  const handleNewAddressChange = (e: any) => {
    setNewAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleAddAddressSubmit = async (e: any) => {
    e.preventDefault()
    if (!newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.pinCode) {
      showError("Please fill out all required address fields.")
      return
    }

    try {
      const payload = {
        ...newAddress,
        userId: userData.userId,
      }
      const res = await addAddress(payload)
      if (res.data && res.data.success) {
        showSuccess("Address added successfully.")
        setShowAddAddressForm(false)
        setNewAddress({
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          pinCode: "",
          addressType: "home",
          mobileNumber: "",
        })
        await fetchAddresses()
      } else {
        showError(res.data.message || "Failed to add address.")
      }
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to add address.")
    }
  }

  const handlePlaceOrderSubmit = async () => {
    if (!selectedAddressId) {
      showError("Please select or add a shipping address.")
      return
    }
    setLoading(true)
    try {
      const res = await placeOrder(selectedAddressId, appliedCoupon ? appliedCoupon.code : undefined)
      if (res.data && res.data.success) {
        showSuccess("Order placed successfully!")
        dispatch(clearCartState())
        router.push(`/checkout/success?orderId=${res.data.data.orderId}`)
      } else {
        showError(res.data.message || "Failed to place order.")
      }
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to place order.")
    } finally {
      setLoading(false)
    }
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  )

  // Auto-validate coupon code after user stops typing (500ms debounce)
  useEffect(() => {
    if (!couponCode.trim()) {
      setAppliedCoupon(null)
      setCouponError("")
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setCouponLoading(true)
      setCouponError("")
      try {
        const res = await validateCoupon(couponCode, subtotal)
        if (res.data && res.data.success) {
          setAppliedCoupon(res.data.data)
          setCouponError("")
        } else {
          setAppliedCoupon(null)
          setCouponError(res.data.message || "Failed to apply coupon.")
        }
      } catch (err: any) {
        setAppliedCoupon(null)
        setCouponError(err.response?.data?.message || "Failed to validate coupon.")
      } finally {
        setCouponLoading(false)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [couponCode, subtotal])

  const shipping = subtotal > 100 ? 0 : 10
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0
  const total = Math.max(0, subtotal - discountAmount + shipping)

  if (!isAuthenticated) {
    return (
      <Container className="text-center py-5">
        <h4>Redirecting to login...</h4>
      </Container>
    )
  }

  return (
    <Container fluid className="pb-5">
      <Row xs="1">
        <Col>
          <BreadcrumbCompo activeScreenName="Checkout" previousScreenLink="/cart" previousScreenName="Cart" />
        </Col>
      </Row>

      <Container className="mt-4">
        {cartItems.length === 0 ? (
          <Row>
            <Col className="text-center py-5">
              <h3 className="mb-4">Your cart is empty</h3>
              <Button color="danger" outline onClick={() => router.push("/shop")}>
                Return to Shop
              </Button>
            </Col>
          </Row>
        ) : (
          <Row>
            {/* Left Column: Address and Payment */}
            <Col lg="8" className="mb-4">
              {/* Address Section */}
              <div className="mb-4 border rounded p-4 shadow-sm bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="m-0">Shipping Address</h4>
                  {!showAddAddressForm && (
                    <Button
                      color="danger"
                      size="sm"
                      outline
                      onClick={() => setShowAddAddressForm(true)}
                    >
                      + Add New Address
                    </Button>
                  )}
                </div>

                {showAddAddressForm ? (
                  <Form onSubmit={handleAddAddressSubmit} className="border p-3 rounded bg-light mb-3">
                    <h5 className="mb-3">New Address Details</h5>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="addressLine1">Address Line 1 *</Label>
                          <Input
                            id="addressLine1"
                            name="addressLine1"
                            placeholder="Street address, P.O. box, company name"
                            type="text"
                            required
                            onChange={handleNewAddressChange}
                            value={newAddress.addressLine1}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="addressLine2">Address Line 2</Label>
                          <Input
                            id="addressLine2"
                            name="addressLine2"
                            placeholder="Apartment, suite, unit, building, floor"
                            type="text"
                            onChange={handleNewAddressChange}
                            value={newAddress.addressLine2}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="city">City *</Label>
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            required
                            onChange={handleNewAddressChange}
                            value={newAddress.city}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="state">State *</Label>
                          <Input
                            id="state"
                            name="state"
                            type="text"
                            required
                            onChange={handleNewAddressChange}
                            value={newAddress.state}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="pinCode">Pin Code *</Label>
                          <Input
                            id="pinCode"
                            name="pinCode"
                            type="text"
                            required
                            onChange={handleNewAddressChange}
                            value={newAddress.pinCode}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="mobileNumber">Mobile Number</Label>
                          <Input
                            id="mobileNumber"
                            name="mobileNumber"
                            placeholder="e.g. 9876543210"
                            type="text"
                            onChange={handleNewAddressChange}
                            value={newAddress.mobileNumber}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="addressType">Address Type</Label>
                          <Input
                            id="addressType"
                            name="addressType"
                            type="select"
                            onChange={handleNewAddressChange}
                            value={newAddress.addressType}
                          >
                            <option value="home">Home</option>
                            <option value="office">Office</option>
                            <option value="other">Other</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        color="secondary"
                        size="sm"
                        onClick={() => setShowAddAddressForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button color="danger" size="sm" type="submit">
                        Save Address
                      </Button>
                    </div>
                  </Form>
                ) : null}

                {addresses.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <p>No addresses found. Please add a shipping address to proceed.</p>
                    {!showAddAddressForm && (
                      <Button color="danger" onClick={() => setShowAddAddressForm(true)}>
                        Add Shipping Address
                      </Button>
                    )}
                  </div>
                ) : (
                  <Row>
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id
                      return (
                        <Col key={addr.id} md="6" className="mb-3">
                          <Card
                            className={`h-100 cursor-pointer border ${
                              isSelected ? "border-danger bg-light" : "border-secondary-subtle"
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedAddressId(addr.id)}
                          >
                            <CardBody className="position-relative">
                              <CardTitle tag="h6" className="text-capitalize d-flex justify-content-between align-items-center">
                                <span>{addr.addressType}</span>
                                {addr.isDefault && <Badge color="secondary">Default</Badge>}
                              </CardTitle>
                              <CardText className="small m-0 text-muted">
                                {addr.addressLine1}
                                {addr.addressLine2 && `, ${addr.addressLine2}`}
                                <br />
                                {addr.city}, {addr.state} - {addr.pinCode}
                                {addr.mobileNumber && (
                                  <>
                                    <br />
                                    Phone: {addr.mobileNumber}
                                  </>
                                )}
                              </CardText>
                              {isSelected && (
                                <div
                                  className="position-absolute"
                                  style={{ right: "12px", bottom: "12px" }}
                                >
                                  <Badge color="danger">Selected</Badge>
                                </div>
                              )}
                            </CardBody>
                          </Card>
                        </Col>
                      )
                    })}
                  </Row>
                )}
              </div>

              {/* Payment Section */}
              <div className="border rounded p-4 shadow-sm bg-white">
                <h4 className="mb-3">Payment Method</h4>
                <div className="d-flex flex-column gap-2">
                  <Label className="d-flex align-items-center border p-3 rounded cursor-pointer m-0">
                    <Input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="me-3"
                    />
                    <div>
                      <strong>Cash on Delivery (COD)</strong>
                      <div className="small text-muted">Pay with cash upon delivery.</div>
                    </div>
                  </Label>
                  <Label className="d-flex align-items-center border p-3 rounded cursor-pointer m-0">
                    <Input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="me-3"
                    />
                    <div>
                      <strong>Credit / Debit Card (Mocked)</strong>
                      <div className="small text-muted">Pay securely using card checkout.</div>
                    </div>
                  </Label>
                </div>
              </div>
            </Col>

            {/* Right Column: Order Summary */}
            <Col lg="4">
              <Card className="shadow-sm border">
                <CardBody>
                  <CardTitle tag="h4" className="border-bottom pb-3">
                    Order Summary
                  </CardTitle>
                  <div className="py-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {cartItems.map((item: any, idx: number) => {
                      const imageUrl = item.product?.imageUrl
                        ? (item.product.imageUrl.startsWith("http")
                            ? item.product.imageUrl
                            : `${SERVER_URL}${item.product.imageUrl}`)
                        : "/model_1.png"
                      return (
                        <div key={idx} className="d-flex align-items-center gap-3 mb-3 border-bottom pb-3">
                          <Image
                            src={imageUrl}
                            alt={item.product?.name || "Product"}
                            width={60}
                            height={60}
                            style={{ objectFit: "contain", background: "#f8f9fa" }}
                            className="rounded"
                          />
                          <div className="flex-grow-1">
                            <h6 className="m-0 text-truncate" style={{ maxWidth: "180px" }}>
                              {item.product?.name}
                            </h6>
                             <span className="small text-muted">
                               Qty: {item.quantity} × {formatPrice(item.product?.price)}
                             </span>
                          </div>
                           <span className="font-weight-bold">
                             {formatPrice((item.product?.price || 0) * item.quantity)}
                           </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Coupon Code Input */}
                  <div className="py-3 border-bottom">
                    <h6 className="mb-2">Have a Coupon?</h6>
                    {appliedCoupon ? (
                      <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded border border-success">
                        <div>
                          <span className="text-success font-weight-bold">
                            {appliedCoupon.code}
                          </span>
                          <div className="small text-muted">
                            Discount: {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `₹${appliedCoupon.discountValue}`}
                          </div>
                        </div>
                        <Button color="link" className="text-danger p-0 text-decoration-none" onClick={handleRemoveCoupon}>
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="d-flex gap-2 align-items-center">
                          <Input
                            type="text"
                            placeholder="Enter Coupon Code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            size="sm"
                            className="flex-grow-1"
                          />
                          {couponLoading && (
                            <span className="small text-muted style={{ minWidth: '70px' }}">
                              Checking...
                            </span>
                          )}
                        </div>
                        {couponError && <div className="text-danger small mt-1">{couponError}</div>}
                      </div>
                    )}
                  </div>

                   <div className="d-flex justify-content-between py-2 border-bottom">
                     <span className="text-muted">Subtotal</span>
                     <span>{formatPrice(subtotal)}</span>
                   </div>
                   <div className="d-flex justify-content-between py-2 border-bottom">
                     <span className="text-muted">Shipping</span>
                     <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                   </div>
                   {discountAmount > 0 && (
                     <div className="d-flex justify-content-between py-2 border-bottom text-success font-weight-bold">
                       <span>Discount ({appliedCoupon?.code})</span>
                       <span>-{formatPrice(discountAmount)}</span>
                     </div>
                   )}
                   <div className="d-flex justify-content-between py-3 font-weight-bold h5">
                     <span>Total</span>
                     <span className="text-danger">{formatPrice(total)}</span>
                   </div>

                  <Button
                    color="danger"
                    size="lg"
                    className="w-100 text-uppercase mt-2"
                    disabled={loading || !selectedAddressId}
                    onClick={handlePlaceOrderSubmit}
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </Container>
  )
}

export default CheckoutPage
