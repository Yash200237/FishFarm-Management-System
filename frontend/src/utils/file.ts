export const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export const validateImageFile = (file: File, maxBytes: number) => {
  if (!file.type.startsWith("image/")) return "Not an image file"
  if (file.size > maxBytes) return "Image too large"
  return null
}
