import { apiConn } from "@/lib/api-routes";

function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export async function uploadFiles(files: (File | string)[]): Promise<string[]> {
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (typeof file === "string" && file.startsWith("data:image")) {
      // convert base64 image string to a File object
      const convertedFile = dataURLtoFile(file, `image-${i}.png`);
      formData.append("files", convertedFile);
    } else if (file instanceof File) {
      formData.append("files", file);
    } else {
      console.warn(`Skipped unsupported input at index ${i}`);
    }
  }

  return apiConn
    .post<string[]>("uploads", {
      body: formData
    })
    .json();
}

/* import { apiConn } from "@/lib/api-routes";

export async function uploadFiles(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));

  return apiConn
    .post<string[]>("uploads", {
      body: formData
    })
    .json();
}
 */
