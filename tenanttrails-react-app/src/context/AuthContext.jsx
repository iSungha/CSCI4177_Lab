import { createContext, useContext, useEffect, useState } from "react";
import { initialUsers } from "../data/mockData";

const AuthContext = createContext();

const USERS_KEY = "tenanttrails_users";
const CURRENT_USER_KEY = "tenanttrails_current_user";

function loadUsers() {
  const savedUsers = localStorage.getItem(USERS_KEY);

  if (savedUsers) {
    return JSON.parse(savedUsers);
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  return initialUsers;
}

function loadCurrentUser() {
  const savedUser = localStorage.getItem(CURRENT_USER_KEY);
  return savedUser ? JSON.parse(savedUser) : null;
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers);
  const [user, setUser] = useState(loadCurrentUser);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  function login(email, password) {
    const foundUser = users.find(
      (storedUser) =>
        storedUser.email.toLowerCase() === email.trim().toLowerCase() &&
        storedUser.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const safeUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
    };

    setUser(safeUser);

    return {
      success: true,
      user: safeUser,
    };
  }

  function signup(name, email, password) {
    const emailExists = users.some(
      (storedUser) =>
        storedUser.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (emailExists) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    setUsers((currentUsers) => [...currentUsers, newUser]);

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    setUser(safeUser);

    return {
      success: true,
      user: safeUser,
    };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, users, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}