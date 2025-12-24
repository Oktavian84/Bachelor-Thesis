export function getStrapiURL() {
    
    const url = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    
    if (!url) {
        
        if (typeof window === "undefined") {
            return process.env.STRAPI_API_URL || "http://localhost:1337";
        }
        return "http://localhost:1337";
    }
    
    return url;
}