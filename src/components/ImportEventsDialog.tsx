import { Fragment, useState } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

import { AlertType, useAlertContext } from "./AlertContext";
import { checkCsvContents, importCsv } from "../lib/LifelineCsv";
import { Checkbox, DialogActions, Option, Select } from "@mui/joy";
import { LifelineRepository } from "../lib/LifelineRepository";
import FileUploadButton from "./FileUploadButton";

interface ImportEventsDialogProps {
  onClose: (imported: boolean) => void;
}

export default function ImportEventsDialog(props: ImportEventsDialogProps) {
  const repository = LifelineRepository.getInstance();
  const { setAlertInfo } = useAlertContext();

  const [fileContents, setFileContents] = useState<string>("");
  const [dataUploaded, setDataUploaded] = useState<boolean>(false);
  const [columns, setColumns] = useState<string[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);

  const [titleColumn, setTitleColumn] = useState<string | null>(null);
  const [categoryColumn, setCategoryColumn] = useState<string | null>(null);
  const [yearColumn, setYearColumn] = useState<string | null>(null);
  const [monthColumn, setMonthColumn] = useState<string | null>(null);
  const [dayColumn, setDayColumn] = useState<string | null>(null);
  const [notesColumn, setNotesColumn] = useState<string | null>(null);
  const [minorColumn, setMinorColumn] = useState<string | null>(null);
  const [deleteExistingEvents, setDeleteExistingEvents] = useState(false);
  const [importing, setImporting] = useState(false);

  const onFileUploadComplete = async (fileContents: string) => {
    setFileContents(fileContents);
    setDataUploaded(true);
    const { columns, rowCount } = await checkCsvContents(fileContents);
    setColumns(columns);
    setRowCount(rowCount);

    //  Make a best guess at the columns.
    setTitleColumn(columns.find((c) => /title/i.test(c)) || "");
    setCategoryColumn(columns.find((c) => /cat/i.test(c)) || "");
    setYearColumn(columns.find((c) => /year/i.test(c)) || "");
    setMonthColumn(columns.find((c) => /mon/i.test(c)) || "");
    setDayColumn(columns.find((c) => /day/i.test(c)) || "");
    setNotesColumn(columns.find((c) => /notes/i.test(c)) || "");
    setMinorColumn(columns.find((c) => /minor/i.test(c)) || "");
  };

  const importFileContents = async () => {
    setImporting(true);
    const results = await importCsv(fileContents, {
      columnMappings: {
        title: titleColumn || "",
        category: categoryColumn || "",
        year: yearColumn || "",
        month: monthColumn || "",
        day: dayColumn || "",
        notes: notesColumn || "",
        minor: minorColumn || "",
      },
    });
    const { lifeEvents, warnings } = results;
    await repository.restore(lifeEvents, deleteExistingEvents);
    setImporting(false);
    props.onClose(true);
    if (warnings.length > 0) {
      setAlertInfo({
        title: `Imported with ${warnings.length} warning(s)`,
        message: `Imported ${lifeEvents.length} events with ${warnings.length} warning(s)`,
        type: AlertType.Warning,
      });
    } else {
      setAlertInfo({
        title: `Imported ${lifeEvents.length} Events`,
        message: `Imported ${lifeEvents.length} with 0 warnings`,
        type: AlertType.Success,
      });
    }
  };

  const columnOptions = (columns: string[]) =>
    columns.map((c) => (
      <Option key={c} value={c}>
        {c}
      </Option>
    ));
  const columnSelect = (
    title: string,
    value: string | null,
    set: (value: string | null) => void,
  ) => {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <FormLabel>{title}</FormLabel>
        <Select
          required={true}
          value={value}
          onChange={(e, value) => set(value)}
          sx={{
            minWidth: 320,
          }}
        >
          {columnOptions(columns)}
        </Select>
      </Stack>
    );
  };

  return (
    <Modal open={true} onClose={() => props.onClose(false)}>
      <ModalDialog>
        <DialogTitle>Import Events</DialogTitle>

        {dataUploaded === false && (
          <Fragment>
            <DialogContent>
              Select a CSV file to upload events from.
            </DialogContent>
            <DialogActions>
              <FileUploadButton
                startDecorator={<FileUploadIcon />}
                color="primary"
                variant="solid"
                size="sm"
                onFileUploadComplete={onFileUploadComplete}
              />
              <Button
                variant="plain"
                color="neutral"
                onClick={() => props.onClose(false)}
              >
                Cancel
              </Button>
            </DialogActions>
          </Fragment>
        )}

        {dataUploaded === true && (
          <Fragment>
            <DialogContent>
              Found {rowCount} rows - please specify how to map the columns.
            </DialogContent>
            {columnSelect("Title", titleColumn, setTitleColumn)}
            {columnSelect("Category", categoryColumn, setCategoryColumn)}
            {columnSelect("Year", yearColumn, setYearColumn)}
            {columnSelect("Month", monthColumn, setMonthColumn)}
            {columnSelect("Day", dayColumn, setDayColumn)}
            {columnSelect("Notes", notesColumn, setNotesColumn)}
            {columnSelect("Minor", minorColumn, setMinorColumn)}
            <FormControl>
              <Checkbox
                label="Delete Existing Events"
                checked={deleteExistingEvents}
                onChange={(e) => setDeleteExistingEvents(e.target.checked)}
              />
            </FormControl>
            <DialogActions>
              <Button
                color="primary"
                variant="solid"
                size="sm"
                startDecorator={<SaveAltIcon />}
                loading={importing}
                onClick={() => importFileContents()}
              >
                Import
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
        )}
      </ModalDialog>
    </Modal>
  );
}
