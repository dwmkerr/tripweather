import { Fragment } from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/joy/Typography";

export default function ErrorPage() {
  return (
    <Fragment>
      <Typography level="h1">Error</Typography>
      <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
        Page Not Found
      </Typography>
      <Typography>
        Can't find the page you are looking for -{" "}
        <Link to="">back to home</Link>
      </Typography>
    </Fragment>
  );
}
