"use client"

import { ArchitectureDetailPage } from "@/components/system-design/architecture-detail-page"
import { getAIMLArchitectureById, aiMLArchitectures } from "@/lib/ai-ml-data"
import { notFound } from "next/navigation"

export default function FeatureStoreArchitecturePage() {
  const architecture = getAIMLArchitectureById("feature-store-architecture")
  
  if (!architecture) {
    notFound()
  }

  return (
    <ArchitectureDetailPage 
      architecture={architecture}
      allArchitectures={aiMLArchitectures}
      backHref="/system-design/ai-ml"
      backLabel="Back to AI/ML"
      sectionTitle="AI/ML"
    />
  )
}
