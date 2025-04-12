"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import FormDisplay from "@/components/form-display";

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

export default function FormDetailPage() {
  const params = useParams();
  const formId = params.formId as string;
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/forms/${formId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch form: ${response.statusText}`);
        }

        const data = await response.json();
        setForm(data);
      } catch (err: any) {
        console.error("Error fetching form:", err);
        setError(err.message || "Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      fetchForm();
    }
  }, [formId]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <p className="text-sm mt-2">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Form not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-white p-6 max-w-4xl">
      <FormDisplay form={form} />
    </div>
  );
}
