/**
 * AuthContext — Pure localStorage. No external dependencies.
 * No race conditions. No OAuth redirects. No timing issues.
 *
 * 3 hardcoded accounts. Login → set user in state + localStorage.
 * Logout → clear. On mount → read from localStorage.
 * That's it.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'suwaika_user'

// ─── Hardcoded demo accounts ───────────────────────────────────────────────
const DEMO_ACCOUNTS = [
  {
    uid: 'admin-001',
    email: 'admin@sk.dz',
    password: 'admin123#',
    displayName: 'مدير المنصة',
    role: 'admin',
    phone: '0770 333 444',
    wilayaCode: 16,
    hasFarmerCard: false,
    hasCommercialRegistry: false,
    subscription: null,
    subscribedAt: null,
    balance: 0,
  },
  {
    uid: 'farmer-001',
    email: 'farmer@sk.dz',
    password: 'farmer123',
    displayName: 'مزرعة الخضراء',
    role: 'farmer',
    phone: '0555 111 222',
    wilayaCode: 16,
    hasFarmerCard: true,
    hasCommercialRegistry: true,
    subscription: 'seasonal',
    subscribedAt: new Date().toISOString(),
    balance: 48500,
  },
  {
    uid: 'client-001',
    email: 'client@sk.dz',
    password: 'client123',
    displayName: 'أحمد بن علي',
    role: 'consumer',
    phone: '0661 222 333',
    wilayaCode: 31,
    hasFarmerCard: false,
    hasCommercialRegistry: false,
    subscription: null,
    subscribedAt: null,
    balance: 0,
  },
]

// ─── User profiles store (localStorage) ────────────────────────────────────
const PROFILES_KEY = 'suwaika_profiles'

function loadProfiles() {
  try {
    const stored = JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]')
    // Merge with demo accounts (demo accounts are the base)
    const merged = [...DEMO_ACCOUNTS]
    for (const stored_profile of stored) {
      const idx = merged.findIndex((p) => p.uid === stored_profile.uid)
      if (idx >= 0) {
        merged[idx] = { ...merged[idx], ...stored_profile }
      } else {
        merged.push(stored_profile)
      }
    }
    return merged
  } catch {
    return [...DEMO_ACCOUNTS]
  }
}

function saveProfiles(profiles) {
  // Only save non-demo profiles (or modified ones)
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
}

function getAllProfiles() {
  return loadProfiles()
}

function updateProfileInStore(uid, updates) {
  const profiles = loadProfiles()
  const idx = profiles.findIndex((p) => p.uid === uid)
  if (idx >= 0) {
    profiles[idx] = { ...profiles[idx], ...updates }
    saveProfiles(profiles)
    return profiles[idx]
  }
  return null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount: read user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Refresh from profiles store (in case name/phone was updated)
        const profiles = getAllProfiles()
        const fresh = profiles.find((p) => p.uid === parsed.uid)
        setUser(fresh || parsed)
      }
    } catch {
      // ignore
    }
    setLoading(false)
  }, [])

  // ─── Login: check against hardcoded accounts ────────────────────────────
  const signIn = useCallback(async (email, password) => {
    const profiles = getAllProfiles()
    const found = profiles.find(
      (p) => p.email === email && p.password === password
    )
    if (!found) {
      throw new Error('بيانات الدخول غير صحيحة')
    }
    // Don't store password in the session
    const { password: _pw, ...sessionUser } = found
    setUser(sessionUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser))
    return sessionUser
  }, [])

  // ─── Sign up: create new account in localStorage ────────────────────────
  const signUp = useCallback(async (data) => {
    const profiles = getAllProfiles()
    if (profiles.some((p) => p.email === data.email)) {
      throw new Error('هذا البريد مُستخدم بالفعل')
    }
    const newUser = {
      uid: 'user-' + Date.now(),
      email: data.email,
      password: data.password,
      displayName: data.name || data.email.split('@')[0],
      role: data.role || 'consumer',
      phone: data.phone || '',
      wilayaCode: data.wilayaCode || null,
      hasFarmerCard: !!data.hasFarmerCard,
      hasCommercialRegistry: !!data.hasCommercialRegistry,
      subscription: null,
      subscribedAt: null,
      balance: 0,
    }
    profiles.push(newUser)
    saveProfiles(profiles)
    // Don't store password in the session
    const { password: _pw, ...sessionUser } = newUser
    setUser(sessionUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser))
    return sessionUser
  }, [])

  // ─── Sign out ─────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // ─── Update profile (name, phone, etc.) ──────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    if (!user) return null
    const updated = updateProfileInStore(user.uid, updates)
    if (updated) {
      const { password: _pw, ...sessionUser } = updated
      setUser(sessionUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser))
    }
    return user
  }, [user])

  // ─── Subscribe to plan ───────────────────────────────────────────────────
  const subscribeToPlan = useCallback(async (planId) => {
    if (!user) return null
    const updated = updateProfileInStore(user.uid, {
      subscription: planId,
      subscribedAt: new Date().toISOString(),
    })
    if (updated) {
      const { password: _pw, ...sessionUser } = updated
      setUser(sessionUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser))
    }
    return user
  }, [user])

  // ─── Get all users (admin only) ──────────────────────────────────────────
  const listAllUsers = useCallback(() => {
    return getAllProfiles().map((p) => {
      const { password, ...safe } = p
      return safe
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        updateProfile,
        subscribeToPlan,
        listAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
