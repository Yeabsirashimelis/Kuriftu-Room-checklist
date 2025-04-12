"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

// Define schemas for form data to ensure type safety
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
  options: z.array(z.string()).optional(),
  selections: z.array(z.string()).optional(),
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

const publishSchema = z.object({
  accessCode: z.string().optional(),
  shareSetting: z.enum(["public", "private"]),
  responseDraft: z.string().optional(),
});

type PublishData = z.infer<typeof publishSchema>;
type FormData = z.infer<typeof formSchema>;

export default function PublishStep() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("setting");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [publishData, setPublishData] = useState<PublishData>(() => {
    if (typeof window !== "undefined") {
      return (
        JSON.parse(localStorage.getItem("publish_data") || "null") || {
          shareSetting: "private",
          responseDraft: "",
          accessCode: "",
        }
      );
    }
    return { shareSetting: "private", responseDraft: "", accessCode: "" };
  });

  // For array field preview
  const [arrayInputs, setArrayInputs] = useState<Record<string, string[]>>({});
  const [newArrayItem, setNewArrayItem] = useState<Record<string, string>>({});

  // Load form data for preview
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = JSON.parse(
        localStorage.getItem("form_data") || "null"
      );
      if (storedData) {
        setFormData(storedData);

        // Initialize array inputs for preview
        const initialArrayInputs: Record<string, string[]> = {};
        const initialNewArrayItem: Record<string, string> = {};

        if (storedData.fields) {
          storedData.fields.forEach((field: any, index: number) => {
            if (field.type === "array") {
              initialArrayInputs[`field-${index}`] = [];
              initialNewArrayItem[`field-${index}`] = "";
            }
          });
        }

        setArrayInputs(initialArrayInputs);
        setNewArrayItem(initialNewArrayItem);
      }
    }
  }, []);

  // Save publish data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("publish_data", JSON.stringify(publishData));
  }, [publishData]);

  const handlePublishChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPublishData((prev) => ({ ...prev, [name]: value }));
  };

  const addArrayItem = (fieldId: string, type: string) => {
    const value = newArrayItem[fieldId];
    if (!value.trim()) return;

    // Validate based on type
    if (type === "email" && !value.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (type === "number" && isNaN(Number(value))) {
      toast.error("Please enter a valid number");
      return;
    }

    setArrayInputs((prev) => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || []), value],
    }));

    setNewArrayItem((prev) => ({
      ...prev,
      [fieldId]: "",
    }));
  };

  const removeArrayItem = (fieldId: string, index: number) => {
    setArrayInputs((prev) => ({
      ...prev,
      [fieldId]: prev[fieldId].filter((_, i) => i !== index),
    }));
  };

  const saveToDatabase = async () => {
    try {
      setIsLoading(true);

      // Prepare data for API
      const apiData = {
        formData,
        publishData,
      };

      // Validate form data before submission
      if (!formData || formData.fields.length === 0) {
        toast.error("Form has no fields. Please add at least one field.");
        setIsLoading(false);
        return;
      }

      // Check if selection fields have options
      const invalidSelectionFields = formData.fields.filter(
        (field) =>
          field.type === "selection" &&
          (!field.selections || field.selections.length === 0) &&
          (!field.options || field.options.length === 0)
      );

      if (invalidSelectionFields.length > 0) {
        toast.error("Selection fields must have at least one option.");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/forms", {
        method: "POST",
        body: JSON.stringify(apiData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to publish form.");
      }

      toast.success("Form Published Successfully");
      // Optionally clear form data after successful publish
      // localStorage.removeItem("form_data");
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while publishing the form."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Simple form preview component
  const FormPreview = () => {
    if (!formData) return <div>No form data available</div>;

    return (
      <div className="space-y-6 p-4 border rounded-md">
        <h3 className="text-lg font-bold">{formData.topic}</h3>
        <p className="text-sm text-gray-600">{formData.description}</p>

        <div className="space-y-4">
          {formData.fields.map((field, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`preview-${index}`}>
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </Label>

              {field.type === "text" && (
                <Input
                  id={`preview-${index}`}
                  placeholder="Enter text"
                  disabled
                />
              )}

              {field.type === "email" && (
                <Input
                  id={`preview-${index}`}
                  type="email"
                  placeholder="Enter email"
                  disabled
                />
              )}

              {field.type === "number" && (
                <Input
                  id={`preview-${index}`}
                  type="number"
                  placeholder="Enter number"
                  disabled
                />
              )}

              {field.type === "date" && (
                <Input id={`preview-${index}`} type="date" disabled />
              )}

              {field.type === "checkbox" && (
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id={`preview-${index}`} disabled />
                  <Label htmlFor={`preview-${index}`}>Check this option</Label>
                </div>
              )}

              {field.type === "selection" && (
                <select
                  id={`preview-${index}`}
                  className="w-full p-2 border rounded-md bg-gray-100"
                  disabled
                >
                  <option value="">Select an option</option>
                  {(field.selections || field.options || []).map(
                    (option, optIdx) => (
                      <option key={optIdx} value={option}>
                        {option}
                      </option>
                    )
                  )}
                </select>
              )}

              {/* Array field preview */}
              {field.type === "array" && field.arrayConfig && (
                <div className="space-y-3 border p-3 rounded-md">
                  <div className="flex flex-wrap gap-2">
                    {(arrayInputs[`field-${index}`] || []).map(
                      (item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem(`field-${index}`, itemIdx)
                            }
                            className="ml-2 text-gray-500 hover:text-red-500"
                            disabled
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      placeholder={`Add ${field.arrayConfig.itemType} item`}
                      value={newArrayItem[`field-${index}`] || ""}
                      onChange={(e) => {
                        setNewArrayItem((prev) => ({
                          ...prev,
                          [`field-${index}`]: e.target.value,
                        }));
                      }}
                      type={
                        field.arrayConfig.itemType === "number"
                          ? "number"
                          : field.arrayConfig.itemType === "email"
                          ? "email"
                          : "text"
                      }
                      disabled
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        addArrayItem(
                          `field-${index}`,
                          field.arrayConfig!.itemType
                        )
                      }
                      disabled
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500">
                    {field.arrayConfig.minItems &&
                      field.arrayConfig.minItems > 0 && (
                        <span>Min items: {field.arrayConfig.minItems} • </span>
                      )}
                    {field.arrayConfig.maxItems && (
                      <span>Max items: {field.arrayConfig.maxItems}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Button disabled className="w-full">
          Submit
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Publish</h2>
      <p className="text-sm text-gray-500 mb-6">
        Configure your form's sharing settings and preview how it will appear to
        users. Once published, you'll receive a link that you can share with
        your audience.
      </p>

      <div className="grid grid-cols-2 gap-2 bg-gray-200 p-2 rounded-md mb-6">
        <Button
          variant={activeTab === "setting" ? "default" : "secondary"}
          className={`w-full hover:bg-[#7ba2cf] ${
            activeTab === "setting"
              ? "bg-[#4A90E2] hover:bg-[#4A90E2] text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setActiveTab("setting")}
        >
          Setting
        </Button>
        <Button
          className={`w-full hover:bg-[#7ba2cf] ${
            activeTab === "preview"
              ? "bg-[#4A90E2] hover:bg-[#4A90E2] text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </Button>
      </div>
      {activeTab === "setting" && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Share setting</h3>

            <RadioGroup
              value={publishData.shareSetting}
              onValueChange={(value: "public" | "private") =>
                setPublishData((prev) => ({ ...prev, shareSetting: value }))
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">
                  Public - anyone with a link can access
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">Private - requires access code</Label>
              </div>
            </RadioGroup>

            {publishData.shareSetting === "private" && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="accessCode">Access Code</Label>
                <Input
                  id="accessCode"
                  name="accessCode"
                  placeholder="Enter form access code"
                  value={publishData.accessCode}
                  onChange={handlePublishChange}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Submission Handling</h3>

            <div className="bg-gray-100 p-4 rounded-md text-sm">
              <p>
                Automatic Endpoint Generation: When you publish this form, a
                secure endpoint will be automatically created to handle
                submissions.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Response Draft</h3>

            <Textarea
              name="responseDraft"
              value={publishData.responseDraft}
              onChange={handlePublishChange}
              placeholder="Enter response after form submission"
              className="min-h-[100px]"
            />
          </div>
        </div>
      )}

      {activeTab === "preview" && (
        <div className="border rounded-md p-4 min-h-[300px]">
          <FormPreview />
        </div>
      )}

      <div className="pt-4 flex justify-between">
        <Button
          className="bg-[#4A90E2] hover:bg-[#4A90E2]"
          onClick={saveToDatabase}
          disabled={isLoading}
        >
          {isLoading ? "Publishing..." : "Publish"}
        </Button>
        <Button className="bg-[#4A90E2] hover:bg-[#4A90E2]">
          Back: Review
        </Button>
      </div>
    </div>
  );
}
