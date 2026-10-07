const ORIGIN = "https://valinorsystems.co.uk";

/**
 * The entity graph behind the brand query: who Valinor Systems is, its legal
 * form, and the profiles that corroborate it. Rendered from the homepage only
 * — the gated routes have no business carrying it. The payload is a static
 * literal; the < escape is Next's own guard for inline JSON-LD.
 *
 * ProfessionalService rides alongside Organization so the UK signals (region,
 * areaServed) carry weight on google.co.uk: the brand query is contested by a
 * New York firm on the same name, and geography is the axis we win on. The
 * postal address is deliberately region-only — the GBP listing hides the
 * street as a service-area business, and the two must not disagree.
 */
const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${ORIGIN}/#organization`,
      name: "Valinor Systems",
      alternateName: "Valinor",
      legalName: "Valinor Systems Ltd",
      url: ORIGIN,
      logo: `${ORIGIN}/icons/icon-512.png`,
      image: `${ORIGIN}/icons/icon-512.png`,
      email: "hello@valinorsystems.co.uk",
      description:
        "Valinor Systems is a UK web design and SEO studio. We build fast, high-converting websites and run the Google Ads that grow them.",
      foundingDate: "2026-07-02",
      identifier: {
        "@type": "PropertyValue",
        name: "Companies House company number",
        value: "17314244",
      },
      address: {
        "@type": "PostalAddress",
        addressRegion: "Hertfordshire",
        addressCountry: "GB",
      },
      areaServed: [
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Canada" },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "hello@valinorsystems.co.uk",
        areaServed: ["GB", "CA"],
        availableLanguage: "English",
      },
      knowsAbout: [
        "Web design",
        "Web development",
        "Search engine optimisation",
        "Google Ads",
        "Conversion rate optimisation",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Web design and development",
              description:
                "Design and build of fast, high-converting websites, managed end to end.",
              provider: { "@id": `${ORIGIN}/#organization` },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Search engine optimisation",
              description:
                "Technical and content SEO to grow organic search visibility.",
              provider: { "@id": `${ORIGIN}/#organization` },
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Google Ads management",
              description:
                "Google Search advertising campaigns built and managed for return on spend.",
              provider: { "@id": `${ORIGIN}/#organization` },
            },
          },
        ],
      },
      sameAs: [
        "https://find-and-update.company-information.service.gov.uk/company/17314244",
        "https://www.linkedin.com/company/valinorsystems/",
        "https://www.instagram.com/officialvalinorsystems/",
        "https://www.facebook.com/valinorsystems",
        "https://share.google/C3hrPq4nb2n7pRXK8",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${ORIGIN}/#website`,
      name: "Valinor Systems",
      alternateName: "Valinor",
      url: ORIGIN,
      publisher: { "@id": `${ORIGIN}/#organization` },
    },
  ],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
