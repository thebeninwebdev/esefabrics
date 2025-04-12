// app/api/og/product/route.tsx

import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productName = searchParams.get('name') || 'Product Name';
  const productPrice = searchParams.get('price') || '#0.00';
  const productImage = searchParams.get('image') || 'https://unsplash.com/photos/a-pair-of-black-t-shirts-hanging-on-a-wooden-hanger-XsP4kDfzeb4'; 

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          width: '100%',
          height: '100%',
          padding: '50px',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <img
          src={productImage}
          alt="Product"
          width="300"
          height="300"
          style={{ objectFit: 'cover', borderRadius: '20px' }}
        />
        <h1 style={{ fontSize: 48, marginTop: '30px' }}>{productName}</h1>
        <p style={{ fontSize: 36, marginTop: '10px', color: 'gray' }}>{productPrice}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
