"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Field {
  id: string;
  label: string;
  type: string;
  category: string | null;
  required: boolean;
  options: string[];
}

interface Form {
  id: string;
  topic: string;
  description: string;
  categories: string;
  status: string;
  submissions: number;
  accessMode: string | null;
  createdAt: string;
  updatedAt: string;
  fields: Field[];
}

interface FormDisplayProps {
  form: Form;
}

export default function FormDisplay({ form }: FormDisplayProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [arrayInputs, setArrayInputs] = useState<Record<string, string[]>>({});
  const [newArrayItem, setNewArrayItem] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Parse categories string into array
  const categoriesArray = form.categories ? form.categories.split(",") : [];

  // Group fields by category
  const fieldsByCategory: Record<string, Field[]> = {};

  // Add "Uncategorized" for fields without a category
  fieldsByCategory["Uncategorized"] = [];

  // Add all categories from the form
  categoriesArray.forEach((category) => {
    fieldsByCategory[category] = [];
  });

  // Group fields by their category
  form.fields.forEach((field) => {
    const category = field.category || "Uncategorized";
    if (!fieldsByCategory[category]) {
      fieldsByCategory[category] = [];
    }
    fieldsByCategory[category].push(field);
  });

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const addArrayItem = (fieldId: string, type: string) => {
    const value = newArrayItem[fieldId];
    if (!value || !value.trim()) return;

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

    // Update form values with the array
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || []), value],
    }));
  };

  const removeArrayItem = (fieldId: string, index: number) => {
    setArrayInputs((prev) => {
      const updated = {
        ...prev,
        [fieldId]: prev[fieldId].filter((_, i) => i !== index),
      };

      // Also update form values
      setFormValues((prevValues) => ({
        ...prevValues,
        [fieldId]: updated[fieldId],
      }));

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const missingFields: string[] = [];

    form.fields.forEach((field) => {
      if (field.required) {
        const value = formValues[field.id];

        if (field.type === "array") {
          if (!value || !Array.isArray(value) || value.length === 0) {
            missingFields.push(field.label);
          }
        } else if (value === undefined || value === "" || value === null) {
          missingFields.push(field.label);
        }
      }
    });

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();

      // Add form values to FormData
      Object.entries(formValues).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      });

      // Append image files to FormData
      form.fields.forEach((field) => {
        if (field.type === "image" && formValues[field.id]) {
          formValues[field.id].forEach((file: File) => {
            formData.append("images[]", file);
          });
        }
      });

      // Submit form data
      const response = await fetch(`/api/forms/${form.id}/submit`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit form");
      }

      toast.success("Form submitted successfully!");

      // Reset form
      setFormValues({});
      setArrayInputs({});
      setNewArrayItem({});
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while submitting the form"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 bg-white">
      <div>
        <h1 className="text-2xl font-bold">{form.topic}</h1>
        <p className="text-gray-600 mt-2">{form.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {Object.entries(fieldsByCategory).map(([category, fields]) => {
          // Skip categories with no fields
          if (fields.length === 0) return null;

          return (
            <div key={category} className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">
                {category}
              </h2>

              <div className="space-y-6">
                {fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>

                    {field.type === "text" && (
                      <Input
                        id={field.id}
                        value={formValues[field.id] || ""}
                        onChange={(e) =>
                          handleInputChange(field.id, e.target.value)
                        }
                        required={field.required}
                      />
                    )}

                    {field.type === "number" && (
                      <Input
                        id={field.id}
                        type="number"
                        value={formValues[field.id] || ""}
                        onChange={(e) =>
                          handleInputChange(field.id, e.target.value)
                        }
                        required={field.required}
                      />
                    )}

                    {field.type === "email" && (
                      <Input
                        id={field.id}
                        type="email"
                        value={formValues[field.id] || ""}
                        onChange={(e) =>
                          handleInputChange(field.id, e.target.value)
                        }
                        required={field.required}
                      />
                    )}

                    {field.type === "date" && (
                      <Input
                        id={field.id}
                        type="date"
                        value={formValues[field.id] || ""}
                        onChange={(e) =>
                          handleInputChange(field.id, e.target.value)
                        }
                        required={field.required}
                      />
                    )}

                    {field.type === "checkbox" && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={field.id}
                          checked={formValues[field.id] || false}
                          onCheckedChange={(checked) =>
                            handleInputChange(field.id, checked)
                          }
                        />
                        <Label htmlFor={field.id}>Yes</Label>
                      </div>
                    )}

                    {field.type === "selection" &&
                      field.options &&
                      field.options.length > 0 && (
                        <Select
                          value={formValues[field.id] || ""}
                          onValueChange={(value) =>
                            handleInputChange(field.id, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((option, index) => (
                              <SelectItem key={index} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                    {field.type === "image" && (
                      <div>
                        <Label htmlFor={field.id}>
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        <Input
                          id={field.id}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files) {
                              const fileArray = Array.from(files);
                              setFormValues((prev) => ({
                                ...prev,
                                [field.id]: fileArray,
                              }));
                            }
                          }}
                        />
                      </div>
                    )}

                    {field.type === "array" && (
                      <div>
                        <Input
                          id={field.id}
                          value={newArrayItem[field.id] || ""}
                          onChange={(e) =>
                            setNewArrayItem((prev) => ({
                              ...prev,
                              [field.id]: e.target.value,
                            }))
                          }
                          placeholder={`Add a ${field.label}`}
                        />
                        <Button
                          type="button"
                          onClick={() => addArrayItem(field.id, field.type)}
                          className="mt-2"
                        >
                          <Plus className="mr-2" />
                          Add
                        </Button>

                        <div className="mt-2">
                          {(arrayInputs[field.id] || []).map((item, index) => (
                            <div key={index} className="flex items-center mt-2">
                              <span className="mr-2">{item}</span>
                              <Button
                                type="button"
                                onClick={() => removeArrayItem(field.id, index)}
                                variant="destructive"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Reset the form or go back logic here
              setFormValues({});
              setArrayInputs({});
              setNewArrayItem({});
            }}
          >
            Reset
          </Button>
          <Button type="submit" disabled={submitting} isLoading={submitting}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
