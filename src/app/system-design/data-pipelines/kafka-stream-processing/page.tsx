"use client"

import { PipelineDetailPage } from "@/components/system-design/data-pipelines/pipeline-detail-page"
import { getPipelineArchitectureById } from "@/lib/system-design-data"
import { notFound } from "next/navigation"

export default function KafkaStreamProcessingPage() {
  const architecture = getPipelineArchitectureById("kafka-stream-processing")
  
  if (!architecture) {
    notFound()
  }

  return <PipelineDetailPage architecture={architecture} />
}
