import { render, screen } from "@testing-library/react";
import LifelinePage from "./LifelinePage";
import { AlertContextProvider } from "../components/AlertContext";
import { DialogContextProvider } from "../components/DialogContext";
import { User } from "firebase/auth";

test("renders Lifeline header", () => {
  const fakeUser: Pick<User, "email"> = {
    email: "test@user.com",
  };
  render(
    <AlertContextProvider>
      <DialogContextProvider>
        <LifelinePage user={fakeUser} />
      </DialogContextProvider>
    </AlertContextProvider>,
  );
  const lifelineElement = screen.getByText(/Lifeline/i);
  expect(lifelineElement).toBeInTheDocument();
});
