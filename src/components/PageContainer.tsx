import { Fragment, PropsWithChildren } from "react";
import { useAlertContext } from "./AlertContext";
import { AlertSnackbar } from "./AlertSnackbar";

export default function PageContainer(props: PropsWithChildren) {
  const { alertInfo, setAlertInfo } = useAlertContext();

  return (
    <Fragment>
      {props.children}
      {alertInfo && (
        <AlertSnackbar
          alertInfo={alertInfo}
          onDismiss={() => setAlertInfo(null)}
        />
      )}
    </Fragment>
  );
}
