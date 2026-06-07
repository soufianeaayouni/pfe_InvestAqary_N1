const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function parseJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid API response (${response.status})`);
  }
}

export const apiService = {
  async post(endpoint: string, data: any) {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('investaqary_token')}`
      },
      body: isFormData ? data : JSON.stringify(data),
    });
    
    const result = await parseJsonResponse(response);
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }
    return result;
  },

  async get(endpoint: string, params?: any) {
    try {
      let url = `${API_URL}${endpoint}`;
      if (params) {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        const queryString = searchParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('investaqary_token')}`
        },
      });
      
      const result = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }
      return result;
    } catch (error) {
      console.error(`API Get ${endpoint} failed:`, error);
      throw error;
    }
  },

  async put(endpoint: string, data: any) {
    const isFormData = data instanceof FormData;
    const method = (isFormData && data.has('_method')) ? 'POST' : 'PUT';
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: method,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('investaqary_token')}`
      },
      body: isFormData ? data : JSON.stringify(data),
    });
    
    const result = await parseJsonResponse(response);
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }
    return result;
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('investaqary_token')}`
      },
    });
    
    const result = await parseJsonResponse(response);
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }
    return result;
  }
};
