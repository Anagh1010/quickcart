const CLERK_IMAGE_HOSTS = new Set(["img.clerk.com", "images.clerk.dev"]);

export function getClerkAvatarUrl(imageUrl) {
  const url = new URL(imageUrl);
  if (!CLERK_IMAGE_HOSTS.has(url.hostname)) return imageUrl;

  url.searchParams.set("width", "56");
  url.searchParams.set("height", "56");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("quality", "80");
  return url.toString();
}
