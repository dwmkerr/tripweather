import * as React from "react";
import Stack from "@mui/joy/Stack";
import { OrderByDirection } from "firebase/firestore";

import { useAlertContext } from "../components/AlertContext";
import { useDialogContext } from "../components/DialogContext";
import BasicTimeline from "../components/BasicTimeline";
import NavBar from "../components/NavBar";
import Filters, { FilterSettings, applyFilters } from "../components/Filters";
import AddEditEventModal, {
  AddEditEventMode,
} from "../components/AddEditEventModal";
import { AlertSnackbar } from "../components/AlertSnackbar";
import { LifelineRepository } from "../lib/LifelineRepository";
import { useEffect, useState } from "react";
import { LifeEvent, EventCategory, ecEmpty, ecUnique } from "../lib/LifeEvent";
import { CategoryColor } from "../lib/CategoryColor";
import ImportEventsDialog from "../components/ImportEventsDialog";
import ExportEventsDialog from "../components/ExportEventsDialog";
import UserSettingsModal from "../components/UserSettingsModal";
import CategoriesModal from "../components/CategoriesModal";
import { UserSettings } from "../lib/UserSettings";
import TimelineHeader from "../components/TimelineHeader";
import DeleteEventModal from "../components/DeleteEventModal";
import { CircularProgress } from "@mui/joy";
import { LifelineError } from "../lib/Errors";
import FeedbackModal from "../components/FeedbackModal";
import { User } from "firebase/auth";

export interface LifelinePageProps {
  user: Pick<User, "email">;
}

export default function LifelinePage(props: LifelinePageProps) {
  const repository = LifelineRepository.getInstance();
  const { alertInfo, setAlertInfo, setAlertFromError } = useAlertContext();
  const {
    showImportDialog,
    setShowImportDialog,
    showExportDialog,
    setShowExportDialog,
    showAddEventDialog,
    setShowAddEventDialog,
    showUserSettingsDialog,
    setShowUserSettingsDialog,
    showCategoriesDialog,
    setShowCategoriesDialog,
    deleteEventModalEvent,
    setDeleteEventModalEvent,
    editEventModalEvent,
    setEditEventModalEvent,
    showFeedbackDialog,
    setShowFeedbackDialog,
  } = useDialogContext();
  const [userSettings] = useState<UserSettings | null>(null);
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([]);
  const [filteredLifeEvents, setFilteredLifeEvents] = useState<LifeEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    selectedCategories: [],
    includeMinor: true,
    startDate: undefined,
    endDate: undefined,
  });
  const [searchText, setSearchText] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<OrderByDirection>("asc");
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    try {
      const unsubscribe = repository.subscribeToLifeEvents((lifeEvents) => {
        setLifeEvents(lifeEvents);
        setLoading(false);
      }, sortDirection);
      return unsubscribe;
    } catch (err) {
      setAlertFromError(LifelineError.fromError("Load Events Error", err));
      return () => undefined;
    }
  }, [sortDirection]);

  useEffect(() => {
    if (lifeEvents.length === 0) {
      return;
    }

    //  If we have any events, we'll build our category list.
    const allCategories = lifeEvents.map((le) => le.category);
    const uniqueCategories = ecUnique(allCategories);
    const categoryNames = categories.map((c) => c.name);
    setCategoryColors(CategoryColor.getColors(categoryNames));
    setCategories(uniqueCategories);

    //  Short cut. For now, any changes to events resets the category filter.
    setFilterSettings({
      ...filterSettings,
      selectedCategories: [ecEmpty, ...uniqueCategories],
    });

    //  Any newly added categories should be added to the selection. If we have
    //  have no cateories, select them all.
    // const newCategories = categories.filter(
    //   (uc) => ecContains(categories, uc) === false,
    // );
    // setFilterSettings({
    //   ...filterSettings,
    //   selectedCategories:
    //     filterSettings.selectedCategories.length === 0
    //       ? [ecEmpty, ...uniqueCategories]
    //       : ecUnique([
    //           ecEmpty,
    //           ...filterSettings.selectedCategories,
    //           ...newCategories,
    //         ]),
    // });
  }, [lifeEvents]);

  //  Filter the events and apply the search.
  useEffect(() => {
    setFilteredLifeEvents(applyFilters(lifeEvents, filterSettings, searchText));
  }, [lifeEvents, searchText, filterSettings]);

  return (
    <React.Fragment>
      <NavBar searchText={searchText} onSearchTextChanged={setSearchText} />
      <Stack
        component="main"
        direction="column"
        sx={{
          height: "100%",
        }}
      >
        <Stack direction="column" alignItems="center" flexGrow={1}>
          <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
            <TimelineHeader
              sortDirection={sortDirection}
              onSetSortDirection={setSortDirection}
            />
            <Filters
              filterSettings={filterSettings}
              onChangeFilterSettings={setFilterSettings}
              categories={categories}
              categoryColors={categoryColors}
            />
          </Stack>
          {loading ? (
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{
                width: "100%",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Stack>
          ) : (
            <BasicTimeline
              lifeEvents={filteredLifeEvents}
              categoryColors={categoryColors}
              showAgeDOB={
                userSettings?.showAgeOnTimeline && userSettings.dateOfBirth
                  ? userSettings.dateOfBirth
                  : undefined
              }
            />
          )}
          {alertInfo && (
            <AlertSnackbar
              alertInfo={alertInfo}
              onDismiss={() => setAlertInfo(null)}
            />
          )}
          {showImportDialog && (
            <ImportEventsDialog onClose={() => setShowImportDialog(false)} />
          )}
          {showExportDialog && (
            <ExportEventsDialog onClose={() => setShowExportDialog(false)} />
          )}
          {showAddEventDialog && (
            <AddEditEventModal
              mode={AddEditEventMode.Add}
              cateories={categories}
              onClose={() => setShowAddEventDialog(false)}
            />
          )}
          {editEventModalEvent !== undefined && (
            <AddEditEventModal
              mode={AddEditEventMode.Edit}
              event={editEventModalEvent}
              cateories={categories}
              onClose={() => setEditEventModalEvent(undefined)}
            />
          )}
          {showUserSettingsDialog && userSettings && (
            <UserSettingsModal
              userSettings={userSettings}
              onClose={() => setShowUserSettingsDialog(false)}
            />
          )}
          {showCategoriesDialog && (
            <CategoriesModal
              categories={categories}
              onClose={() => setShowCategoriesDialog(false)}
            />
          )}
          {showFeedbackDialog && (
            <FeedbackModal
              email={props.user.email || undefined}
              onClose={() => setShowFeedbackDialog(false)}
            />
          )}
          {deleteEventModalEvent !== undefined && (
            <DeleteEventModal
              event={deleteEventModalEvent}
              onCancel={() => setDeleteEventModalEvent(undefined)}
              onDeleteEvent={(event) => {
                repository.delete(event.id);
                setDeleteEventModalEvent(undefined);
              }}
            />
          )}
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
