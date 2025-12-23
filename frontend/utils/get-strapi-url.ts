export function getStrapiURL() {
    if (typeof window === "undefined") {
        return process.env.STRAPI_API_URL;
    }
    return process.env.NEXT_PUBLIC_STRAPI_API_URL;
}