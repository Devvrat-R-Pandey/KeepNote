// src/reducers/authReducer.ts

export interface AuthState {
  userId: number | string | null;
  isAuthenticated: boolean;
  user?: {
    id: number | string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

export type AuthAction =
  | { type: "LOGIN"; payload: { userId: number | string; user?: AuthState["user"] } }
  | { type: "LOGOUT" };

/* ---------- Restore user from localStorage ---------- */

const storedUser = localStorage.getItem("loggedInUser");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

/* ---------- Initial Auth State ---------- */

export const initialAuthState: AuthState = {
  userId: parsedUser ? parsedUser.id : null,
  isAuthenticated: !!parsedUser,
  user: parsedUser || undefined,
};

/* ---------- Reducer ---------- */

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {

    case "LOGIN":

      if (action.payload.user) {
        localStorage.setItem("loggedInUser", JSON.stringify(action.payload.user));
      }

      return {
        userId: action.payload.userId,
        isAuthenticated: true,
        user: action.payload.user,
      };

    case "LOGOUT":

      localStorage.removeItem("loggedInUser");

      return {
        userId: null,
        isAuthenticated: false,
        user: undefined,
      };

    default:
      return state;
  }
}