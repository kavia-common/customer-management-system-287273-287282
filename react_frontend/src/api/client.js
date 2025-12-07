const DEFAULT_BASE_URL = "http://localhost:3001";
const BASE_URL = process.env.REACT_APP_API_BASE || DEFAULT_BASE_URL;

/**
 * Build a fully qualified API URL for a given path.
 * Ensures we always prefix with /api and correctly join slashes.
 * @param {string} path - e.g. "/customers" or "/customers/1"
 * @returns {string}
 */
function apiUrl(path) {
  const trimmedBase = BASE_URL.replace(/\/+$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  return `${trimmedBase}/api/${trimmedPath}`;
}

/**
 * Internal helper to perform fetch with JSON handling and error mapping.
 * @param {string} url
 * @param {RequestInit} options
 * @returns {Promise<{ data: any, error: null } | { data: null, error: Error }>}
 */
async function request(url, options = {}) {
  try {
    const headers = new Headers(options.headers || {});
    if (!headers.has("Content-Type") && options.body) {
      headers.set("Content-Type", "application/json");
    }

    const res = await fetch(url, { ...options, headers });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!res.ok) {
      // Try to parse JSON error body if present
      let errorMessage = `Request failed with status ${res.status}`;
      if (isJson) {
        try {
          const errBody = await res.json();
          errorMessage =
            errBody?.detail ||
            errBody?.message ||
            JSON.stringify(errBody) ||
            errorMessage;
        } catch {
          // ignore json parse error
        }
      } else {
        try {
          const text = await res.text();
          if (text) errorMessage = text;
        } catch {
          // ignore text parse error
        }
      }
      const error = new Error(errorMessage);
      error.status = res.status;
      return { data: null, error };
    }

    // Successful response
    if (res.status === 204) {
      // No content
      return { data: null, error: null };
    }

    if (isJson) {
      const data = await res.json();
      return { data, error: null };
    }

    // fallback to text if not json
    const textData = await res.text();
    return { data: textData, error: null };
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    return { data: null, error };
  }
}

/**
 * Simple loading state helper wrapping any promise-returning function.
 * Returns a tuple-like object for ergonomic consumption.
 * @template T
 * @param {() => Promise<T>} fn
 * @returns {Promise<{ loading: boolean, data: T | null, error: Error | null }>}
 */
async function withLoading(fn) {
  let loading = true;
  try {
    const data = await fn();
    loading = false;
    return { loading, data, error: null };
  } catch (error) {
    loading = false;
    return { loading, data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
}

// PUBLIC_INTERFACE
/**
 * List all customers.
 * @returns {Promise<{ data: any, error: Error | null }>}
 */
export async function listCustomers() {
  return request(apiUrl("customers"), { method: "GET" });
}

// PUBLIC_INTERFACE
/**
 * Retrieve a customer by ID.
 * @param {string|number} id
 * @returns {Promise<{ data: any, error: Error | null }>}
 */
export async function getCustomer(id) {
  if (id === undefined || id === null) {
    return { data: null, error: new Error("Customer id is required") };
  }
  return request(apiUrl(`customers/${encodeURIComponent(id)}`), { method: "GET" });
}

// PUBLIC_INTERFACE
/**
 * Create a new customer.
 * @param {object} data - customer payload
 * @returns {Promise<{ data: any, error: Error | null }>}
 */
export async function createCustomer(data) {
  return request(apiUrl("customers"), {
    method: "POST",
    body: JSON.stringify(data || {}),
  });
}

// PUBLIC_INTERFACE
/**
 * Update an existing customer by ID.
 * @param {string|number} id
 * @param {object} data - partial or full customer payload
 * @returns {Promise<{ data: any, error: Error | null }>}
 */
export async function updateCustomer(id, data) {
  if (id === undefined || id === null) {
    return { data: null, error: new Error("Customer id is required") };
  }
  return request(apiUrl(`customers/${encodeURIComponent(id)}`), {
    method: "PUT",
    body: JSON.stringify(data || {}),
  });
}

// PUBLIC_INTERFACE
/**
 * Delete a customer by ID.
 * @param {string|number} id
 * @returns {Promise<{ data: any, error: Error | null }>}
 */
export async function deleteCustomer(id) {
  if (id === undefined || id === null) {
    return { data: null, error: new Error("Customer id is required") };
  }
  return request(apiUrl(`customers/${encodeURIComponent(id)}`), {
    method: "DELETE",
  });
}

// PUBLIC_INTERFACE
/**
 * Utility exported for components to easily wrap calls with a loading state.
 * Example:
 *   const { loading, data, error } = await withLoadingAsync(() => listCustomers());
 * @param {() => Promise<any>} fn
 * @returns {Promise<{ loading: boolean, data: any, error: Error | null }>}
 */
export async function withLoadingAsync(fn) {
  return withLoading(fn);
}

// PUBLIC_INTERFACE
/**
 * Expose the resolved base URL for debugging and UI display purposes.
 * @returns {string}
 */
export function getApiBaseUrl() {
  return BASE_URL;
}
