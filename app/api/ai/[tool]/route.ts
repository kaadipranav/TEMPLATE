import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { tool: string } }
) {
  return NextResponse.json(
    { error: "AI endpoint coming soon" },
    { status: 501 }
  )
}

