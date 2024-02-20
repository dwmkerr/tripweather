import { Fragment, useState } from "react";
import Button from "@mui/joy/Button";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import FormLabel from "@mui/joy/FormLabel";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import { DialogActions, Input } from "@mui/joy";

import DownloadIcon from "@mui/icons-material/Download";

import { LifelineRepository } from "../lib/LifelineRepository";
import { exportCsv } from "../lib/LifelineCsv";

interface ExportEventsDialogProps {
  onClose: (imported: boolean) => void;
}

export default function ExportEventsDialog(props: ExportEventsDialogProps) {
  const repository = LifelineRepository.getInstance();

  const [fileName, setFileName] = useState<string>("lifeline.csv");
  const [titleColumn, setTitleColumn] = useState<string>("Title");
  const [categoryColumn, setCategoryColumn] = useState("Category");
  const [yearColumn, setYearColumn] = useState("Year");
  const [monthColumn, setMonthColumn] = useState("Month");
  const [dayColumn, setDayColumn] = useState("Day");
  const [notesColumn, setNotesColumn] = useState("Notes");
  const [minorColumn, setMinorColumn] = useState("Minor");
  const [exporting, setExporting] = useState(false);

  const exportEvents = async () => {
    setExporting(true);
    // Create a Blob from the JSON data
    const data = await repository.backup();
    const csv = await exportCsv(data, {
      columnMappings: {
        title: titleColumn,
        category: categoryColumn,
        year: yearColumn,
        month: monthColumn,
        day: dayColumn,
        notes: notesColumn,
        minor: minorColumn,
      },
    });

    const blob = new Blob([csv], {
      type: "application/json",
    });

    //  Create the link, download the content, clean up.
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExporting(false);
    props.onClose(true);
  };

  const input = (
    title: string,
    value: string,
    set: (value: string) => void,
  ) => {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <FormLabel>{title}</FormLabel>
        <Input
          required={true}
          value={value}
          onChange={(e) => set(e.target.value)}
          sx={{
            minWidth: 320,
          }}
        />
      </Stack>
    );
  };

  return (
    <Modal open={true} onClose={() => props.onClose(false)}>
      <ModalDialog>
        <DialogTitle>Export Events</DialogTitle>
        <Fragment>
          <DialogContent>
            Please specify the column names you would like to use in the
            exported CSV file.
          </DialogContent>
          {input("Filename", fileName, setFileName)}
          {input("Title Column", titleColumn, setTitleColumn)}
          {input("Category Column", categoryColumn, setCategoryColumn)}
          {input("Year Column", yearColumn, setYearColumn)}
          {input("Month Column", monthColumn, setMonthColumn)}
          {input("Day Column", dayColumn, setDayColumn)}
          {input("Notes Column", notesColumn, setNotesColumn)}
          {input("Minor Column", minorColumn, setMinorColumn)}
          <DialogActions>
            <Button
              color="primary"
              variant="solid"
              size="sm"
              startDecorator={<DownloadIcon />}
              loading={exporting}
              onClick={() => exportEvents()}
            >
              Export
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => props.onClose(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </Fragment>
      </ModalDialog>
    </Modal>
  );
}
