import qs from "qs";
import { fetchAPI } from "@/utils/fetch-api";
import { getStrapiURL } from "@/utils/get-strapi-url";

const homePageQuery = qs.stringify({
  populate: {
    blocks: {
      on: {
        "blocks.hero-section": {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
            cta: true,
          },
        },
        "blocks.info-block": {
          fields: ["headline", "content", "reversed"],
        },
      },
    },
  },
});

export async function getHomePage() {
  const path = "/api/home-page";
  const BASE_URL = getStrapiURL();

  const url = new URL(path, BASE_URL);
  url.search = homePageQuery;

  return await fetchAPI(url.href, { method: "GET" });
}
