// import { NextApiRequest, NextApiResponse } from "next";
// import cloudinary from "@/lib/cloudinary"; // Your Cloudinary configuration file
// import { db } from "@/lib/db";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const formId = req.query.formId as string;
//   const formData = req.body;
// //
//   try {
//     // Handle image uploads
//     const imageUrls: string[] = [];
//     if (req.files && req.files["images[]"]) {
//       const files = Array.isArray(req.files["images[]"])
//         ? req.files["images[]"]
//         : [req.files["images[]"]];

//       for (let file of files) {
//         const result = await cloudinary.uploader.upload(file.tempFilePath);
//         imageUrls.push(result.secure_url);
//       }
//     }

//     // Save the form submission to your database
//     const submission = await db.formSubmission.create({
//       data: {
//         formId,
//         images: imageUrls,
//         fields: formData, // Handle the form field data as required
//       },
//     });

//     return res.status(200).json(submission);
//   } catch (error) {
//     console.error("Error submitting form:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }
