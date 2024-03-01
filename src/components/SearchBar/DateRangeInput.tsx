import { FormControl, FormLabel, Input, Stack } from "@mui/joy";

export interface DateRangeInputProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (startDate: Date) => void;
  onEndDateChange: (endDate: Date) => void;
}

export default function DateRangeInput(props: DateRangeInputProps) {
  return (
    <Stack direction="row" useFlexGap spacing={3}>
      <FormControl orientation="horizontal">
        <FormLabel sx={{ typography: "body-sm" }}>From</FormLabel>
        <Input
          id="start-date"
          type="date"
          aria-label="Date"
          value={props.startDate.toISOString().substring(0, 10) || ""}
          onChange={(e) => props.onStartDateChange(new Date(e.target.value))}
        />
      </FormControl>
      <FormControl orientation="horizontal">
        <FormLabel sx={{ typography: "body-sm" }}>To</FormLabel>
        <Input
          id="end-date"
          type="date"
          aria-label="Date"
          value={props.endDate.toISOString().substring(0, 10) || ""}
          onChange={(e) => props.onEndDateChange(new Date(e.target.value))}
        />
      </FormControl>
    </Stack>
  );
}
