import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getCountFromServer,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type Role = "Admin" | "Manager" | "Viewer";

interface AuthContextType {
  user: User | null;
  role: Role | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            // Document found — use the stored role
            const data = userDoc.data();
            console.log("[Auth] Role loaded:", data.role);
            setRole(data.role as Role);
          } else {
            // No document found — auto-create one.
            // The FIRST user ever to sign in becomes Admin.
            // Everyone after that defaults to Viewer (admin can promote them later).
            const usersSnap = await getCountFromServer(collection(db, "users"));
            const isFirstUser = usersSnap.data().count === 0;
            const assignedRole: Role = isFirstUser ? "Admin" : "Viewer";

            console.log(
              `[Auth] No user document found. ${
                isFirstUser
                  ? "First user — assigning Admin."
                  : "Assigning Viewer."
              }`,
            );

            await setDoc(userDocRef, {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName ?? "",
              role: assignedRole,
              createdAt: serverTimestamp(),
            });

            setRole(assignedRole);
          }
        } catch (error) {
          console.error("[Auth] Error during role setup:", error);
          setRole("Viewer");
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
