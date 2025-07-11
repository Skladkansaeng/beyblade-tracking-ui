import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json()

    if (!videoId) {
      return NextResponse.json({ error: "Video ID required" }, { status: 400 })
    }

    // Since processing is handled by external API, return immediate success
    return NextResponse.json({
      success: true,
      jobId: `job_${Date.now()}`,
      message: "Battle commenced! Processing handled by external arena!",
      status: "completed",
    })
  } catch (error) {
    console.error("Process error:", error)
    return NextResponse.json({ error: "Processing failed to start" }, { status: 500 })
  }
}
