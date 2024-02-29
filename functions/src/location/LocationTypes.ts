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

export interface Candidate {
  address: string;
  location: IPoint;
  extent?: IExtent;
  score: number;
}

export interface FindAddressFromSuggestionRequest {
  singleLineAddress: string;
  magicKey: string;
}

export interface FindAddressFromSuggestionResponse {
  candidates: Candidate[];
}

export interface ReverseGeocodeRequest {
  longitude: number;
  latitude: number;
}

export interface ReverseGeocodeResponse {
  candidate: Candidate;
}
