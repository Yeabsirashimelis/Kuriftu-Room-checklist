import FormManagementTable from "@/components/form-management/form-management-table";
import TopPart from "@/components/form-management/top-part";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";
import { Form } from "@prisma/client";

export default async function page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const res = await betterFetch<Form[]>(
        "http://localhost:3000/api/forms/get"
      );
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-12">
        <TopPart />
        <FormManagementTable />
      </div>
    </HydrationBoundary>
  );
}
