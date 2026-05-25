import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website',
  productData = null 
}) => {
  const siteName = 'Axansh Store';
  const fullTitle = `${title} | ${siteName}`;
  const canonicalUrl = url || window.location.href;

  // JSON-LD Structured Data
  let jsonLd = null;

  if (productData) {
    jsonLd = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": productData.title,
      "image": [productData.image, ...(productData.images || [])],
      "description": productData.description || description,
      "sku": productData.id,
      "brand": {
        "@type": "Brand",
        "name": productData.brand || siteName
      },
      "offers": {
        "@type": "Offer",
        "url": canonicalUrl,
        "priceCurrency": "INR",
        "price": productData.discountPrice || productData.price,
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": productData.seller || siteName
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": productData.rating || "4.5",
        "reviewCount": productData.reviewCount || "100"
      }
    };
  }

  return (
    <Helmet>
      {/* 🔴 Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* 🔴 Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={siteName} />

      {/* 🔴 Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* 🔴 JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

