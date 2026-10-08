import { BOOKING_URL } from "@/lib/booking";

export const ORIGIN = "https://valinorsystems.co.uk";
export const CONTACT_EMAIL = "hello@valinorsystems.co.uk";
export const ORGANIZATION_ID = `${ORIGIN}/#organization`;
export const WEBSITE_ID = `${ORIGIN}/#website`;
const SHARE_IMAGE = `${ORIGIN}/opengraph-image`;
const LOGO = {
  "@type": "ImageObject",
  "@id": `${ORIGIN}/#logo`,
  url: `${ORIGIN}/assets/brand/valinor-mark-transparent.png`,
  width: 1338,
  height: 1175,
  caption: "Valinor Systems",
};
export const SITE_DESCRIPTION =
  "We improve your search visibility, your presence in AI search, your website and your Google Ads. Valinor Systems is a UK SEO and web design studio.";

type ServiceInput = { name: string; description: string; path: string; serviceType: string; monthlyPrice?: number };

const service = (name: string, description: string) => ({
  "@type": "Offer",
  itemOffered: { "@type": "Service", name, description, provider: { "@id": ORGANIZATION_ID } },
});

/**
 * The entity graph behind the brand query: who Valinor Systems is, its legal
 * form, and the profiles that corroborate it. Rendered from the homepage only;
 * every other page refers back to it by @id.
 *
 * ProfessionalService rides alongside Organization so the UK signals (region,
 * areaServed) carry weight on google.co.uk. The postal address is deliberately
 * region-only — the GBP listing hides the street as a service-area business,
 * and the two must not disagree.
 */
export const organizationGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": ORGANIZATION_ID,
      name: "Valinor Systems",
      alternateName: "Valinor",
      legalName: "Valinor Systems Ltd",
      url: ORIGIN,
      logo: LOGO,
      email: CONTACT_EMAIL,
      image: SHARE_IMAGE,
      description: SITE_DESCRIPTION,
      foundingDate: "2026-07-02",
      identifier: { "@type": "PropertyValue", name: "Companies House company number", value: "17314244" },
      address: { "@type": "PostalAddress", addressRegion: "Hertfordshire", addressCountry: "GB" },
      areaServed: [
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Canada" },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: CONTACT_EMAIL,
        url: BOOKING_URL,
        areaServed: ["GB", "CA"],
        availableLanguage: "English",
      },
      knowsAbout: [
        "Search engine optimisation",
        "AI search visibility",
        "Answer engine optimisation",
        "Web design",
        "Web development",
        "Google Ads",
        "Google Ad Grants",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: [
          service("SEO and AI search", "Useful content, technical SEO, authority work and AI search visibility, with website improvements."),
          service("Web design", "Clear, professional websites designed and built around the business and the way its customers enquire or book."),
          service("Google Ads management", "Targeted Google Search campaigns with conversion tracking and regular review."),
          service("Google Ad Grants", "Setup and ongoing campaign support for eligible charities using Google Ad Grants."),
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
      "@id": WEBSITE_ID,
      name: "Valinor Systems",
      alternateName: "Valinor",
      url: ORIGIN,
      inLanguage: "en-GB",
      publisher: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "WebPage",
      "@id": `${ORIGIN}/#webpage`,
      url: ORIGIN,
      name: "Valinor Systems | SEO, AI Search and Web Design",
      description: SITE_DESCRIPTION,
      inLanguage: "en-GB",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
      primaryImageOfPage: { "@type": "ImageObject", url: SHARE_IMAGE, width: 1200, height: 630 },
    },
  ],
};

type Faq = { question: string; answer: string };
type PageInput = { name: string; description: string; path: string; type?: "WebPage" | "ContactPage"; faqs?: readonly Faq[] };

export function serviceSchema({ name, description, path, serviceType, monthlyPrice }: ServiceInput) {
  return {
    "@type": "Service",
    "@id": `${ORIGIN}${path}#service`,
    name,
    serviceType,
    description,
    url: `${ORIGIN}${path}`,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: { "@type": "Country", name: "United Kingdom" },
    mainEntityOfPage: { "@id": `${ORIGIN}${path}#webpage` },
    ...(monthlyPrice && {
      offers: {
        "@type": "Offer",
        url: `${ORIGIN}/pricing`,
        priceCurrency: "GBP",
        price: monthlyPrice,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: monthlyPrice,
          priceCurrency: "GBP",
          unitCode: "MON",
          billingDuration: 1,
        },
      },
    }),
  };
}

/**
 * The graph for one inner page. Search engines and AI crawlers read each page
 * on its own and do not follow an @id to the homepage, so every page carries
 * a short organisation and website entry alongside its own WebPage and
 * breadcrumb. Where a page has questions, the WebPage is also an FAQPage and
 * the answers must be the same words the visitor can read on the page.
 */
export function pageGraph({ name, description, path, type = "WebPage", faqs }: PageInput, ...nodes: object[]) {
  const url = `${ORIGIN}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": ["Organization", "ProfessionalService"], "@id": ORGANIZATION_ID, name: "Valinor Systems", url: ORIGIN, logo: LOGO, email: CONTACT_EMAIL },
      { "@type": "WebSite", "@id": WEBSITE_ID, name: "Valinor Systems", url: ORIGIN, inLanguage: "en-GB", publisher: { "@id": ORGANIZATION_ID } },
      {
        "@type": faqs ? [type, "FAQPage"] : type,
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: "en-GB",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORGANIZATION_ID },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        primaryImageOfPage: { "@type": "ImageObject", url: SHARE_IMAGE, width: 1200, height: 630 },
        ...(faqs && {
          mainEntity: faqs.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: ORIGIN },
          { "@type": "ListItem", position: 2, name },
        ],
      },
      ...nodes,
    ],
  };
}
