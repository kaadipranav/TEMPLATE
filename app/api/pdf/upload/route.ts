import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      )
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "uploads", userId)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${file.name}`
    const filepath = join(uploadsDir, filename)

    await writeFile(filepath, buffer)

    return NextResponse.json({
      success: true,
      filename,
      originalName: file.name,
    })
  } catch (error: any) {
    console.error("Error uploading PDF:", error)
    return NextResponse.json(
      { error: "Failed to upload file", message: error.message },
      { status: 500 }
    )
  }
}

