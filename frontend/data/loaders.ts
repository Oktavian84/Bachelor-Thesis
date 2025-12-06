import qs from "qs";
import { fetchAPI } from "@/utils/fetch-api";
import { getStrapiURL } from "@/utils/get-strapi-url";

const BASE_URL = getStrapiURL();

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
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
          },
          fields: ["headline", "content", "reversed"],
        },
      },
    },
  },
});

export async function getHomePage() {
  const path = "/api/home-page";
  const url = new URL(path, BASE_URL);
  url.search = homePageQuery;

  return await fetchAPI(url.href, { method: "GET" });
}

const pageBySlugQuery = (slug: string) => qs.stringify({
  filters: {
    slug: {
      $eq: slug,
    },
  },
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
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
          },
          fields: ["headline", "content", "reversed"],
        },
        "blocks.about-block": {
          populate: "*",
        },
        "blocks.privacy-block": {
          populate: "*",
        },
        "blocks.faq-block": {
          populate: "*",
        },
        "blocks.contact-block": {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
            cta: true,
          },
          fields: ["headline", "name", "number", "email", "buttonText", "content"],
        },
      },
    },
  },
});

export async function getPageBySlug(slug: string) {
  const path = "/api/pages";
  const url = new URL(path, BASE_URL);
  url.search = pageBySlugQuery(slug);
  
  return await fetchAPI(url.href, { method: "GET" });
}

const globalSettingQuery = qs.stringify({
  populate: {
    header: {
      populate: {
        logo: {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
          },
        },
        navigation: true,
      },
    },
    footer: {
      populate: {
        logo: {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
          },
        },
        policies: true,
      },
    },
  },
});

export async function getGlobalSettings() {
  const path = "/api/global";
  const url = new URL(path, BASE_URL);
  url.search = globalSettingQuery;
  return fetchAPI(url.href, { method: "GET" });
}
