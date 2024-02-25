import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { ReactNode, useEffect, useState } from "react";
import { TripLocation, WeatherStatus } from "../lib/Location";
import { PirateWeatherIcon } from "../../functions/src/weather/PirateWeatherTypes";
import WeatherIcon from "./WeatherIcon/WeatherIcon";
import { Stack, Typography } from "@mui/joy";
import { CircularProgress } from "@mui/material";

const renderWeatherCell = (
  params: GridRenderCellParams<LocationRow>,
): ReactNode => {
  console.log(params);
  const [weather] = params.row.weather;
  const isLoading = params.row.weatherStatus === WeatherStatus.Loading;
  if (isLoading) {
    return (
      <Stack direction="column" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack direction="column" justifyContent="center" alignItems="center">
      <WeatherIcon weather={weather.icon || "unknown"} size={32} />
      <Typography level="body-xs">{weather.summary}</Typography>
    </Stack>
  );
};

const columns: GridColDef<LocationRow>[] = [
  {
    field: "title",
    headerName: "Location",
    width: 150,
    editable: true,
  },
  {
    field: "address",
    headerName: "Address",
    width: 150,
    editable: true,
  },
  {
    field: "weather",
    headerName: "Weather",
    width: 110,
    editable: true,
    renderCell: renderWeatherCell,
  },
];

export interface LocationRow {
  id: string;
  title: string;
  address: string;
  weatherStatus: WeatherStatus;
  weather: [
    {
      date: Date;
      summary?: string;
      icon?: PirateWeatherIcon;
    },
  ];
}

export interface LocationGridProps {
  locations: TripLocation[];
}

export default function LocationGrid({ locations }: LocationGridProps) {
  const [locationRows, setLocationRows] = useState<LocationRow[]>([]);
  useEffect(() => {
    const locationRows = locations.map((location): LocationRow => {
      return {
        id: location.id,
        title: location.originalSearch.address,
        address: location.candidate?.address || "<Unknown Address>",
        weatherStatus: location.weatherStatus,
        weather: [
          {
            date: new Date(),
            summary: location.weather?.summary,
            icon: location.weather?.icon,
          },
        ],
      };
    });
    setLocationRows(locationRows);
  }, [locations]);

  return (
    <DataGrid
      rows={locationRows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5]}
      checkboxSelection
      disableRowSelectionOnClick
    />
  );
}
