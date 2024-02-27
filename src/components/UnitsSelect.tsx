import { Option, Select } from "@mui/joy";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import { WeatherUnits } from "../../functions/src/weather/PirateWeatherTypes";

export interface UnitsSelectProps {
  units: WeatherUnits;
  onChange?: (units: WeatherUnits) => void;
}

export default function UnitsSelect({ units, onChange }: UnitsSelectProps) {
  return (
    <Select
      placeholder="Units"
      startDecorator={<DeviceThermostatIcon />}
      sx={{ width: 160 }}
      value={units}
      onChange={(e, value) => value !== null && onChange?.(value)}
    >
      <Option value="ca">C˚, km/h</Option>
      <Option value="us">F˚, mph</Option>
      <Option value="uk">C˚, mph</Option>
      <Option value="si">C˚, m/s</Option>
    </Select>
  );
}
