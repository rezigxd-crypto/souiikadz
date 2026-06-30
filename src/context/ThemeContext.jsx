/**
 * ThemeContext — light theme only.
 *
 * Dark mode has been removed per project requirements.
 * The context still exists for backward compatibility and to provide
 * theme tokens (we keep a `dark` value that's always `false` so any
 * legacy code that reads it doesn't crash). New code should use CSS
 * variables defined in index.css.
 */
import { createContext, useContext } from 'react'

const ThemeContext = createContext({ dark: false })

export function ThemeProvider({ children }) {
  // Light theme — set the class on <html> for any CSS that targets it.
  return (
    <ThemeContext.Provider value={{ dark: false }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
