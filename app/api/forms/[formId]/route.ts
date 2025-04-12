import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";

type GetParams = Promise<{ formId: string }>;
export const GET = async function (
  request: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { formId } = await params;

    if (!formId) {
      return NextResponse.json(
        { message: "Form ID is required" },
        { status: 400 }
      );
    }

    const form = await db.form.findUnique({
      where: {
        id: formId,
      },
      include: {
        fields: true,
      },
    });

    if (!form) {
      return NextResponse.json({ message: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error: any) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch form" },
      { status: 500 }
    );
  }
};
