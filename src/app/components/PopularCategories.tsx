/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect, useState } from "react"
import { Col, Container, Row, Spinner } from "reactstrap"
import { useRouter } from "next/navigation"
import { getAllCategories } from "../../services/categoryService"
import { SERVER_URL } from "../../utils/constants"
import styles from "./popularCategories.module.css"

const PopularCategories = () => {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories({
          params: { page: 1, limit: 20, isFeatured: false }
        })
        if (res.data.success) {
          setCategories(res.data.data.records || [])
        }
      } catch (error) {
        console.error("Error fetching popular categories:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (!loading && categories.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <Container fluid="sm">
        <Row xs="1" className="py-5">
          <Col>
            <h4 className="text-black text-left text-uppercase fw-medium border-start border-primary border-4 px-3">
              Popular Categories
            </h4>
            <p className="text-muted small ps-3 mt-1">Explore all the categories we offer</p>
          </Col>
        </Row>

        {loading ? (
          <Row className="pb-5 justify-content-center">
            <Spinner color="primary" />
          </Row>
        ) : (
          <div className={styles.scrollTrack}>
            {categories.map((category) => {
              const imageUrl = category.imageUrl
                ? `${SERVER_URL}${category.imageUrl}`
                : "/model_4.png"
              return (
                <div
                  key={category.id}
                  className={styles.categoryPill}
                  onClick={() => router.push(`/shop?category=${category.id}`)}
                >
                  <div
                    className={styles.pillImage}
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  >
                    <div className={styles.pillOverlay} />
                  </div>
                  <div className={styles.pillBody}>
                    <span className={styles.pillName}>{category.name}</span>
                    <span className={styles.pillCount}>
                      {category.productCount || 0} items
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div className="pb-5" />
      </Container>
    </div>
  )
}

export default PopularCategories
