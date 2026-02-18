/* app/services/api/utils.ts v0.5.16 */
export const apiFetch = async (
  url: string, 
  key: string, 
  body: any, 
  authScheme: 'Bearer' | 'Simple' | 'Custom', 
  customHeaders: Record<string, string> = {}
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders
  };
  
  if (authScheme === 'Bearer') {
    headers['Authorization'] = `Bearer ${key}`;
  } else if (authScheme === 'Simple') {
    headers['Authorization'] = key;
  }
  // For 'Custom', headers are provided entirely via customHeaders.

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ message: `HTTP Error: ${response.status}` }));
    const message = errData.error?.message || errData.message || errData.msg || `API Error: ${response.statusText}`;
    throw new Error(message);
  }
  return response.json();
};