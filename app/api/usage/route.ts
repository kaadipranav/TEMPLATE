import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Usage tracking coming soon" },
    { status: 501 }
  )
}

