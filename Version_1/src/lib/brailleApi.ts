/**
 * Utility functions for making API calls to the Python backend 
 * for the Grade 1 and Grade 2 Braille translation logic.
 */

// IMPORTANT: Update this BASE_URL to the actual address of your running Python backend (e.g., Flask/FastAPI)
const BASE_URL = 'http://localhost:5000/api/translate'; 

/**
 * Sends text to the backend for Braille translation of a specific grade.
 * * @param text The English text to translate.
 * @param grade The target Braille grade (1 or 2).
 * @returns A promise that resolves with the translated Braille string.
 */
export const fetchBrailleTranslation = async (text: string, grade: 1 | 2): Promise<string> => {
  // Selects the correct Python endpoint: /api/translate/grade1 or /api/translate/grade2
  const endpoint = grade === 1 ? 'grade1' : 'grade2';
  const url = `${BASE_URL}/${endpoint}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send the text to the Python server in a JSON body
      body: JSON.stringify({ text: text }),
    });

    if (!response.ok) {
      // Throw an error if the server response is not successful
      const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
      throw new Error(`Translation failed. Server response: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Assumes the Python server returns a JSON object like { "braille": "..." }
    if (typeof data.braille === 'string') {
      return data.braille;
    } else {
      throw new Error("Invalid response format received from the server.");
    }

  } catch (error) {
    console.error("Error fetching braille translation:", error);
    // Return a user-friendly error message
    return `ERROR: Could not complete translation. Please check the backend server connection. Details: ${(error as Error).message}`;
  }
};