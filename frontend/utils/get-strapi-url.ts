export function getStrapiURL() {
    if (typeof window === "undefined") {
        return process.env.STRAPI_API_URL ?? "http://localhost:1337";
    }
    return process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337";
}