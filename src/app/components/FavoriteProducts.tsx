/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from "react"
import { Col, Container, Row } from "reactstrap"
import ProductCard from "./ProductCard"
import styles from "./favorite.module.css"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const FavoriteProducts = () => {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("ecomToken")
      if (!token && !isAuthenticated) {
        router.push("/login")
      }
    }
  }, [isAuthenticated, router])

  return (
    <Container fluid="sm">
      <Row xs="1" className="mb-3">
        <Col>
          <h3>Wishlist</h3>
        </Col>
      </Row>
      <div className="d-flex flex-wrap gap-5 justify-content-start pb-5">
        {wishlistItems.map((item: any, index: any) => {
          if (!item.product) return null
          return (
            <ProductCard
              key={item.product.id || index}
              index={index}
              product={item.product}
              screen="home"
            />
          )
        })}
      </div>
      {wishlistItems.length === 0 && (
        <div
          className={`d-flex flex-wrap gap-5 justify-content-around ${styles.favoriteSection}`}
        >
          <p>
            You don&apos;t have any products in the wishlist. Go to shop to add
            favorite products.
          </p>
        </div>
      )}
    </Container>
  )
}

export default FavoriteProducts
