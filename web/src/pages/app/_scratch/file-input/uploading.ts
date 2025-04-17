import { apiConn } from "@/lib/api-routes";

export async function uploadFiles(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));

  return apiConn
    .post<string[]>("uploads", {
      body: formData
    })
    .json();
}
