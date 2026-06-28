/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from "react"
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Input,
  Row,
  Table,
} from "reactstrap"
import styles from "./cart.module.css"
import Image from "next/image"
import DeleteIcon from "@mui/icons-material/Delete"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { RootState } from "../../store"
import { updateQuantityState, removeFromCartState } from "../../store/slices/cartSlice"
import { updateCartQuantity, removeFromCart } from "../../services/cartService"
import { SERVER_URL } from "../../utils/constants"
import { showSuccess, showError } from "../../utils/toast"
import { formatPrice } from "../../utils/currency"

const CartList = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const cartItems = useSelector((state: RootState) => state.cart.items)

  const handleIncrement = async (productId: number, currentQty: number) => {
    try {
      const newQty = currentQty + 1
      const res = await updateCartQuantity(productId, newQty)
      if (res.data && res.data.success) {
        dispatch(updateQuantityState({ productId, quantity: newQty }))
      } else {
        showError(res.data.message || "Failed to update quantity.")
      }
    } catch (error: any) {
      console.error("Increment error:", error)
      showError(error.response?.data?.message || "Failed to update quantity.")
    }
  }

  const handleDecrement = async (productId: number, currentQty: number) => {
    if (currentQty <= 1) {
      handleRemove(productId)
      return
    }
    try {
      const newQty = currentQty - 1
      const res = await updateCartQuantity(productId, newQty)
      if (res.data && res.data.success) {
        dispatch(updateQuantityState({ productId, quantity: newQty }))
      } else {
        showError(res.data.message || "Failed to update quantity.")
      }
    } catch (error: any) {
      console.error("Decrement error:", error)
      showError(error.response?.data?.message || "Failed to update quantity.")
    }
  }

  const handleRemove = async (productId: number) => {
    try {
      const res = await removeFromCart(productId)
      if (res.data && res.data.success) {
        dispatch(removeFromCartState(productId))
        showSuccess("Product removed from cart.")
      } else {
        showError(res.data.message || "Failed to remove product.")
      }
    } catch (error: any) {
      console.error("Remove error:", error)
      showError(error.response?.data?.message || "Failed to remove product.")
    }
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  )

  return (
    <Container fluid="sm">
      {cartItems.length > 0 ? (
        <Row xs="1" className="mb-3">
          <Col>
            <Table bordered className={styles.cartTable}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((obj: any, index: any) => {
                  const imageUrl = obj.product?.imageUrl
                    ? (obj.product.imageUrl.startsWith("http")
                        ? obj.product.imageUrl
                        : `${SERVER_URL}${obj.product.imageUrl}`)
                    : "/model_1.png"

                  return (
                    <tr key={index}>
                      <td>
                        <Image
                          alt="Sample"
                          src={imageUrl}
                          width={200}
                          height={150}
                          style={{ objectFit: "contain" }}
                          className={styles.bgColor}
                        />
                      </td>
                      <td>{obj.product?.name || "Unknown Product"}</td>
                      <td>{formatPrice(obj.product?.price)}</td>
                      <td>
                        <ButtonGroup>
                          <Button
                            color="danger"
                            onClick={() =>
                              handleDecrement(obj.productId, obj.quantity)
                            }
                          >
                            -
                          </Button>
                          <Input
                            type="text"
                            value={obj.quantity}
                            readOnly
                            className={styles.cartInput}
                          />
                          <Button
                            color="danger"
                            onClick={() =>
                              handleIncrement(obj.productId, obj.quantity)
                            }
                          >
                            +
                          </Button>
                        </ButtonGroup>
                      </td>
                      <td>
                        {formatPrice((obj.product?.price || 0) * obj.quantity)}
                      </td>
                      <td>
                        <Button
                          color="danger"
                          onClick={() => handleRemove(obj.productId)}
                        >
                          <DeleteIcon color="error" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      ) : (
        <Row xs="1" className="mb-3">
          <Col>
            <div
              className={`d-flex flex-wrap gap-5 justify-content-around ${styles.favoriteSection}`}
            >
              <p>You don&apos;t have any products in the cart.</p>
            </div>
          </Col>
        </Row>
      )}

      <Row xs="1" className="mb-3">
        <Col className="d-flex gap-3">
          <Button
            color="danger"
            outline
            className="text-uppercase"
            onClick={() => router.push("/shop")}
          >
            Continue Shopping
          </Button>
        </Col>
      </Row>
      {cartItems.length > 0 && (
        <Row xs="1" sm="2" className="mb-3">
          <Col className="d-flex flex-column" xs="12" sm="8" md="9">
            <h4 className="py-3">Coupon</h4>
            <p>Enter your coupon code if you have one.</p>
            <div className="d-flex gap-3">
              <Input
                type="text"
                placeholder="Coupon Code"
                className={styles.couponInput}
              />
              <Button color="danger">Apply Coupon</Button>
            </div>
          </Col>
          <Col className="" xs="12" sm="4" md="3">
            <h4 className="text-uppercase border-bottom text-end py-3">
              Cart Totals
            </h4>
            <div className="d-flex justify-content-between py-3">
              <p>Subtotal</p>
              <p>{formatPrice(subtotal)}</p>
            </div>
            <div className="d-flex justify-content-between py-3">
              <p>Total</p>
              <p>{formatPrice(subtotal)}</p>
            </div>
            <Button
              color="danger"
              className="text-uppercase w-100"
              onClick={() => {
                if (isAuthenticated) {
                  router.push("/checkout")
                } else {
                  showError("Please login to proceed to checkout.")
                  router.push("/login")
                }
              }}
            >
              Proceed to Checkout
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default CartList
