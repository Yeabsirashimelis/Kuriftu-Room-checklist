import { Form } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";

const getForms = async () => {
  const res = await betterFetch<Form[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/forms/get`
  );

  console.log("response: ", res);
  return res.data;
};

export const useGetForms = () => {
  return useQuery({
    queryKey: ["forms"],
    queryFn: () => getForms(),
  });
};
