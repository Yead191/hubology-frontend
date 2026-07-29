
export function getImageUrl(imageurl: string | null | undefined) {
  // console.log(imageurl, 'get img')
  // if (!imageurl) return undefined;
  if (imageurl?.startsWith("/asset")) {
    const baseUrl = (
      process.env.IMAGE_BASE_URL ||
      process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
      "http://10.10.26.164:5002"
    )?.replace("/files", "");

    return `${baseUrl}${imageurl}`;
  }
  if (imageurl?.startsWith("http") || imageurl?.startsWith('blob:')) return imageurl;
  return (
    (process.env.IMAGE_BASE_URL || process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://10.10.26.164:5002/files") + imageurl
  );
}
