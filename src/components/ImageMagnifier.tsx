// components/ImageMagnifier.tsx
import React, { useState, useRef } from 'react';

interface ImageMagnifierProps {
  src: string;
  width: number;
  height: number;
  magnifierSize?: number;
  zoomLevel?: number;
  alt?: string;
}

interface MousePosition {
  x: number;
  y: number;
}

const ImageMagnifier: React.FC<ImageMagnifierProps> = ({
  src,
  width,
  height,
  magnifierSize = 200,
  zoomLevel = 2.5,
  alt = "Product image"
}) => {
  const [showMagnifier, setShowMagnifier] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = (): void => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = (): void => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>): void => {
    if (!imgRef.current) return;
    
    // Get the image's position relative to the viewport
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the image
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Update mouse position state
    setMousePosition({ x, y });
  };

  // Calculate the magnifier position and background position
  const getMagnifierStyle = (): React.CSSProperties => {
    const { x, y } = mousePosition;
    
    // Calculate the background position for the zoomed effect
    const backgroundX = (x / width) * 100;
    const backgroundY = (y / height) * 100;
    
    // Calculate magnifier position, adjusted to keep it within bounds
    const magnifierTop = y - magnifierSize / 2;
    
    return {
      position: 'absolute',
      left: `${width + 20}px`, // Position on the opposite side
      top: `${Math.max(0, Math.min(height - magnifierSize, magnifierTop))}px`,
      width: `${magnifierSize}px`,
      height: `${magnifierSize}px`,
      backgroundImage: `url(${src})`,
      backgroundPosition: `${backgroundX}% ${backgroundY}%`,
      backgroundSize: `${width * zoomLevel}px ${height * zoomLevel}px`,
      backgroundRepeat: 'no-repeat',
      border: '1px solid #ddd',
      borderRadius: '4px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      pointerEvents: 'none',
      zIndex: 9999999,
    };
  };

  return (
    <>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        // width={width}
        // height={height}
        className="cursor-crosshair w-full h-full object-cover bg-inherit"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      />
      {showMagnifier && (
        <div style={getMagnifierStyle()} />
      )}
    </>
  );
};

export default ImageMagnifier;