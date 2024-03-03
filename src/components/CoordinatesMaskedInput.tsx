import * as React from "react";
import { IMaskInput } from "react-imask";

import { Input, InputProps } from "@mui/joy";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

//  Export the regex for a partial coordinate, i.e. one we are keying in, and a
//  complete coordinate, i.e. one that is valid to search against.
//  There are a large number of test fixtures for these rexes.
export const CoordinateRexPartial = /^-?\d+\.?\d+\s*,?\s*-?\d*\.?\d*$/;
export const CoordinateRexComplete = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/;

const TextMaskAdapter = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskAdapter(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        //  bug - the leading hyphen and the comma don't input
        mask={CoordinateRexPartial}
        // mask={/[-]?\d+[\.]?\d*\s*[,]?\s*[-]?\d+[\.]?\d*/}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        type="text"
      />
    );
  },
);

export type CoordinatesMaskedInputProps = InputProps;

//  For Reference:
//  https://mui.com/joy-ui/react-input/#third-party-formatting
export default function CoordinatesMaskedInput(
  props: CoordinatesMaskedInputProps,
) {
  const [value, setValue] = React.useState("");
  return (
    <Input
      {...props}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      slotProps={{ input: { component: TextMaskAdapter } }}
    />
  );
}
