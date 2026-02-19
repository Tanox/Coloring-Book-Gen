/* app/services/api/utils.ts v0.5.20 */

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiFetch = async (
  url: string,
  key: string,
  body: any,
  authScheme: 'Bearer' | 'Simple' | 'Custom',
  customHeaders: Record<string, string> = {}
) => {
  const MAX_RETRIES = 3;
  const INITIAL_DELAY = 1000;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders
  };
  
  if (authScheme === 'Bearer') {
    headers['Authorization'] = `Bearer ${key}`;
  } else if (authScheme === 'Simple') {
    headers['Authorization'] = key;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (response.ok) {
        return response.json();
      }
      
      const isRetryable = response.status === 429 || response.status >= 500;

      if (isRetryable && attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
        console.warn(`API request to ${url} failed with status ${response.status}. Retrying in ${delay}ms... (Attempt ${attempt}/${MAX_RETRIES})`);
        await sleep(delay);
        continue;
      }
      
      const errData = await response.json().catch(() => ({ message: `HTTP Error: ${response.status}` }));
      const message = errData.error?.message || errData.message || errData.msg || `API Error: ${response.statusText}`;
      throw new Error(message);

    } catch (error) {
      if (attempt >= MAX_RETRIES) {
        console.error(`API request to ${url} failed after ${MAX_RETRIES} attempts.`, error);
        throw error;
      }
      const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
      console.warn(`API request to ${url} failed with a network error. Retrying in ${delay}ms... (Attempt ${attempt}/${MAX_RETRIES})`, error);
      await sleep(delay);
    }
  }
  throw new Error("API request failed unexpectedly after all retries.");
};


export const withRetry = async <T>(fn: () => Promise<T>): Promise<T> => {
    const MAX_RETRIES = 3;
    const INITIAL_DELAY = 1000;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt >= MAX_RETRIES) {
                console.error(`API call failed after ${MAX_RETRIES} attempts.`, error);
                throw error;
            }
            const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
            console.warn(`API call failed. Retrying in ${delay}ms... (Attempt ${attempt}/${MAX_RETRIES})`, error);
            await sleep(delay);
        }
    }
    // This line is technically unreachable but required by TypeScript
    throw new Error("API call failed after all retries.");
};