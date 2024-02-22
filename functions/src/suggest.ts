import { IExtent, IPoint } from "@esri/arcgis-rest-geocoding";

export interface SuggestRequest {
  location: string;
}

export interface Suggestion {
  text: string;
  magicKey: string;
  isCollection: boolean;
}

export interface SuggestResponse {
  suggestions: Suggestion[];
}

export interface FindAddressFromSuggestionRequest {
  singleLineAddress: string;
  magicKey: string;
}

export interface Candidate {
  address: string;
  location: IPoint;
  extent?: IExtent;
  score: number;
}

export interface FindAddressFromSuggestionResponse {
  candidates: Candidate[];
}
