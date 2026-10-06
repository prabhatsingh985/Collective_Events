'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Lock,
  QrCode,
  Building,
  AlertCircle,
  Plus,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'
import { useStore } from '@/lib/store/useStore'
import { Address, Order } from '@/types/store'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, addresses, addAddress, addOrder, appliedCoupon } = useStore()

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1: Shipping Address State
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0]
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr?.id || '')
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [newFullName, setNewFullName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newAddressLine, setNewAddressLine] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newState, setNewState] = useState('')
  const [newPincode, setNewPincode] = useState('')

  // Step 2: Delivery State
  const [deliveryMethod, setDeliveryMethod] = useState<'bluedart' | 'delhivery'>('bluedart')

  // Step 3: Payment State
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Netbanking' | 'Cash on Delivery'>('UPI')
  const [upiVpa, setUpiVpa] = useState('collector@okhdfcbank')
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9840')
  const [cardExpiry, setCardExpiry] = useState('08/29')
  const [cardCvv, setCardCvv] = useState('884')
  const [selectedBank, setSelectedBank] = useState('HDFC Bank')

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const shippingFee = subtotal >= 999 || deliveryMethod === 'bluedart' ? 0 : 99

  let discount = 0
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100)
    } else {
      discount = appliedCoupon.value
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + shippingFee)
  const gstPortion = Math.round((subtotal * 18) / 118)

  const isCodAllowed = grandTotal <= 7500

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFullName || !newPhone || !newAddressLine || !newCity || !newPincode) return
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      fullName: newFullName,
      phone: newPhone,
      addressLine: newAddressLine,
      city: newCity,
      state: newState || 'Maharashtra',
      pincode: newPincode,
      isDefault: false,
    }
    addAddress(newAddr)
    setSelectedAddressId(newAddr.id)
    setShowNewAddressForm(false)
  }

  const handlePlaceOrder = () => {
    const chosenAddress = addresses.find((a) => a.id === selectedAddressId) || defaultAddr || {
      id: 'addr-fallback',
      fullName: 'Shreyash Srivastava',
      phone: '+91 98201 55902',
      addressLine: 'Flat 402, Sea Green Apartments, Carter Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      isDefault: true,
    }

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
    const newOrder: Order = {
      id: orderId,
      invoiceNumber: `INV-CRATE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'LABEL_GENERATED',
      items: cart.map((i) => ({
        product: i.product,
        quantity: i.quantity,
        priceAtPurchase: i.product.price,
      })),
      subtotal,
      gst: gstPortion,
      shippingFee,
      discount,
      total: grandTotal,
      shippingAddress: chosenAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'PAID',
      courier: deliveryMethod === 'bluedart' ? 'BlueDart Air Priority Express' : 'Delhivery Surface',
      trackingAwb: `BD-${Math.floor(100000000 + Math.random() * 900000000)}`,
      timeline: [
        {
          status: 'PACKED',
          title: 'Items Inspected & Placed in PET Clamshell Cases',
          description: 'Pristine packaging verified. Corner guards and bubble foam installed.',
          timestamp: 'Just Now',
          location: 'CrateMeet Central WMS (Mumbai)',
          completed: true,
        },
        {
          status: 'LABEL_GENERATED',
          title: 'Carrier Shipping Label Printed',
          description: 'Package ready for BlueDart evening air manifest dispatch.',
          timestamp: 'Just Now',
          location: 'Bandra Hub Sorting Center',
          completed: true,
        },
        {
          status: 'PICKED_UP',
          title: 'Carrier Pickup Scheduled',
          description: 'Awaiting courier vehicle scan.',
          timestamp: 'Expected Today 7:00 PM',
          completed: false,
        },
        {
          status: 'IN_TRANSIT',
          title: 'In Transit',
          description: 'Express BlueDart air transit to destination city.',
          timestamp: 'Expected Tomorrow',
          completed: false,
        },
        {
          status: 'OUT_FOR_DELIVERY',
          title: 'Out for Delivery',
          description: 'Assigned to delivery agent with OTP verification.',
          timestamp: 'Expected Tomorrow 11:00 AM',
          completed: false,
        },
        {
          status: 'DELIVERED',
          title: 'Delivered to Recipient',
          description: 'Handed over securely.',
          timestamp: 'Expected Tomorrow 2:00 PM',
          completed: false,
        },
      ],
    }

    addOrder(newOrder)
    router.push(`/shop/order-success?orderId=${orderId}`)
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
        <StoreNavbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-black">Your Cart is Empty</h2>
          <p className="text-xs text-zinc-400 mt-2">Add items to your cart before proceeding to checkout.</p>
          <Link href="/shop" className="mt-4 px-4 py-2 rounded-xl bg-hw-orange text-white font-bold text-xs">
            Return to Store
          </Link>
        </main>
        <StoreFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20">
        {/* Step Progress Stepper */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-zinc-800 -z-10" />
            {[
              { num: 1, label: 'Address' },
              { num: 2, label: 'Delivery' },
              { num: 3, label: 'Payment' },
              { num: 4, label: 'Review' },
            ].map((s) => {
              const isPast = step > s.num
              const isCurrent = step === s.num
              return (
                <div key={s.num} className="flex flex-col items-center bg-zinc-950 px-2">
                  <div
                    className={`w-9 h-9 rounded-full font-mono text-xs font-bold flex items-center justify-center transition-colors ${
                      isPast
                        ? 'bg-emerald-500 text-black'
                        : isCurrent
                        ? 'bg-hw-orange text-white ring-4 ring-orange-500/20'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-1.5 ${
                      isCurrent ? 'text-white' : 'text-zinc-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Step Body (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 space-y-6">
            {/* ================= STEP 1: ADDRESS ================= */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-hw-orange" />
                    <span>Select Shipping Destination</span>
                  </h2>
                  <button
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                    className="text-xs font-bold text-hw-orange hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {/* Saved Addresses Radio Group */}
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-hw-orange bg-zinc-850/80 shadow'
                          : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="checkout-address"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="mt-1 w-4 h-4 text-hw-orange bg-zinc-900 border-zinc-700"
                          />
                          <div>
                            <span className="font-extrabold text-sm text-white block">
                              {addr.fullName}
                            </span>
                            <span className="text-xs text-zinc-400 block mt-0.5">
                              {addr.addressLine}, {addr.city}, {addr.state} —{' '}
                              <strong className="text-zinc-300 font-mono">{addr.pincode}</strong>
                            </span>
                            <span className="text-xs text-zinc-500 font-mono block mt-1">
                              Phone: {addr.phone}
                            </span>
                          </div>
                        </div>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {/* New Address Form Modal/Section */}
                {showNewAddressForm && (
                  <form onSubmit={handleAddNewAddress} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
                    <h4 className="font-bold text-white text-sm">Add Collector Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Recipient Full Name"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500"
                      />
                      <input
                        type="text"
                        placeholder="Mobile Phone (+91)"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500"
                      />
                      <input
                        type="text"
                        placeholder="Street Address / Flat / Apt"
                        value={newAddressLine}
                        onChange={(e) => setNewAddressLine(e.target.value)}
                        className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 sm:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500"
                      />
                      <input
                        type="text"
                        placeholder="6-digit Pincode"
                        maxLength={6}
                        value={newPincode}
                        onChange={(e) => setNewPincode(e.target.value)}
                        className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 font-mono"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-hw-orange text-white font-bold"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-xl bg-hw-orange hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <span>Proceed to Delivery Option</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 2: DELIVERY ================= */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-zinc-800">
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-hw-orange" />
                    <span>Choose Armored Courier Delivery</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Every consignment includes high-density foam corner pads and double-walled cartons.
                  </p>
                </div>

                <div className="space-y-3">
                  <label
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === 'bluedart'
                        ? 'border-hw-orange bg-zinc-850/80 shadow'
                        : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="delivery-method"
                          checked={deliveryMethod === 'bluedart'}
                          onChange={() => setDeliveryMethod('bluedart')}
                          className="mt-1 w-4 h-4 text-hw-orange bg-zinc-900 border-zinc-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-white">
                              BlueDart Air Priority Express
                            </span>
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                              RECOMMENDED
                            </span>
                          </div>
                          <span className="text-xs text-zinc-400 block mt-1">
                            Dispatched via air cargo with live SMS/WhatsApp barcode tracking. Delivered in 24-48 hours.
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {subtotal >= 999 ? 'FREE' : '₹99'}
                      </span>
                    </div>
                  </label>

                  <label
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === 'delhivery'
                        ? 'border-hw-orange bg-zinc-850/80 shadow'
                        : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="delivery-method"
                          checked={deliveryMethod === 'delhivery'}
                          onChange={() => setDeliveryMethod('delhivery')}
                          className="mt-1 w-4 h-4 text-hw-orange bg-zinc-900 border-zinc-700"
                        />
                        <div>
                          <span className="font-extrabold text-sm text-white block">
                            Delhivery Ground Secure Surface
                          </span>
                          <span className="text-xs text-zinc-400 block mt-1">
                            Standard surface route. Delivered in 3-5 business days.
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-zinc-400">FREE</span>
                    </div>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Address</span>
                  </button>

                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 rounded-xl bg-hw-orange hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 3: PAYMENT ================= */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-zinc-800">
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-hw-orange" />
                    <span>Select Payment Option</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    All transactions are 256-bit encrypted with instant receipt generation.
                  </p>
                </div>

                {/* Payment Option Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                    { id: 'Card', label: 'Credit / Debit', icon: CreditCard },
                    { id: 'Netbanking', label: 'Netbanking', icon: Building },
                    { id: 'Cash on Delivery', label: 'COD (India)', icon: Truck, disabled: !isCodAllowed },
                  ].map((p) => {
                    const Icon = p.icon
                    const isSelected = paymentMethod === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        disabled={p.disabled}
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'border-hw-orange bg-zinc-850 text-white shadow'
                            : p.disabled
                            ? 'border-zinc-800 bg-zinc-950/20 text-zinc-600 cursor-not-allowed'
                            : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-bold">{p.label}</span>
                        {p.disabled && (
                          <span className="text-[9px] text-amber-500 font-mono">Max ₹7.5k</span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Sub-form based on payment method */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-3">
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-3">
                      <span className="font-bold text-white block">Instant UPI Transfer</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiVpa}
                          onChange={(e) => setUpiVpa(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          className="flex-1 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono text-xs"
                        />
                        <button
                          type="button"
                          className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                        >
                          Verify VPA
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Supports Google Pay, PhonePe, Paytm, and BHIM UPI.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'Card' && (
                    <div className="space-y-3">
                      <span className="font-bold text-white block">Card Details</span>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number"
                        className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono text-xs"
                        />
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV"
                          maxLength={4}
                          className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Netbanking' && (
                    <div className="space-y-2">
                      <span className="font-bold text-white block">Popular Indian Banks</span>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs"
                      >
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>State Bank of India (SBI)</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'Cash on Delivery' && (
                    <div className="space-y-1 text-zinc-400">
                      <span className="font-bold text-white block">Cash on Delivery</span>
                      <p className="text-[11px]">
                        Pay cash or UPI directly to the BlueDart courier partner upon package receipt.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Delivery</span>
                  </button>

                  <button
                    onClick={() => setStep(4)}
                    className="px-6 py-3 rounded-xl bg-hw-orange hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 4: REVIEW & PLACE ORDER ================= */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-zinc-800">
                  <h2 className="text-xl font-extrabold text-white">Final Review & Authorization</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Please inspect your shipping address and items before authorizing dispatch.
                  </p>
                </div>

                {/* Items Summary in review */}
                <div className="divide-y divide-zinc-800 rounded-xl bg-zinc-950 border border-zinc-800 p-4 text-xs">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-zinc-500 font-bold">{item.quantity}x</span>
                        <span className="font-bold text-white truncate max-w-xs">{item.product.title}</span>
                      </div>
                      <span className="font-mono text-white">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chosen Address & Payment snapshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="font-bold text-zinc-400 block mb-1">Delivering To:</span>
                    <p className="text-white font-medium">
                      {addresses.find((a) => a.id === selectedAddressId)?.fullName || 'Shreyash Srivastava'}
                    </p>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      {addresses.find((a) => a.id === selectedAddressId)?.addressLine},{' '}
                      {addresses.find((a) => a.id === selectedAddressId)?.city} -{' '}
                      {addresses.find((a) => a.id === selectedAddressId)?.pincode}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="font-bold text-zinc-400 block mb-1">Payment & Carrier:</span>
                    <p className="text-white font-medium">Method: {paymentMethod}</p>
                    <p className="text-emerald-400 text-[11px] mt-0.5">
                      Via {deliveryMethod === 'bluedart' ? 'BlueDart Air Express' : 'Delhivery Surface'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(3)}
                    className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Payment</span>
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-hw-orange to-red-600 hover:brightness-110 text-white font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-orange-600/30 transition-transform hover:scale-102 active:scale-98"
                  >
                    <Lock className="w-4 h-4 fill-white" />
                    <span>Authorize & Place Order (₹{grandTotal.toLocaleString('en-IN')})</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Column (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider border-b border-zinc-800 pb-3">
              Order Breakdown
            </h3>

            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span className="font-mono text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Savings</span>
                  <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Armored Courier Delivery</span>
                <span className="font-mono">
                  {shippingFee === 0 ? <strong className="text-emerald-400 text-[10px]">FREE</strong> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span>GST (18% embedded)</span>
                <span className="font-mono">₹{gstPortion.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-3 border-t border-zinc-800">
                <span>Grand Total</span>
                <span className="font-mono text-lg text-white">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-zinc-400 space-y-2 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Genuine Sealed Collector Packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Zero Risk 7-Day Replacement Policy</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
