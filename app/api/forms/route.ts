import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { formData, publishData } = await request.json();

    // Validate required fields
    if (!formData || !formData.topic || !formData.description) {
      return NextResponse.json(
        { message: "Missing required form data" },
        { status: 400 }
      );
    }

    // Create the form in the database
    const form = await prisma.form.create({
      data: {
        userId: "MkvKcBYQf15C2x6mrdeU0dUpo1CDCa0q",
        topic: formData.topic,
        description: formData.description,
        categories: Array.isArray(formData.categories)
          ? formData.categories.join(",")
          : formData.categories || "",
        status: "active",
        submissions: 0,
        accessMode: publishData?.shareSetting || "private",
        fields: {
          create: formData.fields.map((field: any) => {
            // Get options from either selections or options array
            const fieldOptions = field.selections || field.options || [];

            return {
              label: field.label,
              type: field.type,
              category: field.category || "",
              required: field.required,
              // Use the set operator for array fields
              ...(fieldOptions.length > 0 ? { options: fieldOptions } : []),
            };
          }),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Form created successfully",
      formId: form.id,
    });
  } catch (error: any) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create form" },
      { status: 500 }
    );
  }
}
