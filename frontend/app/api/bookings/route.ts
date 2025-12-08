import { NextRequest, NextResponse } from "next/server";
import { fetchAPI } from "@/utils/fetch-api";
import { getStrapiURL } from "@/utils/get-strapi-url";
import emailjs from "@emailjs/nodejs";

const BASE_URL = getStrapiURL();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, exhibitionId } = body;

    if (!name || !email || !exhibitionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let exhibitionResponse = await fetchAPI(
      `${BASE_URL}/api/exhibitions/${exhibitionId}?populate=*`,
      { method: "GET" }
    );

    if (!exhibitionResponse || !exhibitionResponse.data) {
      const allExhibitions = await fetchAPI(
        `${BASE_URL}/api/exhibitions?populate=*`,
        { method: "GET" }
      );
      
      if (allExhibitions && allExhibitions.data) {
        const exhibition = Array.isArray(allExhibitions.data) 
          ? allExhibitions.data.find((e: { id: number; documentId: string }) => 
              e.id === Number(exhibitionId) || e.documentId === exhibitionId
            )
          : null;
        
        if (exhibition) {
          exhibitionResponse = { data: exhibition };
        }
      }
    }

    if (!exhibitionResponse || !exhibitionResponse.data) {
      return NextResponse.json(
        { error: "Exhibition not found" },
        { status: 404 }
      );
    }

    const exhibition = exhibitionResponse.data;

    const bookingResponse = await fetchAPI(
      `${BASE_URL}/api/bookings`,
      {
        method: "POST",
        body: {
          data: {
            name,
            email,
            exhibition: exhibitionId,
          },
        },
      }
    );

    if (!bookingResponse || !bookingResponse.data) {
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (serviceId && templateId && publicKey) {
        const emailMessage = `New booking for exhibition: ${exhibition.title || "Exhibition"}\n\nDate: ${exhibition.date || "N/A"}\nTime: ${exhibition.time || "N/A"}\nLocation: ${exhibition.location || "N/A"}`;
      const emailjsOptions: { publicKey: string; privateKey?: string } = {
        publicKey: publicKey,
      };
      
      if (privateKey) {
        emailjsOptions.privateKey = privateKey;
      }

      let emailSent = false;
      try {
        await emailjs.send(serviceId, templateId, {
          from_name: name,
          from_email: email,
          message: emailMessage,
        }, emailjsOptions);
        emailSent = true;
      } catch (error) {
        console.error("Failed to send booking notification email:", error);
        emailSent = false;
      }

      return NextResponse.json(
        { 
          success: true, 
          data: bookingResponse.data,
          emailSent: emailSent 
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: bookingResponse.data,
        emailSent: false 
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

