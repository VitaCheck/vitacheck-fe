export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary 환경변수가 설정되지 않았습니다.");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: "POST",
      body: form,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary 업로드 실패: ${text}`);
  }

  const data: { secure_url?: string } = await res.json();
  if (!data.secure_url)
    throw new Error("Cloudinary 응답에 secure_url이 없습니다.");
  return data.secure_url;
}
