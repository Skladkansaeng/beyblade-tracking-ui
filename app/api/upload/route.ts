import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("video") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create FormData for external API
    const externalFormData = new FormData()
    externalFormData.append("file", file)

    // Send to external Beyblade detection API
    const response = await axios.post("http://183.90.168.37:8000/beyblade-detection", externalFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 300000, // 5 minute timeout for video processing
    })

    // Generate a job ID for tracking
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: true,
      jobId,
      filename: file.name,
      size: file.size,
      message: "Video launched into Beyblade detection arena!",
      detectionResult: response.data,
    })
  } catch (error) {
    console.error("Upload error:", error)

    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        return NextResponse.json(
          {
            error: "Battle timeout! The arena took too long to respond.",
          },
          { status: 408 },
        )
      }
      if (error.response) {
        return NextResponse.json(
          {
            error: `Arena rejected the battle: ${error.response.status} ${error.response.statusText}`,
          },
          { status: error.response.status },
        )
      }
      if (error.request) {
        return NextResponse.json(
          {
            error: "Cannot reach the battle arena! Check your connection.",
          },
          { status: 503 },
        )
      }
    }

    return NextResponse.json(
      {
        error: "Launch failed! Prepare for retry!",
      },
      { status: 500 },
    )
  }
}
