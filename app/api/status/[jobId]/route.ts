import { type NextRequest, NextResponse } from "next/server"

// Access the same in-memory storage
declare global {
  var processingJobs: Map<string, any>
}

if (!global.processingJobs) {
  global.processingJobs = new Map()
}

export async function GET(request: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    const { jobId } = params

    // In a real app, you'd fetch from a database or external service
    const job = global.processingJobs.get(jobId)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({
      status: job.status,
      progress: job.progress,
      outputUrl: job.outputUrl || null,
    })
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 })
  }
}
