import axios from "axios";

const USERS_URL = "http://localhost:3000/users";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age: number;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export async function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  try {
    const response = await axios.get<User[]>(USERS_URL, { timeout: 5000, signal });
    return response.data.map((user) => ({
      ...user,
      id: Number(user.id),
      age: Number(user.age),
    }));
  } catch (err) {
    if (axios.isCancel(err) || (err instanceof Error && err.name === "CanceledError")) return [];
    if (axios.isAxiosError(err)) {
      if (err.code === "ECONNABORTED") throw new Error("Request timed out after 5 seconds");
      if (err.response) throw new Error(`Server error ${err.response.status}: ${err.response.statusText}`);
    }
    throw new Error("Unable to fetch users. Is JSON Server running?");
  }
}

export async function addUser(user: Omit<User, "id">): Promise<User> {
  try {
    const existingUsers = await fetchUsers();
    const maxId = existingUsers.reduce((max, u) => Math.max(max, u.id), 0);
    const newUser: User = { ...user, id: maxId + 1 };
    const response = await axios.post<User>(USERS_URL, newUser, { timeout: 5000 });
    return {
      ...response.data,
      id: Number(response.data.id),
      age: Number(response.data.age),
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) throw new Error(`Failed to register user. Server responded with ${err.response.status}`);
      if (err.code === "ECONNABORTED") throw new Error("Request timed out");
    }
    throw new Error("Failed to register user. Please try again.");
  }
}