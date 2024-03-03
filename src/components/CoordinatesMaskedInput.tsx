import * as React from "react";

import { Input, InputProps } from "@mui/joy";

//  Export the regex for a partial coordinate, i.e. one we are keying in, and a
//  complete coordinate, i.e. one that is valid to search against.
//  There are a large number of test fixtures for these rexes.
//  Use regex101 to debug these and the tests - they are complex.
export const CoordinateRexPartial =
  /^(-?\d*\.?\d*\s*),?(\s*(?<!-)-?\d*(?<!\.)\.?\d*)$/gm;
export const CoordinateRexComplete = /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*$/gm;

export function extractCoordinates(coordinates: string) {
  //  Apply the regex for the complete coordinates, grab the capture groups.
  const matches = Array.from(coordinates.matchAll(CoordinateRexComplete));
  if (!matches || !matches[0] || matches[0].length < 2) {
    throw new Error(`coordinate string '${coordinates}' is not valid`);
  }

  return {
    latitude: Number.parseFloat(matches[0][1]),
    longitude: Number.parseFloat(matches[0][2]),
  };
}

export interface CoordinatesMaskedInputProps extends InputProps {
  onChangeCoordinates?: (latitude: number, longitude: number) => void;
}

//  For Reference:
//  https://mui.com/joy-ui/react-input/#third-party-formatting
export default function CoordinatesMaskedInput(
  props: CoordinatesMaskedInputProps,
) {
  const [value, setValue] = React.useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    //  If our new value passes the partial rex, set it. Otherwise, leave the
    //  value unchanged.
    setValue(CoordinateRexPartial.test(newValue) ? newValue : value);

    //  If the value is also a valid complete coordinate, we can call the
    //  coordinate changed handler.
    if (props.onChangeCoordinates && CoordinateRexComplete.test(newValue)) {
      const { latitude, longitude } = extractCoordinates(newValue);
      props.onChangeCoordinates(latitude, longitude);
    }
  };

  return <Input {...props} value={value} onChange={(e) => onChange(e)} />;
}
