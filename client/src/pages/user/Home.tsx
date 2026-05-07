import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Scissors, Star, Truck } from "lucide-react";
import ProductCard from "../../components/shared/ProductCard";
import Spinner from "../../components/shared/Spinner";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types";

const categories = [
  { name: "Suits", value: "suits", emoji: "🤵" },
  { name: "Shirts", value: "shirts", emoji: "👔" },
  { name: "Trousers", value: "trousers", emoji: "👖" },
  { name: "Dresses", value: "dresses", emoji: "👗" },
  { name: "Jackets", value: "jackets", emoji: "🧥" },
  { name: "Traditional", value: "traditional", emoji: "🎽" },
];

const Home = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getProducts({ limit: 4 });
        setFeatured(data.products.filter((p) => p.isFeatured).slice(0, 4));
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
      {/* Hero Section */}
      <section className="bg-primary text-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <p className="text-secondary/60 uppercase tracking-widest text-sm mb-3">
              Premium Tailoring
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">
              Crafted For <br />
              <span className="text-secondary/80">Your Style</span>
            </h1>
            <p className="text-secondary/70 text-lg mb-8 max-w-md">
              Experience the art of bespoke tailoring. Every piece made to your
              exact measurements and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/shop"
                className="bg-secondary text-primary font-semibold px-8 py-3 rounded-lg hover:bg-secondary-dark transition-colors flex items-center gap-2 justify-center"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/custom-order"
                className="border border-secondary text-secondary font-semibold px-8 py-3 rounded-lg hover:bg-secondary/10 transition-colors text-center"
              >
                Custom Order
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="flex-1 flex justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-secondary/10 flex items-center justify-center">
              <span className="text-9xl">🦅</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-primary-dark text-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm">
            <div className="flex items-center justify-center gap-3">
              <Scissors size={20} className="text-secondary/70" />
              <span>Custom Made to Your Measurements</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Star size={20} className="text-secondary/70" />
              <span>Premium Quality Fabrics</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Truck size={20} className="text-secondary/70" />
              <span>Fast & Reliable Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-primary">
            Shop by Category
          </h2>
          <p className="text-primary/60 mt-2">
            Find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/shop?category=${cat.value}`}
              className="card p-4 text-center hover:shadow-md transition-all hover:-translate-y-1 group"
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <p className="text-sm font-medium text-primary group-hover:text-primary-light transition-colors">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold text-primary">
                Featured Products
              </h2>
              <p className="text-primary/60 mt-1">Handpicked pieces for you</p>
            </div>
            <Link
              to="/shop"
              className="text-primary font-medium text-sm hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-primary/50">
              <p>No featured products yet.</p>
              <Link
                to="/shop"
                className="text-primary font-medium hover:underline mt-2 inline-block"
              >
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-secondary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Want Something Unique?
          </h2>
          <p className="text-secondary/70 text-lg mb-8">
            Submit your measurements and design ideas. We'll craft it perfectly
            just for you.
          </p>
          <Link
            to="/custom-order"
            className="bg-secondary text-primary font-semibold px-10 py-4 rounded-lg hover:bg-secondary-dark transition-colors inline-flex items-center gap-2"
          >
            <Scissors size={20} />
            Start Your Custom Order
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
