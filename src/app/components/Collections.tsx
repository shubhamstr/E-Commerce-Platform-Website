/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect, useState } from "react"
import { Button, Col, Container, Row, Spinner } from "reactstrap"
import { useRouter } from "next/navigation"
import styles from "./collection.module.css"
import { getAllCategories } from "../../services/categoryService"
import { SERVER_URL } from "../../utils/constants"

const Collections = () => {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories({
          params: { page: 1, limit: 12, isFeatured: true }
        })
        if (res.data.success) {
          setCategories(res.data.data.records || [])
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <Container fluid="sm">
      <Row xs="1" className="py-5">
        <Col>
          <h4 className="text-black text-left text-uppercase fw-medium border-start border-primary border-4 px-3">
            Discover the Collections
          </h4>
        </Col>
      </Row>
      {loading ? (
        <Row className="py-5 justify-content-center">
          <Spinner color="primary" />
        </Row>
      ) : categories.length === 0 ? (
        <Row className="py-5 justify-content-center">
          <Col className="text-center text-muted">
            <p>No collections found.</p>
          </Col>
        </Row>
      ) : (
        <Row xs="1" sm="2" md="4" className="pb-5 g-4">
          {categories.map((category) => {
            const imageUrl = category.imageUrl
              ? `${SERVER_URL}${category.imageUrl}`
              : "/model_4.png"
            return (
              <Col key={category.id}>
                <div
                  className={styles.collectionCard}
                  style={{ backgroundImage: `url(${imageUrl})` }}
                >
                  <div className={styles.collectionOverlay} />
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      router.push(`/shop?category=${category.id}`)
                    }}
                    className={`position-absolute top-50 start-50 ${styles.collectionBtn}`}
                  >
                    {category.name} <small className={styles.smallText}>{category.productCount || 0} items</small>
                  </Button>
                </div>
              </Col>
            )
          })}
        </Row>
      )}
    </Container>
  )
}

export default Collections
