'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../lib/cartContext';
import { getCartWhatsAppUrl } from '../lib/whatsapp';
import { getImageUrl } from '../lib/api';

function CartItemRow({ item, updateQuantity, removeFromCart }) {
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
  const displayImg = getImageUrl(item.imageUrl, fallbackImage);

  const [imgSrc, setImgSrc] = useState(displayImg);

  return (
    <div className="flex gap-3 p-3.5 bg-[#FAF9F0] rounded-2xl border border-[#E2E2C5] hover:border-[#C85A32]/40 transition-colors">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E2E2C5]">
        <Image
          src={imgSrc}
          alt={item.name}
          fill
          unoptimized
          onError={() => setImgSrc(fallbackImage)}
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-bold text-[#1C1917] line-clamp-2 leading-tight">
              {item.name}
            </h4>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-[#78716C] hover:text-rose-600 transition-colors p-0.5 shrink-0"
              title="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[10px] text-[#C85A32] font-semibold mt-0.5">
            {item.category}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E2E2C5]/60">
          <span className="text-xs font-black text-[#1C1917]">
            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
          </span>

          <div className="flex items-center gap-1.5 bg-white border border-[#E2E2C5] rounded-lg p-0.5">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-5 h-5 flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF9F0] rounded transition-colors"
              title="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-[#1C1917] w-6 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-5 h-5 flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF9F0] rounded transition-colors"
              title="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartDrawer({ businessPhone = '+919876543210' }) {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemsCount,
    subtotal,
    customerDetails,
    updateCustomerDetails,
  } = useCart();

  const [step, setStep] = useState('cart'); // 'cart' | 'address' | 'ordered'
  const [validationError, setValidationError] = useState('');

  if (!isCartOpen) return null;

  const handleInputChange = (field, value) => {
    updateCustomerDetails({ [field]: value });
    if (validationError) setValidationError('');
  };

  const handleProceedToAddress = () => {
    if (cart.length === 0) return;
    setStep('address');
  };

  const handleWhatsAppCheckout = () => {
    if (!customerDetails.fullName?.trim()) {
      setValidationError('Please enter your Full Name.');
      return;
    }
    if (!customerDetails.phone?.trim()) {
      setValidationError('Please enter your WhatsApp Mobile Number.');
      return;
    }
    if (!customerDetails.address?.trim()) {
      setValidationError('Please enter your Delivery Address.');
      return;
    }
    if (!customerDetails.city?.trim()) {
      setValidationError('Please enter your City / State.');
      return;
    }
    if (!customerDetails.pincode?.trim()) {
      setValidationError('Please enter your Pincode.');
      return;
    }

    // Generate formatted URL
    const waUrl = getCartWhatsAppUrl(cart, customerDetails, businessPhone);
    window.open(waUrl, '_blank');
    setStep('ordered');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] shadow-2xl border-l border-[#E2E2C5] flex flex-col justify-between text-[#1C1917] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#E2E2C5] flex items-center justify-between bg-[#F5F5DC]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C85A32] text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#1C1917]">
                  {step === 'cart' && 'Your Components Cart'}
                  {step === 'address' && 'Delivery & Contact Details'}
                  {step === 'ordered' && 'Order Placed on WhatsApp'}
                </h3>
                <p className="text-[11px] text-[#78716C]">
                  {step === 'cart' && `${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'items'} selected`}
                  {step === 'address' && 'Step 2 of 2: Shipping details'}
                  {step === 'ordered' && 'Order summary sent'}
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-white text-[#78716C] hover:text-[#1C1917] border border-[#E2E2C5] flex items-center justify-center transition-colors shadow-xs"
              aria-label="Close cart drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* STEP 1: CART ITEMS */}
            {step === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#FAF9F0] text-[#78716C] border border-[#E2E2C5] flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8 text-[#C85A32]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-[#1C1917]">Your Cart is Empty</h4>
                      <p className="text-xs text-[#78716C] mt-1 max-w-xs mx-auto">
                        Explore our catalogue to add microcontrollers, sensors, cables, and combo kits.
                      </p>
                    </div>
                    <Link
                      href="/products"
                      onClick={closeCart}
                      className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all"
                    >
                      <span>Browse Products</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <CartItemRow
                          key={item.id}
                          item={item}
                          updateQuantity={updateQuantity}
                          removeFromCart={removeFromCart}
                        />
                      ))}
                    </div>

                    <div className="pt-3 flex items-center justify-between text-xs text-[#78716C]">
                      <button
                        onClick={clearCart}
                        className="text-rose-600 hover:underline font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                      </button>
                      <Link
                        href="/products"
                        onClick={closeCart}
                        className="text-[#C85A32] hover:underline font-bold"
                      >
                        + Add More Components
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* STEP 2: ADDRESS DETAILS */}
            {step === 'address' && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-[#FAF9F0] rounded-2xl border border-[#E2E2C5] text-[11px] text-[#57534E] flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
                  <span>
                    Your order will be sent to our WhatsApp store team with these delivery details pre-formatted for rapid dispatch.
                  </span>
                </div>

                {validationError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerDetails.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerDetails.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                      Delivery Address (Flat / House / Street / Landmark) *
                    </label>
                    <textarea
                      rows="2"
                      required
                      value={customerDetails.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="e.g. Flat 302, Sunshine Heights, Near Tech Park"
                      className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                        City / State *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerDetails.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="e.g. Bengaluru, KA"
                        className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerDetails.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="e.g. 560001"
                        className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C85A32] focus:ring-1 focus:ring-[#C85A32]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                      Project / Lab Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={customerDetails.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="e.g. Urgent college submission, include invoice"
                      className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs text-[#1C1917] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ORDERED CONFIRMATION */}
            {step === 'ordered' && (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-lg text-[#1C1917]">WhatsApp Order Opened!</h4>
                  <p className="text-xs text-[#57534E] mt-1 max-w-xs mx-auto leading-relaxed">
                    Your full component list and address details were compiled and sent to our WhatsApp hotline. Send the pre-filled message to confirm with our store team!
                  </p>
                </div>

                <div className="p-4 bg-[#FAF9F0] rounded-2xl border border-[#E2E2C5] text-left text-xs space-y-1.5">
                  <p className="font-bold text-[#1C1917]">Order Summary:</p>
                  <p className="text-[#57534E]">Total Items: <b className="text-[#1C1917]">{totalItemsCount}</b></p>
                  <p className="text-[#57534E]">Total Amount: <b className="text-[#C85A32]">₹{subtotal.toLocaleString('en-IN')}</b></p>
                  <p className="text-[#57534E]">Delivery To: <b className="text-[#1C1917]">{customerDetails.fullName} ({customerDetails.pincode})</b></p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      clearCart();
                      closeCart();
                      setStep('cart');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#292524] text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Clear Cart & Finish
                  </button>
                  <button
                    onClick={() => {
                      closeCart();
                      setStep('cart');
                    }}
                    className="w-full py-2 rounded-xl text-[#78716C] hover:text-[#1C1917] font-semibold text-xs transition-colors"
                  >
                    Keep Cart Items
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          {cart.length > 0 && step !== 'ordered' && (
            <div className="p-5 sm:p-6 border-t border-[#E2E2C5] bg-[#FAF9F0] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#57534E]">Subtotal ({totalItemsCount} items)</span>
                <span className="text-lg font-black text-[#1C1917]">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={handleProceedToAddress}
                  className="flex items-center justify-center gap-2 w-full bg-[#1C1917] hover:bg-[#292524] text-white py-3.5 rounded-xl font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-98"
                >
                  <span>Proceed to Delivery Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20BA56] text-white py-3.5 rounded-xl font-bold text-xs shadow-md shadow-[#25D366]/25 hover:shadow-lg transition-all active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Place Order via WhatsApp (₹{subtotal.toLocaleString('en-IN')})</span>
                  </button>

                  <button
                    onClick={() => setStep('cart')}
                    className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Cart Items</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
