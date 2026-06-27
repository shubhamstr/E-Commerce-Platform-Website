/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from "react"
import { Card, CardBody, CardTitle, CardSubtitle, Button } from "reactstrap"
import Image from "next/image"
import styles from "./product.module.css"
import { SERVER_URL } from "../../utils/constants"

const ProductCard = ({ index, product, screen }: any) => {
  const imageUrl = product.imageUrl
    ? (product.imageUrl.startsWith("http") ? product.imageUrl : `${SERVER_URL}${product.imageUrl}`)
    : (product.image || "/model_1.png")

  return (
    <Card
      key={index}
      style={{
        width: screen === "shop" ? "24rem" : "18rem",
      }}
    >
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
          <Button color="primary" size="sm" outline>
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
