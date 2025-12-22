import { NextRequest, NextResponse } from "next/server";
import { fetchAPI } from "@/utils/fetch-api";
import { getStrapiURL } from "@/utils/get-strapi-url";

const BASE_URL = getStrapiURL();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, exhibitionId } = body;

    if (!name || !email || !exhibitionId) {
      return NextResponse.json(
        { error: "Name, email, and exhibitionId are required" },
        { status: 400 }
      );
    }

    const strapiResponse = await fetchAPI(`${BASE_URL}/api/bookings`, {
      method: "POST",
      body: {
        data: {
          name,
          email,
          exhibition: exhibitionId,
        },
      },
    });

    if (strapiResponse.error) {
      return NextResponse.json(
        { error: strapiResponse.error.message || "Failed to create booking" },
        { status: strapiResponse.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: strapiResponse.data,
      emailSent: false,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

