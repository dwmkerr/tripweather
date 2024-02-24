import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import { IExtent, IPoint, suggest, geocode } from "@esri/arcgis-rest-geocoding";
import { request } from "@esri/arcgis-rest-request";
import { ApplicationSession } from "@esri/arcgis-rest-auth";

import { parameters } from "./parameters";

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

function getSession() {
  const session = new ApplicationSession({
    clientId: parameters.arcgisClientId.value(),
    clientSecret: parameters.arcgisClientSecret.value(),
  });
  return session;
}

export const arcGisStatus = onRequest(
  { cors: ["localhost:3000"] },
  async (req, res) => {
    try {
      const arcgisStatus = await request(
        "https://www.arcgis.com/sharing/rest/info",
      );
      res.send({
        status: "ok",
        response: arcgisStatus,
      });
    } catch (err) {
      res.send({
        status: "error",
        response: err,
      });
    }
  },
);

export const arcGisSuggest = onCall<SuggestRequest, Promise<SuggestResponse>>(
  { cors: ["localhost:3000"] },
  async (req): Promise<SuggestResponse> => {
    const session = getSession();
    const locationText = req.data.location;
    logger.info(`Suggest, query: ${locationText}`);
    try {
      const response = await suggest(locationText, {
        authentication: session,
      });
      console.log(response);

      //  Get the first suggestion and then geocode it.
      const candidates = await geocode({
        authentication: session,
        singleLine: response.suggestions[0].text,
        magicKey: response.suggestions[0].magicKey,
      });
      console.log(candidates);

      return {
        suggestions: response.suggestions.slice(0, 3),
        // candidates,
      };
    } catch (err) {
      console.error(err);
      throw new HttpsError("internal", `arcgis error: ${err}`);
    }
  },
);

export const findAddressFromSuggestion = onCall<
  FindAddressFromSuggestionRequest,
  Promise<FindAddressFromSuggestionResponse>
>({ cors: ["localhost:3000"] }, async (req) => {
  const session = getSession();
  const singleLine = req.data.singleLineAddress as string;
  const magicKey = req.data.magicKey as string;
  logger.info(`Find Address, query: ${singleLine} - ${magicKey}`);
  try {
    //  Get the first suggestion and then geocode it.
    const result = await geocode({
      authentication: session,
      singleLine,
      magicKey,
    });
    console.log(result);

    return {
      candidates: result.candidates,
    };
  } catch (err) {
    console.error(err);
    throw new HttpsError("internal", `arcgis error: ${err}`);
  }
});
