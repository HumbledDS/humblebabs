"use client"

import { ArchitectureDetailPage } from "@/components/system-design/architecture-detail-page"
import { getCloudNativeArchitectureById, cloudNativeArchitectures } from "@/lib/cloud-native-data"
import { notFound } from "next/navigation"

export default function KubernetesOrchestrationPage() {
  const architecture = getCloudNativeArchitectureById("kubernetes-orchestration")
  
  if (!architecture) {
    notFound()
  }

  return (
    <ArchitectureDetailPage 
      architecture={architecture}
      allArchitectures={cloudNativeArchitectures}
      backHref="/system-design/cloud-native"
      backLabel="Back to Cloud-Native"
      sectionTitle="Cloud-Native"
    />
  )
}
