"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { z } from "zod";

// Updated schema to include array type and configuration
const fieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  type: z.enum([
    "text",
    "number",
    "email",
    "date",
    "checkbox",
    "selection",
    "array",
  ]),
  category: z.string(),
  required: z.boolean(),
  options: z.array(z.string()).optional(), // For backward compatibility
  selections: z.array(z.string()).optional(), // New field for selection options
  arrayConfig: z
    .object({
      itemType: z.enum(["string", "number", "email"]),
      minItems: z.number().min(0).optional(),
      maxItems: z.number().min(1).optional(),
    })
    .optional(),
});

const formSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  description: z.string().min(1, "Description is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  fields: z.array(fieldSchema),
});

type Field = z.infer<typeof fieldSchema>;
type FormData = z.infer<typeof formSchema>;

export default function ReviewStep() {
  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== "undefined") {
      const storedData = JSON.parse(
        localStorage.getItem("form_data") || "null"
      );
      return storedData
        ? {
            topic: storedData.topic || "",
            description: storedData.description || "",
            categories: Array.isArray(storedData.categories)
              ? storedData.categories
              : storedData.categories
              ? [storedData.categories] // Handle legacy string format
              : [],
            fields: storedData.fields || [],
          }
        : {
            topic: "",
            description: "",
            categories: [],
            fields: [],
          };
    }
    return { topic: "", description: "", categories: [], fields: [] };
  });

  useEffect(() => {
    localStorage.setItem("form_data", JSON.stringify(formData));
  }, [formData]);

  const deleteField = (index: number) => {
    setFormData((prev) => {
      const newFields = prev.fields.filter((_, i) => i !== index);
      return { ...prev, fields: newFields };
    });
  };

  // Helper function to get selection options from either options or selections array
  const getSelectionOptions = (field: Field) => {
    if (field.selections && field.selections.length > 0) {
      return field.selections;
    }
    return field.options || [];
  };

  // Helper function to get a readable name for array item types
  const getArrayItemTypeName = (type: string) => {
    switch (type) {
      case "string":
        return "Text";
      case "number":
        return "Number";
      case "email":
        return "Email";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Review</h2>
      <div className="space-y-4">
        <h3 className="font-medium">Form Details</h3>
        <div>
          <span className="font-medium">Topic: </span>
          <span className="text-gray-600">{formData.topic}</span>
        </div>
        <div>
          <span className="font-medium">Description: </span>
          <span className="text-gray-600">{formData.description}</span>
        </div>
        <div>
          <span className="font-medium">Categories: </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {formData.categories.map((category, index) => (
              <Badge key={index} variant="outline">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-4">
        <h3 className="font-medium">Generated Fields</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {formData.fields.map((field, index) => (
            <div key={index} className="border rounded-md p-3 flex flex-col">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{field.label}</div>
                  <div className="text-xs text-gray-500 flex gap-1">
                    <span>[{field.type}]</span>
                    {field.required && (
                      <span className="text-red-500">*required</span>
                    )}
                  </div>
                  {field.category && (
                    <div className="text-xs text-gray-500 mt-1">
                      Category: {field.category}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => deleteField(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Display selection options if field type is selection */}
              {field.type === "selection" && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">Options:</div>
                  <div className="flex flex-wrap gap-1">
                    {getSelectionOptions(field).map((option, optIdx) => (
                      <Badge
                        key={optIdx}
                        variant="secondary"
                        className="text-xs"
                      >
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Display array configuration if field type is array */}
              {field.type === "array" && field.arrayConfig && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">
                    Array Configuration:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      Item Type:{" "}
                      {getArrayItemTypeName(field.arrayConfig.itemType)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Min: {field.arrayConfig.minItems || 1}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Max: {field.arrayConfig.maxItems || 10}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="pt-4 flex justify-between">
        <Button className="bg-[#4A90E2] hover:bg-[#4A90E2]">
          Back: Form Generator
        </Button>
        <Button className="bg-[#4A90E2] hover:bg-[#4A90E2]">
          Next: Publish
        </Button>
      </div>
    </div>
  );
}
