"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Zod Schema for Form Fields
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

type Field = z.infer<typeof fieldSchema>;
type FormData = z.infer<typeof formSchema>;

export default function FormGeneratorStep() {
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

  const [newCategory, setNewCategory] = useState("");
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    localStorage.setItem("form_data", JSON.stringify(formData));
  }, [formData]);

  const addField = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          label: "",
          type: "text",
          category: "",
          required: false,
          options: [],
          selections: [],
          arrayConfig: {
            itemType: "string",
            minItems: 1,
            maxItems: 10,
          },
        },
      ],
    }));
  };

  const addCategory = () => {
    if (!newCategory.trim() || formData.categories.includes(newCategory.trim()))
      return;
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory.trim()],
    }));
    setNewCategory("");
  };

  const removeCategory = (categoryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
      // Also remove this category from any fields that were using it
      fields: prev.fields.map((field) =>
        field.category === categoryToRemove ? { ...field, category: "" } : field
      ),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addOption = (fieldIndex: number) => {
    if (!newOption.trim()) return;

    const newFields = [...formData.fields];
    const currentOptions = newFields[fieldIndex].selections || [];

    if (!currentOptions.includes(newOption.trim())) {
      newFields[fieldIndex].selections = [...currentOptions, newOption.trim()];
      setFormData((prev) => ({ ...prev, fields: newFields }));
    }

    setNewOption("");
  };

  const removeOption = (fieldIndex: number, optionToRemove: string) => {
    const newFields = [...formData.fields];
    const currentOptions = newFields[fieldIndex].selections || [];

    newFields[fieldIndex].selections = currentOptions.filter(
      (option) => option !== optionToRemove
    );

    setFormData((prev) => ({ ...prev, fields: newFields }));
  };

  const removeField = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, index) => index !== indexToRemove),
    }));
  };

  const updateArrayConfig = (
    fieldIndex: number,
    key: keyof NonNullable<Field["arrayConfig"]>,
    value: any
  ) => {
    const newFields = [...formData.fields];
    if (!newFields[fieldIndex].arrayConfig) {
      newFields[fieldIndex].arrayConfig = {
        itemType: "string",
        minItems: 1,
        maxItems: 10,
      };
    }

    newFields[fieldIndex].arrayConfig = {
      ...newFields[fieldIndex].arrayConfig!,
      [key]: key === "minItems" || key === "maxItems" ? Number(value) : value,
    };

    setFormData((prev) => ({ ...prev, fields: newFields }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Form Generator</h2>

      <div className="space-y-2">
        <Label htmlFor="topic">Topic</Label>
        <Textarea
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          className="max-w-[400px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="max-w-[400px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Categories</Label>
        <div className="flex items-center gap-2">
          {/* Display categories as tags */}
          <div className="flex flex-wrap gap-2">
            {formData.categories.map((category) => (
              <div
                key={category}
                className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {category}
                <button
                  type="button"
                  onClick={() => removeCategory(category)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Category input with plus button */}
          <div className="flex items-center gap-2 flex-1">
            <Input
              placeholder="Enter new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addCategory())
              }
              className="flex-1 max-w-[400px]"
            />
            <Button
              type="button"
              size="icon"
              onClick={addCategory}
              disabled={!newCategory.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={addField}
          className="bg-[#4A90E2] hover:bg-[#4A90E2]/90"
        >
          Add Field
        </Button>
      </div>

      {formData.fields.map((field, index) => (
        <div
          key={index}
          className="space-y-4 p-4 border border-gray-200 rounded-md relative"
        >
          <button
            type="button"
            onClick={() => removeField(index)}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          >
            <Trash className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-medium">Field {index + 1}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`field-${index}-label`}>Label</Label>
            <Input
              id={`field-${index}-label`}
              placeholder="Label"
              value={field.label}
              onChange={(e) => {
                const newFields = [...formData.fields];
                newFields[index].label = e.target.value;
                setFormData((prev) => ({ ...prev, fields: newFields }));
              }}
              className="max-w-[400px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`field-${index}-type`}>Type</Label>
            <Select
              value={field.type}
              onValueChange={(value) => {
                const newFields = [...formData.fields];
                newFields[index].type = value as Field["type"];
                // Initialize options array if type is selection
                if (value === "selection" && !newFields[index].selections) {
                  newFields[index].selections = [];
                }
                // Initialize array config if type is array
                if (value === "array" && !newFields[index].arrayConfig) {
                  newFields[index].arrayConfig = {
                    itemType: "string",
                    minItems: 1,
                    maxItems: 10,
                  };
                }
                setFormData((prev) => ({ ...prev, fields: newFields }));
              }}
            >
              <SelectTrigger id={`field-${index}-type`}>
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="selection">Selection</SelectItem>
                <SelectItem value="array">Array</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`field-${index}-category`}>Category</Label>
            <Select
              value={field.category}
              onValueChange={(value) => {
                const newFields = [...formData.fields];
                newFields[index].category = value;
                setFormData((prev) => ({ ...prev, fields: newFields }));
              }}
            >
              <SelectTrigger id={`field-${index}-category`}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {formData.categories.map((category, idx) => (
                  <SelectItem key={idx} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={field.required}
              onCheckedChange={(checked) => {
                const newFields = [...formData.fields];
                newFields[index].required = checked;
                setFormData((prev) => ({ ...prev, fields: newFields }));
              }}
              className="data-[state=checked]:bg-[#4A90E2]"
            />
            <Label>Required</Label>
          </div>

          {/* Options section for selection type */}
          {field.type === "selection" && (
            <div className="space-y-4 mt-4 p-3 bg-gray-50 rounded-md">
              <Label>Options</Label>

              {/* Display options as tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {(field.selections || []).map((option, optIdx) => (
                  <div
                    key={optIdx}
                    className="flex items-center bg-white border border-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {option}
                    <button
                      type="button"
                      onClick={() => removeOption(index, option)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Option input with plus button */}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addOption(index))
                  }
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addOption(index)}
                  disabled={!newOption.trim()}
                  className="bg-[#4A90E2] hover:bg-[#4A90E2]/90"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {(field.selections || []).length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  Add at least one option for the selection field
                </p>
              )}
            </div>
          )}

          {/* Configuration section for array type */}
          {field.type === "array" && (
            <div className="space-y-4 mt-4 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                <Label>Array Configuration</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Configure how the array field will work. Choose the type
                        of items it will contain and set minimum/maximum number
                        of items allowed.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor={`field-${index}-array-type`}>Item Type</Label>
                  <Select
                    value={field.arrayConfig?.itemType || "string"}
                    onValueChange={(value) =>
                      updateArrayConfig(index, "itemType", value)
                    }
                  >
                    <SelectTrigger id={`field-${index}-array-type`}>
                      <SelectValue placeholder="Select item type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`field-${index}-min-items`}>
                      Min Items
                    </Label>
                    <Input
                      id={`field-${index}-min-items`}
                      type="number"
                      min="0"
                      value={field.arrayConfig?.minItems || 1}
                      onChange={(e) =>
                        updateArrayConfig(index, "minItems", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`field-${index}-max-items`}>
                      Max Items
                    </Label>
                    <Input
                      id={`field-${index}-max-items`}
                      type="number"
                      min="1"
                      value={field.arrayConfig?.maxItems || 10}
                      onChange={(e) =>
                        updateArrayConfig(index, "maxItems", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
