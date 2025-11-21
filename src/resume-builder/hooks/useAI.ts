import { useState } from 'react';
import { generateContent, fixGrammar } from '../services/ai';

export const useAI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generate = async (prompt: string) => {
        setLoading(true);
        setError(null);
        try {
            const apiKey = localStorage.getItem('ai_api_key') || undefined;
            const result = await generateContent(prompt, apiKey);
            return result;
        } catch (err) {
            setError('Failed to generate content. Please check your API key.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const improveGrammar = async (text: string) => {
        setLoading(true);
        setError(null);
        try {
            const apiKey = localStorage.getItem('ai_api_key') || undefined;
            const result = await fixGrammar(text, apiKey);
            return result;
        } catch (err) {
            setError('Failed to fix grammar. Please check your API key.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { generate, improveGrammar, loading, error };
};
