export const generateContent = async (prompt: string, apiKey?: string): Promise<string> => {
    // Mock Mode
    if (!apiKey) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`• Successfully led a team of 5 developers in delivering critical features.\n• Improved application performance by 30% through code optimization.\n• Collaborated with UX designers to implement responsive and accessible interfaces.\n• Mentored junior developers and conducted code reviews to ensure quality.`);
            }, 1500);
        });
    }

    // Real AI Mode (Gemini API)
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Generate 4-5 professional resume bullet points for the following role and achievements. Return ONLY the bullet points, starting with "• ". \n\n${prompt}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate content');
        }

        const data = await response.json();
        const generatedText = data.candidates[0].content.parts[0].text;
        return generatedText;
    } catch (error) {
        console.error('AI Generation Error:', error);
        throw error;
    }
};

export const fixGrammar = async (text: string, apiKey?: string): Promise<string> => {
    // Mock Mode
    if (!apiKey) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simple mock improvement: capitalize first letter and add period if missing
                const improved = text.charAt(0).toUpperCase() + text.slice(1).trim().replace(/([^.])$/, '$1.');
                resolve(improved);
            }, 1000);
        });
    }

    // Real AI Mode
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Fix grammar and improve clarity for the following text. Return ONLY the corrected text, preserving the original meaning.\n\n${text}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fix grammar');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error('AI Grammar Error:', error);
        throw error;
    }
};
