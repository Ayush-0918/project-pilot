import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      let userId: string | null = null;
      
      if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        try {
          const session = await auth();
          userId = session?.userId || null;
        } catch(e) {}
      } 
      
      if (!userId && process.env.NODE_ENV === "development") {
        userId = "mock-developer-id";
      }

      if (!userId) throw new Error("Unauthorized upload attempt");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("Uploaded file URL:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  resumeUploader: f({ pdf: { maxFileSize: "16MB", maxFileCount: 1 }, text: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      let userId: string | null = null;
      
      if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        try {
          const session = await auth();
          userId = session?.userId || null;
        } catch(e) {}
      }
      
      if (!userId && process.env.NODE_ENV === "development") {
        userId = "mock-developer-id";
      }

      if (!userId) throw new Error("Unauthorized upload attempt");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Resume upload complete for userId:", metadata.userId);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;