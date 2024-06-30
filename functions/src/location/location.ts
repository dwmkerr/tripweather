import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import {
  suggest,
  geocode,
  reverseGeocode as arcGisReverseGeocode,
  ILocation,
} from "@esri/arcgis-rest-geocoding";
import { request } from "@esri/arcgis-rest-request";
import { ApplicationSession } from "@esri/arcgis-rest-auth";

import { mock } from "./mock";

import { getParameterValues } from "../parameters";
import {
  Candidate,
  FindAddressFromSuggestionRequest,
  FindAddressFromSuggestionResponse,
  ReverseGeocodeRequest,
  ReverseGeocodeResponse,
  SuggestRequest,
  SuggestResponse,
} from "./LocationTypes";

function getSession() {
  const params = getParameterValues();
  const session = new ApplicationSession({
    clientId: params.arcgisClientId,
    clientSecret: params.arcgisClientSecret,
  });
  console.log(`ARCGIS client: ${params.arcgisClientId}`);
  console.log(`ARCGIS token: ${params.arcgisClientSecret}`);
  return session;
}

export const arcGisStatus = onRequest(
  { cors: ["localhost:3000"] },
  async (req, res) => {
    const params = getParameterValues();
    mock(params, logger);
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
    mock(getParameterValues(), logger);
    const session = getSession();
    const locationText = req.data.location;
    logger.info(`Suggest, query: ${locationText}`);
    try {
      const response = await suggest(locationText, {
        authentication: session,
      });
      logger.debug(response);

      return {
        suggestions: response.suggestions,
      };
    } catch (err) {
      logger.error(err);
      throw new HttpsError("internal", `arcgis error: ${err}`);
    }
  },
);

export const findAddressFromSuggestion = onCall<
  FindAddressFromSuggestionRequest,
  Promise<FindAddressFromSuggestionResponse>
>({ cors: ["localhost:3000"] }, async (req) => {
  const session = getSession();
  const singleLine = req.data.singleLineAddress;
  const magicKey = req.data.magicKey;
  logger.info(`Find Address, query: ${singleLine} - ${magicKey}`);
  try {
    //  Get the first suggestion and then geocode it.
    const result = await geocode({
      authentication: session,
      singleLine,
      magicKey,
    });
    logger.debug(result);

    return {
      candidates: result.candidates,
    };
  } catch (err) {
    logger.error(err);
    throw new HttpsError("internal", `arcgis error: ${err}`);
  }
});

export const reverseGeocode = onCall<
  ReverseGeocodeRequest,
  Promise<ReverseGeocodeResponse>
>({ cors: ["localhost:3000"] }, async (req) => {
  const session = getSession();
  const longitude = req.data.longitude;
  const latitude = req.data.latitude;
  logger.info(`reverse geocode query: ${longitude}, ${latitude}`);
  try {
    //  Get the first suggestion and then geocode it.

    const location: ILocation = {
      longitude,
      latitude,
    };
    const result = await arcGisReverseGeocode(location, {
      authentication: session,
    });
    logger.debug(result);

    const candidate: Candidate = {
      address: result.address["LongLabel"] || "Unknown Address",
      score: 100,
      location: result.location,
    };

    return {
      candidate,
    };
  } catch (err) {
    logger.error(err);
    throw new HttpsError("internal", `arcgis error: ${err}`);
  }
});
