import React from 'react'
import { Metadata } from 'next'
import ProductComponent from '@/components/product-page';

type Params = { productId?: string };

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const productId = params?.productId;

  // Fetch the product data here
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products?id=${productId}`);
  const product = await res.json();

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: `Only ${product.price}!`,
      images: [
        {
          url: `${process.env.NEXTAUTH_URL}/api/og/product?name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}&image=${encodeURIComponent(product.images[0])}`,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function Page({ params }: any) {
  return (
    <ProductComponent resolvedParams={params} />
  )
}
