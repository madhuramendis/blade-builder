"use client";
import { useState, useEffect } from "react";
import { storageGet, storageSet, storageRemove } from "./sheetsStorage";

const USERS_KEY       = "blade-builder-users";
const CURRENT_KEY     = "blade-builder-current-user";
export const MAX_USERS = 10;

export function useUsers() {
  const [users, setUsers]             = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [ready, setReady]             = useState(false);

  useEffect(() => {
    // Seed from localStorage instantly, then let Sheets override
    const lsCurrent = localStorage.getItem(CURRENT_KEY);

    storageGet<string[]>(USERS_KEY, []).then(stored => {
      const current = lsCurrent && stored.includes(lsCurrent) ? lsCurrent : null;
      setUsers(stored);
      setCurrentUser(current);
      setReady(true);
    });
  }, []);

  const login = (name: string) => {
    setCurrentUser(name);
    localStorage.setItem(CURRENT_KEY, name);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_KEY);
  };

  const createUser = (name: string): string | null => {
    const trimmed = name.trim();
    if (!trimmed)                  return "Name cannot be empty";
    if (users.includes(trimmed))   return "That name is already taken";
    if (users.length >= MAX_USERS) return `Max ${MAX_USERS} users reached`;
    const updated = [...users, trimmed];
    setUsers(updated);
    storageSet(USERS_KEY, updated);
    login(trimmed);
    return null;
  };

  const deleteUser = (name: string) => {
    const updated = users.filter(u => u !== name);
    setUsers(updated);
    storageSet(USERS_KEY, updated);
    // Remove all data for that user
    const keySuffixes = ["draft", "versions", "revisions"];
    keySuffixes.forEach(s => storageRemove(`blade-builder-${name}-${s}`));
    if (currentUser === name) {
      const next = updated[0] ?? null;
      if (next) login(next);
      else logout();
    }
  };

  return { users, currentUser, ready, login, logout, createUser, deleteUser };
}
