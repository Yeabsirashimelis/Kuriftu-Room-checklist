import { PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";
import { json } from "stream/consumers";

type GetParams = Promise<{ formId: string }>;
export const GET = async function (
  request: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const { formId } = await params;

    if (!formId) {
      return new Response(JSON.stringify({ message: "Form ID is required" }), {
        status: 400,
      });
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
      return new Response(JSON.stringify({ message: "Form not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(form), { status: 200 });
  } catch (error: any) {
    console.error("Error fetching form:", error);
    return new Response(
      JSON.stringify({ message: error.message || "Failed to fetch form" }),
      { status: 500 }
    );
  }
};
