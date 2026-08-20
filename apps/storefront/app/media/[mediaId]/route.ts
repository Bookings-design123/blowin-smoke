import { getCommerceMediaUrl } from "@/lib/catalog/api";

const VALID_MEDIA_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ mediaId: string }> },
): Promise<Response> {
  const { mediaId } = await params;
  if (!VALID_MEDIA_ID.test(mediaId)) return new Response(null, { status: 404 });
  const source = getCommerceMediaUrl(mediaId);
  if (!source) return new Response(null, { status: 404 });

  try {
    const response = await fetch(source, {
      cache: "no-store",
      headers: { accept: "image/avif,image/webp,image/png,image/jpeg" },
      signal: AbortSignal.timeout(6_000),
    });
    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !contentType.startsWith("image/") || !response.body) {
      return new Response(null, { status: response.status === 404 ? 404 : 503 });
    }
    const headers = new Headers({
      "content-type": contentType,
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    });
    const etag = response.headers.get("etag");
    if (etag) headers.set("etag", etag);
    return new Response(response.body, { status: 200, headers });
  } catch {
    return new Response(null, { status: 503 });
  }
}
