import { useEffect, useState } from "react";
import { Repository } from "./repository/Repository";
import { User, onAuthStateChanged } from "firebase/auth";

export default function useUserEffect(repository: Repository) {
  const [user, setUser] = useState<User | null>(null);

  //  Use an effect to wait for the user.
  useEffect(() => {
    //  Wait for the initial hydration of the user from any saved state...
    const waitForUser = async () => {
      const user = await repository.waitForUser();
      setUser(user);
    };
    waitForUser();

    //  ...then watch for the auth state changing.
    const unsubscribe = onAuthStateChanged(repository.getAuth(), (user) => {
      setUser(user || null);
    });

    //  To clean-up, unsubscribe from the auth state change.
    return () => unsubscribe();
  });

  return [user, setUser];
}
