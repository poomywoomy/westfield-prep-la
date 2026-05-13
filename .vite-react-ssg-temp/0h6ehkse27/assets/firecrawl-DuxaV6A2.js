import { s as supabase } from "../main.mjs";
const firecrawlApi = {
  // Scrape a single URL
  async scrape(url, options) {
    const { data, error } = await supabase.functions.invoke("firecrawl-scrape", {
      body: { url, options }
    });
    if (error) {
      return { success: false, error: error.message };
    }
    const result = data?.data || data;
    return {
      success: data?.success ?? true,
      data: result,
      error: data?.error
    };
  },
  // Search the web
  async search(query, options) {
    const { data, error } = await supabase.functions.invoke("firecrawl-search", {
      body: { query, options }
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return {
      success: data?.success ?? true,
      data: data?.data || [],
      error: data?.error
    };
  },
  // Map a website to discover all URLs
  async map(url, options) {
    const { data, error } = await supabase.functions.invoke("firecrawl-map", {
      body: { url, options }
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return {
      success: data?.success ?? true,
      data: data?.links || [],
      error: data?.error
    };
  }
};
export {
  firecrawlApi as f
};
