"use client"
import React, { useState, useEffect } from "react"
import Image, { ImageProps } from "next/image"
import { getImageUrl } from "../../utils/image"

export interface ProductImageProps extends Omit<ImageProps, "src"> {
  src?: string | null
  fallback?: string
}

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt = "Product",
  fallback = "/model_1.png",
  className,
  style,
  width,
  height,
  fill,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => getImageUrl(src, fallback))

  useEffect(() => {
    setImgSrc(getImageUrl(src, fallback))
  }, [src, fallback])

  return (
    <Image
      {...props}
      alt={alt}
      src={imgSrc}
      unoptimized
      width={width}
      height={height}
      fill={fill}
      className={className}
      style={style}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback)
        }
      }}
    />
  )
}

export default ProductImage

