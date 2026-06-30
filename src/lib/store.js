/**
 * localStorage data store — products, transactions, cart.
 * No external dependencies. Pure localStorage.
 */
import { PRODUCTS } from '../data'

const PRODUCTS_KEY = 'suwaika_products'
const TRANSACTIONS_KEY = 'suwaika_transactions'

// ─── Products ───────────────────────────────────────────────────────────────
export function getProducts() {
  try {
    const stored = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || 'null')
    if (stored && stored.length > 0) return stored
  } catch { /* ignore */ }
  // Seed from data file on first run
  const seeded = PRODUCTS.map((p) => ({
    ...p,
    farmerEmail: p.farmerEmail || 'farmer@sk.dz',
    farmerId: 'farmer-001',
    postedAt: p.postedAt || Date.now(),
  }))
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seeded))
  return seeded
}

export function getProduct(id) {
  const products = getProducts()
  return products.find((p) => p.id === parseInt(id))
}

export function getFarmerProducts(farmerId) {
  return getProducts().filter((p) => p.farmerId === farmerId)
}

export function createProduct(product) {
  const products = getProducts()
  const newId = Math.max(...products.map((p) => p.id), 0) + 1
  const newProduct = {
    id: newId,
    ...product,
    postedAt: Date.now(),
    rating: 4.5,
    reviews: 0,
  }
  products.unshift(newProduct)
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  return newProduct
}

export function deleteProduct(id) {
  const products = getProducts().filter((p) => p.id !== id)
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

// ─── Transactions ───────────────────────────────────────────────────────────
const COMMISSION_RATE = 0.05

export function getTransactions() {
  try {
    return JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]')
  } catch {
    return []
  }
}

export function createTransaction(transaction) {
  const txns = getTransactions()
  const commission = Math.round(transaction.total * COMMISSION_RATE)
  const farmerPayout = transaction.total - commission
  const newTxn = {
    id: 'TXN-' + Date.now(),
    clientId: transaction.clientId,
    clientName: transaction.clientName,
    farmerId: transaction.farmerId,
    farmerName: transaction.farmerName,
    productId: transaction.productId,
    productName: transaction.productName,
    quantity: transaction.quantity,
    unitPrice: transaction.unitPrice,
    total: transaction.total,
    commission,
    farmerPayout,
    status: 'pending',
    paymentMethod: transaction.paymentMethod || 'cod',
    createdAt: new Date().toISOString(),
  }
  txns.unshift(newTxn)
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txns))
  return newTxn
}

export function completeTransaction(txnId) {
  const txns = getTransactions()
  const idx = txns.findIndex((t) => t.id === txnId)
  if (idx < 0) return null
  txns[idx].status = 'completed'
  txns[idx].completedAt = new Date().toISOString()
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txns))
  return txns[idx]
}

export function getClientTransactions(clientId) {
  return getTransactions().filter((t) => t.clientId === clientId)
}

export function getFarmerTransactions(farmerId) {
  return getTransactions().filter((t) => t.farmerId === farmerId)
}

export function getFarmerEarnings(farmerId) {
  return getFarmerTransactions(farmerId)
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.farmerPayout, 0)
}

export function getTotalCommission() {
  return getTransactions()
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.commission, 0)
}
