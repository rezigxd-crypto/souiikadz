/**
 * CartContext — Pure localStorage. No Supabase.
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'suwaika-cart'

function loadCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = useCallback((product, qty = 1) => {
    setCart((c) => {
      const existing = c.findIndex((i) => i.id === product.id)
      if (existing >= 0) {
        const updated = [...c]
        const newQty = Math.min(updated[existing].qty + qty, product.stock || 99)
        updated[existing] = { ...updated[existing], qty: newQty }
        return updated
      }
      return [...c, { ...product, qty: Math.min(qty, product.stock || 99) }]
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCart((c) => c.filter((i) => i.id !== productId))
  }, [])

  const updateQty = useCallback((productId, qty) => {
    if (qty < 1) return
    setCart((c) => c.map((i) => (i.id === productId ? { ...i, qty: Math.min(qty, i.stock || 99) } : i)))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartTotal = cart.reduce((sum, i) => sum + (i.discount || i.price) * i.qty, 0)
  const cartSaved = cart.reduce((sum, i) => sum + (i.price - (i.discount || i.price)) * i.qty, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, cartTotal, cartSaved, cartCount, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
