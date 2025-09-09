import { Form } from 'react-router-dom';
import { baseURL } from '../config';

export async function fetchServer(LinkToServer, dataToServer = {}, method = "GET", isFormData = false) {
  try {
    const token = localStorage.getItem('token');
    const headers = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const request = {
      method: method,
      headers: headers,
    };

    if (method !== 'GET') {
      request.body = isFormData ? dataToServer : JSON.stringify(dataToServer);
    }
        const response = await fetch(baseURL + LinkToServer, request);
    const newToken = response.headers.get('x-new-token');
    if (newToken) {
      localStorage.setItem('token', newToken);
      console.log('🔄 טוקן חדש התקבל ונשמר בלוקל סטורג');
    }

    // Return the entire response object for the caller to handle.
    // This gives more flexibility (e.g., checking response.ok, response.status).
    return response;

  } catch (error) {
    // Catch network errors or other exceptions during fetch
    console.error('Error in fetchServer:', error);
    throw error;
  }
}
