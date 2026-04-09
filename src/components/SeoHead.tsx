import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://rushikesh-portfolio-delta.vercel.app';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-preview.png`;
const SITE_NAME = 'Rushikesh Kanbargi';

interface SeoHeadProps {
  title: string;
  description: string;
  /** Path only, e.g. "/tools/json-formatter". Defaults to "/" */
  path?: string;
  ogImage?: string;
  /** JSON-LD schema object(s) to inject */
  schema?: object | object[];
  noIndex?: boolean;
}

export default function SeoHead({
  title,
  description,
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
  schema,
  noIndex = false,
}: SeoHeadProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonical = `${BASE_URL}${path}`;

  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      }
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={`${SITE_NAME} Portfolio`} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured data */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
