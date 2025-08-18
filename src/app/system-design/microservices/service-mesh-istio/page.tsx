"use client"

import { ArchitectureDetailPage } from "@/components/system-design/architecture-detail-page"
import { getMicroserviceArchitectureById, microserviceArchitectures } from "@/lib/microservices-data"
import { notFound } from "next/navigation"

export default function ServiceMeshIstioPage() {
  const architecture = getMicroserviceArchitectureById("service-mesh-istio")
  
  if (!architecture) {
    notFound()
  }

  return (
    <ArchitectureDetailPage 
      architecture={architecture}
      allArchitectures={microserviceArchitectures}
      backHref="/system-design/microservices"
      backLabel="Back to Microservices"
      sectionTitle="Microservices"
    />
  )
}
