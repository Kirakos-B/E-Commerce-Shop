import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/orderService";
import Spinner from "../../components/shared/Spinner";

type PaymentMethod = "cash" | "card" | "transfer";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Shipping
  const [country, setCountry] = useState("Ethiopia");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  // Guest info
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-primary/60 text-lg mb-4">Your cart is empty.</p>
        <Link to="/shop" className="btn-primary inline-block">
          Go to Shop
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        items: items.map(({ product, quantity }) => ({
          product: product._id,
          quantity,
        })),
        shippingAddress: { street, city, state, country, zip },
        paymentMethod,
        notes: notes || undefined,
        guestInfo: !isAuthenticated
          ? { name: guestName, email: guestEmail, phone: guestPhone }
          : undefined,
      };

      const order = await createOrder(payload);
      clearCart();
      navigate(`/order-confirmation/${order._id}`);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to place order. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold text-primary mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Info (if not logged in) */}
            {!isAuthenticated && (
              <div className="card p-6">
                <h2 className="font-serif text-xl font-bold text-primary mb-4">
                  Your Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="input-field"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <p className="text-sm text-primary/50 mt-4">
                  Have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-medium hover:underline"
                  >
                    Sign in
                  </Link>{" "}
                  for a faster checkout.
                </p>
              </div>
            )}

            {/* Shipping Address */}
            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-primary mb-4">
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Sub-city / Street Address
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Bole, Near Edna Mall"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Addis Ababa"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Region
                    </label>
                    <select
                      className="input-field"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    >
                      <option value="">Select region...</option>
                      <option>Addis Ababa</option>
                      <option>Afar</option>
                      <option>Amhara</option>
                      <option>Benishangul-Gumuz</option>
                      <option>Dire Dawa</option>
                      <option>Gambela</option>
                      <option>Harari</option>
                      <option>Oromia</option>
                      <option>Sidama</option>
                      <option>Somali</option>
                      <option>South Ethiopia</option>
                      <option>SNNPR</option>
                      <option>Tigray</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      Postal Code
                      <span className="text-primary/40 font-normal ml-1">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 1000"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-primary mb-4">
                Payment Method
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { value: "cash", label: "Cash on Delivery", emoji: "💵" },
                  { value: "transfer", label: "Bank Transfer", emoji: "🏦" },
                  { value: "card", label: "Card", emoji: "💳" },
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() =>
                      setPaymentMethod(method.value as PaymentMethod)
                    }
                    className={`p-4 rounded-xl border-2 text-sm font-medium transition-colors text-left ${
                      paymentMethod === method.value
                        ? "border-primary bg-primary text-secondary"
                        : "border-secondary-dark text-primary hover:border-primary"
                    }`}
                  >
                    <div className="text-2xl mb-1">{method.emoji}</div>
                    <div>{method.label}</div>
                  </button>
                ))}
              </div>

              {/* Bank transfer instructions */}
              {paymentMethod === "transfer" && (
                <div className="mt-4 bg-secondary rounded-xl p-4 border border-secondary-dark text-sm">
                  <p className="font-medium text-primary mb-2">
                    🏦 Bank Transfer Details
                  </p>
                  <div className="space-y-1 text-primary/70">
                    <p>
                      Bank:{" "}
                      <span className="font-medium text-primary">
                        Commercial Bank of Ethiopia
                      </span>
                    </p>
                    <p>
                      Account Name:{" "}
                      <span className="font-medium text-primary">Emu Shop</span>
                    </p>
                    <p>
                      Account Number:{" "}
                      <span className="font-medium text-primary">
                        1000123456789
                      </span>
                    </p>
                    <p className="mt-2 text-xs text-primary/50">
                      Please use your order ID as the transfer reference. Your
                      order will be confirmed after payment verification.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-primary mb-4">
                Order Notes (optional)
              </h2>
              <textarea
                className="input-field resize-none h-24"
                placeholder="Any special instructions for your order..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Right — Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold text-primary mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm max-h-48 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product._id}
                    className="flex justify-between text-primary/70"
                  >
                    <span className="line-clamp-1 flex-1 mr-2">
                      {product.name} × {quantity}
                    </span>
                    <span className="font-medium text-primary">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-secondary-dark my-4" />

              <div className="flex justify-between font-bold text-primary text-lg mb-2">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-xs text-primary/40 mb-6">
                Prices shown in USD. Payment accepted in ETB at current exchange
                rate.
              </p>

              <p className="text-xs text-primary/50 mb-6">
                Payment via:{" "}
                <span className="capitalize font-medium text-primary">
                  {paymentMethod}
                </span>
              </p>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
                  {error}
                </div>
              )}

              {isAuthenticated && (
                <p className="text-sm text-primary/60 mb-4">
                  Ordering as{" "}
                  <span className="font-medium text-primary">{user?.name}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? <Spinner size="sm" /> : null}
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
