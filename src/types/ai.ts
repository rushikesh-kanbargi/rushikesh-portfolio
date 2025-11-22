export interface AIResponse {
    text: string;
    error?: string;
}

export interface JobDetails {
    title: string;
    company: string;
    description: string;
}

export interface CoverLetterState {
    generatedLetter: string;
    loading: boolean;
    error: string | null;
}
