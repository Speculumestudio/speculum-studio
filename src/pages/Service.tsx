import { Navigate, useParams } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Seo } from "@/components/Seo";
import { getServiceBySlug } from "@/data/services";

import { ServiceContent } from "@/components/ServiceContent";

const SITE_URL = "https://speculumstudio.com";


export default function Service() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) return <Navigate to="/nosso-estudio" replace />;

  const path = `/servicos/${service.slug}`;
  const serviceUrl = `${SITE_URL}${path}`;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.shortName,
    serviceType: service.shortName,
    description: service.description,
    url: serviceUrl,
    provider: { "@type": "ProfessionalService", name: "Speculum Studio", url: SITE_URL },
    areaServed: { "@type": "Country", name: "Brasil" },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Nosso Estúdio", item: `${SITE_URL}/nosso-estudio` },
      { "@type": "ListItem", position: 3, name: service.shortName, item: serviceUrl },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Seo title={service.seoTitle} description={service.description} path={path} jsonLd={[serviceJsonLd, faqJsonLd, breadcrumbJsonLd]} />
      <Navbar />
      <ServiceContent service={service} />
      <Footer />
    </div>
  );
}
