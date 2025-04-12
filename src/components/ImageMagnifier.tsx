"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ImageMagnifierProps {
  src: string
  width?: number
  height?: number
  magnifierHeight?: number
  magnifierWidth?: number
  zoomLevel?: number
  alt: string
}

const ImageMagnifier = ({
  src,
  width = 400,
  height = 400,
  magnifierHeight = 150,
  magnifierWidth = 150,
  zoomLevel = 2.5,
  alt,
}: ImageMagnifierProps) => {
  const [showZoom, setShowZoom] = useState(false)
  const [[imgWidth, imgHeight], setImgSize] = useState([0, 0])
  const [[x, y], setXY] = useState([0, 0])
  const imgRef = useRef<HTMLImageElement>(null)

  // Check if device is mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Update image size when it loads
  useEffect(() => {
    const updateImgSize = () => {
      if (imgRef.current) {
        const { naturalWidth, naturalHeight, width, height } = imgRef.current
        setImgSize([width, height])
      }
    }

    // Set size on load
    if (imgRef.current) {
      if (imgRef.current.complete) {
        updateImgSize()
      } else {
        imgRef.current.addEventListener("load", updateImgSize)
        return () => {
          imgRef.current?.removeEventListener("load", updateImgSize)
        }
      }
    }
  }, [src])

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current || isMobile) return

    // Get element bounds
    const { left, top, width, height } = imgRef.current.getBoundingClientRect()

    // Calculate cursor position relative to the image
    const x = Math.max(0, Math.min(1, (e.clientX - left) / width))
    const y = Math.max(0, Math.min(1, (e.clientY - top) / height))

    setXY([x, y])
  }

  // Handle touch movement
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imgRef.current || !isMobile) return
    e.preventDefault() // Prevent scrolling

    const touch = e.touches[0]

    // Get element bounds
    const { left, top, width, height } = imgRef.current.getBoundingClientRect()

    // Calculate touch position relative to the image
    const x = Math.max(0, Math.min(1, (touch.clientX - left) / width))
    const y = Math.max(0, Math.min(1, (touch.clientY - top) / height))

    setXY([x, y])
  }

  // Handle mouse enter/leave
  const handleMouseEnter = () => {
    if (!isMobile) setShowZoom(true)
  }

  const handleMouseLeave = () => {
    setShowZoom(false)
  }

  // Handle touch start/end
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isMobile) {
      const touch = e.touches[0]

      // Get element bounds
      const { left, top, width, height } = imgRef.current!.getBoundingClientRect()

      // Calculate touch position relative to the image
      const x = Math.max(0, Math.min(1, (touch.clientX - left) / width))
      const y = Math.max(0, Math.min(1, (touch.clientY - top) / height))

      setXY([x, y])
      setShowZoom(true)
    }
  }

  const handleTouchEnd = () => {
    setShowZoom(false)
  }

  return (
    <div className="relative w-full h-full">
      {/* Main product image */}
      <div
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <img ref={imgRef} src={src || "/placeholder.svg"} alt={alt} className="w-full h-full object-contain" />
      </div>

      {/* Zoom container */}
      {showZoom && (
        <div
          className="absolute z-10 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-md"
          style={{
            width: `${magnifierWidth}px`,
            height: `${magnifierHeight}px`,
            top: isMobile ? `calc(100% + 10px)` : "10px",
            right: isMobile ? "auto" : "10px",
            left: isMobile ? "50%" : "auto",
            transform: isMobile ? "translateX(-50%)" : "none",
          }}
        >
          <img
            src={src || "/placeholder.svg"}
            alt={`${alt} zoomed`}
            style={{
              position: "absolute",
              width: `${imgWidth * zoomLevel}px`,
              height: `${imgHeight * zoomLevel}px`,
              maxWidth: "none",
              maxHeight: "none",
              left: `${magnifierWidth / 2 - x * imgWidth * zoomLevel}px`,
              top: `${magnifierHeight / 2 - y * imgHeight * zoomLevel}px`,
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ImageMagnifier
