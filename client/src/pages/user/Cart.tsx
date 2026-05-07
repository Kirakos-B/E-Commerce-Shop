import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-primary/20 mb-4" />
        <h2 className="font-serif text-2xl font-bold text-primary mb-2">
          Your cart is empty
        </h2>
        <p className="text-primary/60 mb-8">Add some products to get started</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary">
          Shopping Cart
          <span className="text-primary/50 text-lg font-normal ml-2">
            ({totalItems} items)
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
        >
          <Trash2 size={14} /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="card p-4 flex items-center gap-4">
              {/* Image */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/20">
                    <ShoppingBag size={24} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/shop/${product._id}`}
                  className="font-serif font-semibold text-primary hover:text-primary-light transition-colors line-clamp-1"
                >
                  {product.name}
                </Link>
                <p className="text-sm text-primary/50 capitalize">
                  {product.category}
                </p>
                <p className="text-primary font-bold mt-1">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center border border-secondary-dark rounded-lg overflow-hidden">
                <button
                  onClick={() => updateQuantity(product._id, quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-1.5 text-primary hover:bg-secondary transition-colors disabled:opacity-30"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 py-1.5 text-primary font-medium border-x border-secondary-dark text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product._id, quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="px-3 py-1.5 text-primary hover:bg-secondary transition-colors disabled:opacity-30"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right min-w-[80px]">
                <p className="font-bold text-primary">
                  ${(product.price * quantity).toFixed(2)}
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(product._id)}
                className="text-red-400 hover:text-red-600 transition-colors ml-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-serif text-xl font-bold text-primary mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
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

            <div className="flex justify-between font-bold text-primary text-lg mb-6">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <Link
              to="/checkout"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>

            <Link
              to="/shop"
              className="btn-secondary w-full flex items-center justify-center gap-2 mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
