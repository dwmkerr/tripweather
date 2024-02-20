/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall, onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import {request} from "@esri/arcgis-rest-request";
import {ApplicationSession} from "@esri/arcgis-rest-auth";
import {geocode, suggest} from "@esri/arcgis-rest-geocoding";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send({message: "Hello from Firebase!"});
});

export const arcGisStatus = onRequest(
  {cors: ["localhost:3000"]},
  async (req, res) => {
    try {
      const arcgisStatus = await request("https://www.arcgis.com/sharing/rest/info");
      res.send({
        "status": "ok",
        "response": arcgisStatus,
      });
    } catch (err) {
      res.send({
        "status": "error",
        "response": err,
      });
    }
  });

// const arcgisApiKey = "AAPK6741b50f66e641d49e5c4b65c831cfaaCGq8Ri-5HafmOCzL0IDQZnaNfjmNP0NruOLcIjAunT6f5Mn-KloKeMf0WNYdGn0K";
const arcgisClientSecret = "cc99538d951a437dbf8c7ff8fdb7ec5f";
const arcgisClientId = "BNqUK3cAeKOBwKIW";


function getSession() {
  const session = new ApplicationSession({
    clientId: arcgisClientId,
    clientSecret: arcgisClientSecret,
  });
  return session;
}

export const arcGisSuggest = onCall(
  {cors: ["localhost:3000"]},
  async (req) => {
    const session = getSession();
    const locationText = req.data.location as string;
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
        candidates,
      };
    } catch (err) {
      console.error(err);
      return err;
    }
  });
