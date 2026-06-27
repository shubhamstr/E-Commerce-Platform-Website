/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from "react"
import { Card, CardBody, CardTitle, CardSubtitle, Button } from "reactstrap"
import Image from "next/image"
import styles from "./product.module.css"
import { SERVER_URL } from "../../utils/constants"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../store"
import { addToWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice"
import { toggleWishlist } from "../../services/wishlistService"
import { addToCartState } from "../../store/slices/cartSlice"
import { addToCart } from "../../services/cartService"
import { showSuccess, showError } from "../../utils/toast"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"

const ProductCard = ({ index, product, screen }: any) => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items)
  
  const isWishlisted = wishlistItems.some((item: any) => item.productId === product.id)

  const imageUrl = product.imageUrl
    ? (product.imageUrl.startsWith("http") ? product.imageUrl : `${SERVER_URL}${product.imageUrl}`)
    : (product.image || "/model_1.png")

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.id) {
      showError("Product ID is invalid.")
      return
    }

    try {
      const res = await toggleWishlist(product.id)
      if (res.data && res.data.success) {
        if (res.data.action === "added") {
          dispatch(addToWishlist(res.data.data))
          showSuccess(`${product.name || product.title || "Product"} added to wishlist.`)
        } else {
          dispatch(removeFromWishlist(product.id))
          showSuccess(`${product.name || product.title || "Product"} removed from wishlist.`)
        }
      } else {
        showError(res.data.message || "Failed to update wishlist.")
      }
    } catch (error: any) {
      console.error("Wishlist toggle error:", error)
      showError(error.response?.data?.message || "Failed to update wishlist.")
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      showError("Please log in to add products to the cart.")
      return
    }
    if (!product.id) {
      showError("Product ID is invalid.")
      return
    }

    try {
      const res = await addToCart(product.id, 1)
      if (res.data && res.data.success) {
        dispatch(addToCartState(res.data.data))
        showSuccess(`${product.name || product.title || "Product"} added to cart.`)
      } else {
        showError(res.data.message || "Failed to add to cart.")
      }
    } catch (error: any) {
      console.error("Add to cart error:", error)
      showError(error.response?.data?.message || "Failed to add to cart.")
    }
  }

  return (
    <Card
      key={index}
      style={{
        width: screen === "shop" ? "24rem" : "18rem",
        position: "relative",
      }}
    >
      {isAuthenticated && (
        <button
          onClick={handleWishlistToggle}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
            zIndex: 10,
            transition: "transform 0.2s ease, background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)"
            e.currentTarget.style.backgroundColor = "#ffffff"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)"
          }}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {isWishlisted ? (
            <FavoriteIcon style={{ color: "#dc3545", fontSize: "20px" }} />
          ) : (
            <FavoriteBorderIcon style={{ color: "#6c757d", fontSize: "20px" }} />
          )}
        </button>
      )}
      <Image
        alt="Sample"
        src={imageUrl}
        width={screen === "shop" ? 382 : 287}
        height={150}
        style={{ objectFit: "contain" }}
        className={styles.bgColor}
      />
      <CardBody>
        <CardTitle tag="h5">{product.name || product.title}</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h6">
          ${product.price}
        </CardSubtitle>
        {/* <CardText>Some quick example text to build on the card title and make up the bulk of the card‘s content.</CardText> */}
        <div className="d-flex gap-2">
          <Button color="primary" size="sm" outline onClick={handleAddToCart}>
            Add to Cart
          </Button>
          <Button color="danger" size="sm" outline>
            Buy Now
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

export default ProductCard
