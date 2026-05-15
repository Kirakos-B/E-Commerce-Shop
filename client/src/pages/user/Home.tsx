import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Scissors,
  Star,
  Truck,
  Shield,
  ChevronRight,
} from "lucide-react";
import ProductCard from "../../components/shared/ProductCard";
import Spinner from "../../components/shared/Spinner";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types";

const categories = [
  { name: "Suits", value: "suits", emoji: "🤵", desc: "Formal & business" },
  { name: "Shirts", value: "shirts", emoji: "👔", desc: "Classic & casual" },
  { name: "Trousers", value: "trousers", emoji: "👖", desc: "Every occasion" },
  { name: "Dresses", value: "dresses", emoji: "👗", desc: "Elegant designs" },
  { name: "Jackets", value: "jackets", emoji: "🧥", desc: "Style & warmth" },
  {
    name: "Traditional",
    value: "traditional",
    emoji: "🎽",
    desc: "Cultural wear",
  },
];

const features = [
  {
    icon: <Scissors size={28} />,
    title: "Custom Tailored",
    desc: "Every piece crafted to your exact measurements for a perfect fit.",
  },
  {
    icon: <Star size={28} />,
    title: "Premium Fabrics",
    desc: "We source only the finest materials — silk, wool, linen and more.",
  },
  {
    icon: <Truck size={28} />,
    title: "Fast Delivery",
    desc: "Reliable delivery across Ethiopia with real-time order tracking.",
  },
  {
    icon: <Shield size={28} />,
    title: "Quality Guarantee",
    desc: "Not satisfied? We'll remake it. Your satisfaction is our promise.",
  },
];

const testimonials = [
  {
    name: "Abebe Girma",
    role: "Business Executive",
    text: "The suit they made for me was absolutely perfect. The fit, the fabric, everything exceeded my expectations.",
    rating: 5,
  },
  {
    name: "Tigist Haile",
    role: "Wedding Client",
    text: "I ordered a custom wedding dress and it was beyond beautiful. The team was so professional throughout.",
    rating: 5,
  },
  {
    name: "Yonas Tesfaye",
    role: "Regular Customer",
    text: "I've been ordering from Emu Shop for 2 years. Consistent quality and always on time.",
    rating: 5,
  },
];

const Home = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getProducts({ limit: 8 });
        setFeatured(
          data.products.filter((p) => p.isFeatured).slice(0, 4).length > 0
            ? data.products.filter((p) => p.isFeatured).slice(0, 4)
            : data.products.slice(0, 4),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="relative bg-primary text-secondary overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full border-2 border-secondary" />
          <div className="absolute top-32 left-32 w-32 h-32 rounded-full border-2 border-secondary" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full border-2 border-secondary" />
          <div className="absolute bottom-32 right-32 w-48 h-48 rounded-full border-2 border-secondary" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left — Text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary/80 text-sm px-4 py-2 rounded-full mb-6 border border-secondary/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Now accepting custom orders
              </div>

              <h1 className="font-serif text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Dressed for
                <br />
                <span className="relative">
                  <span className="text-secondary/70">Your Story</span>
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-secondary/30 rounded-full" />
                </span>
              </h1>

              <p className="text-secondary/70 text-lg lg:text-xl mb-10 max-w-lg leading-relaxed">
                Premium bespoke tailoring in Addis Ababa. Every stitch tells
                your story — from boardrooms to weddings, we craft clothing that
                fits perfectly and lasts a lifetime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/shop"
                  className="bg-secondary text-primary font-bold px-8 py-4 rounded-xl hover:bg-secondary-dark transition-all duration-200 flex items-center gap-2 justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Browse Collection <ArrowRight size={18} />
                </Link>
                <Link
                  to="/custom-order"
                  className="border-2 border-secondary/40 text-secondary font-bold px-8 py-4 rounded-xl hover:bg-secondary/10 transition-all duration-200 flex items-center gap-2 justify-center"
                >
                  <Scissors size={18} /> Custom Order
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 justify-center lg:justify-start">
                {[
                  { value: "500+", label: "Happy Clients" },
                  { value: "1000+", label: "Items Crafted" },
                  { value: "5★", label: "Avg. Rating" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="font-serif text-2xl font-bold text-secondary">
                      {stat.value}
                    </p>
                    <p className="text-secondary/50 text-xs mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Main circle */}
                <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-full bg-secondary/10 border-2 border-secondary/20 flex items-center justify-center">
                  <div className="w-56 h-56 lg:w-72 lg:h-72 rounded-full bg-secondary/10 border border-secondary/10 flex items-center justify-center">
                    <span className="text-8xl lg:text-9xl">🦅</span>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white text-primary text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  Premium Quality
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white text-primary text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                  <Scissors size={12} className="text-primary" />
                  Made to Measure
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bar ── */}
      <section className="bg-primary-dark text-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center text-sm">
            {[
              { icon: "✂️", text: "Custom Made to Your Measurements" },
              { icon: "🌟", text: "Premium Quality Fabrics" },
              { icon: "🚚", text: "Delivery Across Ethiopia" },
              { icon: "🛡️", text: "Satisfaction Guaranteed" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center justify-center gap-2 py-1"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-secondary/80">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-primary/50 uppercase tracking-widest text-sm font-medium mb-2">
            What We Make
          </p>
          <h2 className="font-serif text-4xl font-bold text-primary">
            Shop by Category
          </h2>
          <p className="text-primary/60 mt-3 max-w-md mx-auto">
            From everyday wear to special occasions — find exactly what you need
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/shop?category=${cat.value}`}
              className="group bg-white rounded-2xl p-5 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-secondary-dark hover:border-primary/20"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {cat.emoji}
              </div>
              <p className="text-sm font-bold text-primary group-hover:text-primary-light transition-colors">
                {cat.name}
              </p>
              <p className="text-xs text-primary/40 mt-0.5">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-primary/50 uppercase tracking-widest text-sm font-medium mb-2">
                Handpicked For You
              </p>
              <h2 className="font-serif text-4xl font-bold text-primary">
                Featured Products
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-200 group"
            >
              View All
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : featured.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="text-center mt-10 sm:hidden">
                <Link
                  to="/shop"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  View All Products <ArrowRight size={16} />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-primary/40">
              <p className="text-lg">No products yet.</p>
              <Link
                to="/shop"
                className="text-primary font-medium hover:underline mt-2 inline-block"
              >
                Browse shop →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-primary/50 uppercase tracking-widest text-sm font-medium mb-2">
            Simple Process
          </p>
          <h2 className="font-serif text-4xl font-bold text-primary">
            How Custom Orders Work
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Describe Your Design",
              desc: "Tell us your vision — style, occasion, fabric preference, and color.",
              icon: "✏️",
            },
            {
              step: "02",
              title: "Share Measurements",
              desc: "Provide your body measurements or visit our shop for a fitting.",
              icon: "📏",
            },
            {
              step: "03",
              title: "We Craft It",
              desc: "Our expert tailors bring your design to life with precision.",
              icon: "🪡",
            },
            {
              step: "04",
              title: "Delivered to You",
              desc: "Receive your perfectly tailored garment at your doorstep.",
              icon: "📦",
            },
          ].map((item, i) => (
            <div key={item.step} className="relative text-center group">
              {/* Connector line */}
              {i < 3 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-secondary-dark z-0" />
              )}

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary text-secondary flex items-center justify-center text-2xl mx-auto mb-4 group-hover:bg-primary-light transition-colors duration-300 shadow-md">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-primary/30 mb-1 tracking-widest">
                  STEP {item.step}
                </div>
                <h3 className="font-serif text-lg font-bold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/custom-order"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base"
          >
            <Scissors size={20} /> Start Your Custom Order
          </Link>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary/50 uppercase tracking-widest text-sm font-medium mb-2">
              Why Choose Us
            </p>
            <h2 className="font-serif text-4xl font-bold text-primary">
              The Emu Shop Difference
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 hover:shadow-md transition-shadow duration-300 border border-secondary-dark"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-primary mb-2">
                  {f.title}
                </h3>
                <p className="text-primary/60 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-primary/50 uppercase tracking-widest text-sm font-medium mb-2">
            Client Stories
          </p>
          <h2 className="font-serif text-4xl font-bold text-primary">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 border border-secondary-dark hover:shadow-md transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= t.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-primary/20"
                    }
                  />
                ))}
              </div>

              <p className="text-primary/70 text-sm leading-relaxed mb-5 italic">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-secondary flex items-center justify-center font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm">{t.name}</p>
                  <p className="text-primary/40 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-primary text-secondary py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-5xl mb-6 block">🦅</span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
            Ready to Look Your Best?
          </h2>
          <p className="text-secondary/70 text-lg mb-10 max-w-xl mx-auto">
            Whether you need something off the rack or completely bespoke — Emu
            Shop has you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-secondary text-primary font-bold px-8 py-4 rounded-xl hover:bg-secondary-dark transition-all duration-200 flex items-center gap-2 justify-center shadow-lg"
            >
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link
              to="/custom-order"
              className="border-2 border-secondary/40 text-secondary font-bold px-8 py-4 rounded-xl hover:bg-secondary/10 transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <Scissors size={18} /> Custom Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
