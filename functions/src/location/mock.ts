import nock from "nock";
import { ParametersValues } from "../parameters";

export function mock(parameters: ParametersValues, logger: any) {
  //  Let the user know if we are running online or offline, and if offline setup
  //  the mocks.
  if (!parameters.offline) {
    logger.info("running in online mode");
    return;
  }

  logger.info("running in offline mode");

  //  Remember, all arcgis 'rest' calls are POSTs. I.e. not REST. Urr.
  nock("https://www.arcgis.com")
    .post("/sharing/rest/info")
    .reply(200, {
      response: {
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://www.arcgis.com/sharing/rest/generateToken",
        },
        owningSystemUrl: "https://www.arcgis.com",
      },
      status: "ok",
      mode: "offline",
    });

  nock("https://www.arcgis.com")
    .persist()
    .post("/sharing/rest/oauth2/token/")
    .reply(200, {
      access_token: "2YotnFZFEjr1zCsicMWpAA",
      expires_in: 1800, // expiration in seconds from now
      username: "dwmkerr", //signed-in username
      ssl: false, //Returned true for ArcGIS Online
      //"refresh_token": "GysTpIui-oxWTTIs" // ONLY returned when grant_type=authorization_code or grant_type=exchange_refresh_token
      //"refresh_token_expires_in": 604799, // expiration in seconds from now
    });

  nock("https://geocode.arcgis.com")
    .persist()
    .post("/arcgis/rest/services/World/GeocodeServer/suggest")
    .reply(200, (uri, requestBody) => {
      console.log(requestBody);
      return {
        response: {
          suggestions: [
            {
              text: "Blue Mountains, New South Wales, AUS",
              magicKey:
                "dHA9NCN0dj02NjJhODg0NiNubT1CbHVlIE1vdW50YWlucywgTmV3IFNvdXRoIFdhbGVzLCBBVVMjbG5nPTQxI2xuPVdvcmxk",
              isCollection: false,
            },
            {
              text: "Blue Mountains National Park, New South Wales, AUS",
              magicKey:
                "dHA9MCN0dj02NjJhODg0NiNsb2M9MzQ0MDA1MTcjbG5nPTQxI3BsPTI4Njk3MDEwI2xicz0xNDoxMjU1MDY5NSNsbj1Xb3JsZA==",
              isCollection: false,
            },
            {
              text: "Blue Mountains, The Blue Mountains, ON, CAN",
              magicKey:
                "dHA9MCN0dj02NjJhODg0NiNsb2M9MTg3MzQ5NDIjbG5nPTQxI3BsPTEzNzAwNDg0I2xicz0xNDoxMjU1MDU5MCNsbj1Xb3JsZA==",
              isCollection: false,
            },
            {
              text: "Blue Mountains Leisure Centres Blackheath, Gardiner Crescent, Blackheath, Blue Mountains, New South Wales, 2785, AUS",
              magicKey:
                "dHA9MCN0dj02NjJhODg0NiNsb2M9MzQzODc0OTAjbG5nPTQxI3BsPTI4Njc3ODc0I2xicz0xNDoxMjU1MDY3OSNsbj1Xb3JsZA==",
              isCollection: false,
            },
            {
              text: "Blue Mountains National Park, Govetts Leap Road, Blackheath, Blue Mountains, New South Wales, 2785, AUS",
              magicKey:
                "dHA9MCN0dj02NjJhODg0NiNsb2M9MzQzODc0OTcjbG5nPTQxI3BsPTI4Njc3ODgxI2xicz0xNDoxMjU1MDY5NSNsbj1Xb3JsZA==",
              isCollection: false,
            },
          ],
          severity: "DEBUG",
        },
        status: "ok",
        mode: "offline",
      };
    });
}
