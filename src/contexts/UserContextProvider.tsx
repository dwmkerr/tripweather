import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { User } from "firebase/auth";

export type RequireSignInFunc = (
  forMessage: string,
  detailsMessage: string,
) => void;

interface UserContextValue {
  user: User | null;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export const UserContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const value: UserContextValue = {
    user,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useUserContext must be used within a SettingsContextProvider",
    );
  }
  return context;
};
