import { createContext } from 'react'

// Kept in its own module so the provider (a component) and useToast (a hook)
// can live in separate files and React Fast Refresh stays happy.
export const ToastContext = createContext(null)
