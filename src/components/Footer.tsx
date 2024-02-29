import { Stack, Typography } from "@mui/joy";
import pkg from "../../package.json";
import { Link } from "@mui/material";

export default function Footer() {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      padding={2}
    >
      <Typography level="body-xs">
        Version {pkg.version} |{" "}
        <Link
          href="https://github.com/dwmkerr/tripweather"
          target="_blank"
          rel="noopener"
        >
          GitHub
        </Link>{" "}
        | Location Data:{" "}
        <Link href="https://www.arcgis.com" target="_blank" rel="noopener">
          ArcGIS
        </Link>{" "}
        | Weather Data:{" "}
        <Link href="https://pirateweather.net/" target="_blank" rel="noopener">
          PirateWeather
        </Link>{" "}
      </Typography>
    </Stack>
  );
}
