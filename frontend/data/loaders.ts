import qs from "qs"
import { fetchAPI } from "@/utils/fetch-api"

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL

function buildStrapiUrl(path: string, query?: string) {
  if (!STRAPI_BASE_URL) return null

  try {
    const url = new URL(path, STRAPI_BASE_URL)
    if (query) url.search = query
    return url.href
  } catch (e) {
    console.error("Invalid Strapi URL", { path, STRAPI_BASE_URL })
    return null
  }
}

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
})

export async function getHomePage() {
  const url = buildStrapiUrl("/api/home-page", homePageQuery)
  if (!url) return { data: null }

  try {
    return await fetchAPI(url, { method: "GET" })
  } catch (e) {
    console.error("getHomePage failed", e)
    return { data: null }
  }
}

const pageBySlugQuery = (slug: string) =>
  qs.stringify({
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
            fields: [
              "headline",
              "name",
              "number",
              "email",
              "buttonText",
              "content",
            ],
          },
          "blocks.exhibition-block": {
            populate: {
              exhibition: {
                populate: {
                  image: {
                    fields: ["url", "alternativeText"],
                  },
                },
              },
            },
          },
          "blocks.gallery-block": {
            populate: {
              gallery_items: {
                populate: {
                  image: {
                    fields: ["url", "alternativeText"],
                  },
                },
              },
            },
          },
        },
      },
    },
  })

export async function getPageBySlug(slug: string) {
  const query = pageBySlugQuery(slug)
  const url = buildStrapiUrl("/api/pages", query)
  if (!url) return { data: null }

  try {
    return await fetchAPI(url, { method: "GET" })
  } catch (e) {
    console.error("getPageBySlug failed", e)
    return { data: null }
  }
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
})

export async function getGlobalSettings() {
  const url = buildStrapiUrl("/api/global", globalSettingQuery)
  if (!url) return { data: null }

  try {
    return await fetchAPI(url, { method: "GET" })
  } catch (e) {
    console.error("getGlobalSettings failed", e)
    return { data: null }
  }
}
