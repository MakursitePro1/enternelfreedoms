import { createContext, useContext, type ReactNode } from 'react';

export const AdminPageContext = createContext<ReactNode>(null);

export function AdminPage() {
  return useContext(AdminPageContext);
}