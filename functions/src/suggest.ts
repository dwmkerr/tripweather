export interface SuggestRequest {
  location: string;
}

export interface Suggestion {
  text: string;
  magicKey: string;
  isCollection: boolean;
}

export interface SuggestResponse {
  result: string;
  suggestions: Suggestion[];
}

