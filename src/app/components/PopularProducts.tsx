/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect, useState } from "react"
import { Col, Container, Row, Spinner } from "reactstrap"
import ProductCard from "./ProductCard"
import { getProducts } from "../../services/productService"

const PopularProducts = () => {
  const [productList, setProductList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts({
          params: { page: 1, limit: 6 }
        })
        if (res.data.success) {
          setProductList(res.data.data.records || [])
        }
      } catch (error) {
        console.error("Error fetching popular products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <Container fluid="sm">
      <Row xs="1" className="py-5">
        <Col>
          <h4 className="text-black text-left text-uppercase fw-medium border-start border-primary border-4 px-3">
            Popular Products
          </h4>
        </Col>
      </Row>
      {loading ? (
        <Row className="py-5 justify-content-center">
          <Spinner color="primary" />
        </Row>
      ) : productList.length === 0 ? (
        <Row className="py-5 justify-content-center">
          <Col className="text-center text-muted">
            <p>No products found.</p>
          </Col>
        </Row>
      ) : (
        <div className="d-flex flex-wrap gap-5 justify-content-start pb-5">
          {productList.map((product: any, index: any) => {
            return (
              <ProductCard
                key={product.id || index}
                index={index}
                product={product}
                screen="home"
              />
            )
          })}
        </div>
      )}
    </Container>
  )
}

export default PopularProducts
