import * as React from "react";

import { Input, InputProps } from "@mui/joy";

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
}

export interface CoordinatesMaskedInputProps extends InputProps {
  coordinates: string;
  onChangeCoordinates?: (coordinates: string) => void;
  onCoordinatesValidityChanges?: (valid: boolean) => void;
}

//  Export the regex for a partial coordinate, i.e. one we are keying in, and a
//  complete coordinate, i.e. one that is valid to search against.
//  There are a large number of test fixtures for these rexes.
//  Use regex101 to debug these and the tests - they are complex.
export const CoordinateRexPartialStr =
  "^(-?d*.?d*s*),?(s*(?<!-)-?d*(?<!.).?d*)$";
export const CoordinateRexPartial =
  /^(-?\d*\.?\d*\s*),?(\s*(?<!-)-?\d*(?<!\.)\.?\d*)$/;
export const CoordinateRexComplete = /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*$/;

//  For Reference:
//  https://mui.com/joy-ui/react-input/#third-party-formatting
export default function CoordinatesMaskedInput(
  props: CoordinatesMaskedInputProps,
) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [value, setValue] = React.useState(props.coordinates);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //  Check the validity of our input based on the pattern then manually set
    //  the custom validity.
    const newValue = event.target.value;
    const input = inputRef.current;
    if (input !== null && newValue !== "") {
      const valid = CoordinateRexPartial.test(newValue);
      console.log(
        `tripweather: input ${newValue} - ${valid ? "valid" : "not valid"}`,
      );
      if (valid === false) {
        input.setCustomValidity(
          "Enter a value in the form lat,long, e.g 1.53,-2.37",
        );
      } else {
        input.setCustomValidity("");
      }
      input.reportValidity();
    }

    //  We can also now report back whether the coordinates are fully valid and
    //  ready to add.
    const fullyValid = CoordinateRexComplete.test(newValue);
    props.onCoordinatesValidityChanges?.(fullyValid);

    //  Finally, set the new value.
    setValue(newValue);
    props.onChangeCoordinates?.(newValue);
  };

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => onChange(e)}
      slotProps={{
        input: {
          ref: inputRef,
        },
      }}
    />
  );
}
