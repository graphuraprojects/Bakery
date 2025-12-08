import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/Slice"; // <-- adjust path if needed
import cakeVideo from "../../assets/Gallery/cake.mp4"; // <-- adjust path if needed

// Small reusable row component (Hotstar-style horizontal slider)
const ProductRow = ({ title, products, onAddToCart }) => {
  const rowRef = useRef(null);

  if (!products || products.length === 0) return null;

  const scrollAmount = 320;

  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-10">
      {/* Row header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          {title}
        </h2>
        <span className="text-xs md:text-sm text-gray-500">
          {products.length} item{products.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Slider container */}
      <div className="relative">
        {/* Left arrow - desktop only */}
        <button
          onClick={scrollLeft}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 
                     w-9 h-9 rounded-full bg-white shadow-lg border border-gray-200 
                     items-center justify-center hover:scale-105 active:scale-95 transition"
        >
          ‹
        </button>

        {/* Right arrow - desktop only */}
        <button
          onClick={scrollRight}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 
                     w-9 h-9 rounded-full bg-white shadow-lg border border-gray-200 
                     items-center justify-center hover:scale-105 active:scale-95 transition"
        >
          ›
        </button>

        {/* Cards row */}
        <div
          ref={rowRef}
          className="flex gap-6 overflow-x-auto pb-3 px-1 scroll-smooth"
        >
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition 
                         p-4 flex flex-col min-w-[230px] max-w-[230px]"
            >
              <img
                src={item.img}
                alt={item.name}
                className="h-40 w-full object-cover rounded-xl mb-3"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&auto=format";
                }}
              />

              <h3 className="text-lg font-semibold">{item.name}</h3>

              {item.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* Optional flavour & weight display */}
              <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                {item.flavour && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                    {item.flavour}
                  </span>
                )}
                {item.weight && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                    {item.weight}
                  </span>
                )}
              </div>

              <p className="text-md font-bold mt-3 text-[#dda56a]">
                ₹ {item.price}
              </p>

              {/* Stock info */}
              <p
                className={`text-xs mt-1 ${
                  item.stock === 0
                    ? "text-red-500"
                    : item.stock > 5
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {item.stock === 0
                  ? "Out of stock"
                  : item.stock > 5
                  ? "In stock"
                  : "Low stock"}
              </p>

              {/* Add to cart button */}
              <button
                onClick={() => onAddToCart(item)}
                disabled={item.stock === 0}
                className={`mt-auto w-full py-2 rounded-full font-semibold flex items-center justify-center gap-2
                  ${
                    item.stock === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#dda56a] text-white hover:bg-[#c8955f] transition-all"
                  }`}
              >
                {item.stock === 0 ? (
                  "Out of Stock"
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function FilterPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filters
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [selectedFlavours, setSelectedFlavours] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState([]);

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Helper function to fix image URLs (from old page)
  const fixImageUrl = (url) => {
    if (!url || url === "undefined" || url === "null") {
      return "/cake5.jpg";
    }

    // If already a full URL, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    let cleanUrl = url.trim();

    // Remove ../ or ./ prefixes
    cleanUrl = cleanUrl.replace(/^(\.\.\/|\.\/)+/, "");

    // Ensure it starts with a single slash
    if (!cleanUrl.startsWith("/")) {
      cleanUrl = "/" + cleanUrl;
    }

    // Collapse multiple slashes
    if (cleanUrl.includes("//")) {
      cleanUrl = cleanUrl.replace(/\/+/g, "/");
    }

    // Ensure uploads path
    if (!cleanUrl.includes("uploads/")) {
      cleanUrl =
        "/uploads/products" + (cleanUrl.startsWith("/") ? "" : "/") + cleanUrl;
    }

    const baseUrl = "http://localhost:5000";
    return baseUrl + cleanUrl;
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await axios.get("http://localhost:5000/api/product", {
          params: { limit: 200 },
        });

        if (response.data && response.data.success) {
          const formatted = response.data.products.map((p) => {
            const rawImage =
              (p.images && p.images[0]) || p.image || "/cake5.jpg";

            return {
              id: p._id || p.id,
              name: p.name,
              price: p.price,
              img: fixImageUrl(rawImage),
              category: p.category || "Cakes",
              description: p.description || "",
              stock: typeof p.stock === "number" ? p.stock : 10,
              flavour: p.flavour || p.flavor || "", // backend may use either
              weight: p.weight || "",
              isFeatured: p.isFeatured || false,
            };
          });

          setProducts(formatted);

          const uniqueCategories = [
            ...new Set(formatted.map((p) => p.category)),
          ];
          setCategories(uniqueCategories);

          toast.success(`Loaded ${formatted.length} products!`);
        } else {
          toast.error("Failed to load products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products from server");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle flavour checkbox
  const handleFlavourChange = (flavour) => {
    setSelectedFlavours((prev) =>
      prev.includes(flavour)
        ? prev.filter((f) => f !== flavour)
        : [...prev, flavour]
    );
  };

  // Handle weight checkbox
  const handleWeightChange = (weight) => {
    setSelectedWeights((prev) =>
      prev.includes(weight)
        ? prev.filter((w) => w !== weight)
        : [...prev, weight]
    );
  };

  // Add to cart (from old page, slightly improved)
  const handleAddToCart = (product) => {
    try {
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to add items to cart");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return;
      }

      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.img,
          qty: 1,
        })
      );

      toast.success(`${product.name} added to cart!`, {
        icon: "🛒",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  // Apply filters (search + price + flavour + weight)
  const filteredProducts = products.filter((item) => {
    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    const matchPrice = item.price <= maxPrice;

    const matchFlavour =
      selectedFlavours.length > 0
        ? selectedFlavours.includes(item.flavour)
        : true;

    const matchWeight =
      selectedWeights.length > 0 ? selectedWeights.includes(item.weight) : true;

    return matchSearch && matchPrice && matchFlavour && matchWeight;
  });

  // Featured list (take explicit isFeatured, else top few products)
  const featuredProducts =
    filteredProducts.filter((p) => p.isFeatured) ||
    filteredProducts.slice(0, 8);

  // Group products by category for category rows
  const groupedByCategory = filteredProducts.reduce((acc, item) => {
    const cat = item.category || "Others";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dda56a]"></div>
          <p className="mt-4 text-lg text-[#dda56a]">
            Loading delicious cakes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* HERO SECTION (unchanged from your new page) */}
      <div className="relative w-full h-[90vh] overflow-hidden">
        {/* Background Video */}
        <video
          className="w-full h-full object-cover"
          src={cakeVideo}
          autoPlay
          muted
          loop
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

        {/* Content Section */}
        <div className="absolute top-1/2 -translate-y-1/2 left-10 md:left-20 text-white max-w-xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Freshly Baked Delights — Crafted With Love &amp; Passion
          </h1>

          <p className="text-gray-300 text-sm md:text-base">
            2025 • Premium Bakery • Made Fresh Daily
          </p>

          <p className="text-gray-200 text-sm md:text-[15px] leading-relaxed">
            Experience the warmth of homemade baking. From artisanal breads to
            rich cream cakes, every creation is crafted with the finest
            ingredients and a touch of love — bringing the joy of fresh flavors
            straight to your table.
          </p>

          <div className="flex gap-3 text-sm text-gray-300">
            <span>Cakes</span>
            <span>• Pastries</span>
            <span>• Desserts </span>
            <span>• Custom Orders</span>
          </div>

          <div className="flex items-center gap-4 pt-3">
            <button
              className="px-6 py-2 rounded-xl font-semibold text-white transition-all hover:brightness-110 pointer"
              style={{ backgroundColor: "#dda56a" }}
            >
              Order Now
            </button>

            <button className="w-10 h-10 rounded-md bg-gray-700/70 hover:bg-gray-600 transition text-2xl flex justify-center items-center">
              +
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex gap-6 p-6">
        {/* LEFT SIDEBAR FILTERS (same layout as your new page, but with slider) */}
        <div className="w-64 bg-white shadow-lg rounded-2xl p-5 h-fit sticky top-5">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>

          {/* Search */}
          <div className="mb-4">
            <label className="font-medium text-sm">Search</label>
            <input
              type="text"
              placeholder="Search cakes..."
              className="w-full mt-1 p-2 border rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Price Slider */}
          <div className="mb-4">
            <label className="font-medium text-sm block mb-1">Max Price</label>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>₹ 100</span>
              <span className="font-semibold text-[#dda56a]">
                Up to ₹ {maxPrice}
              </span>
              <span>₹ 1500</span>
            </div>
          </div>

          {/* FLAVOUR CHECKBOXES */}
          <div className="mb-4">
            <p className="font-medium text-sm mb-2">Flavour</p>
            {["Chocolate", "Vanilla", "Strawberry", "Butterscotch"].map(
              (flavour) => (
                <label key={flavour} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={selectedFlavours.includes(flavour)}
                    onChange={() => handleFlavourChange(flavour)}
                  />
                  {flavour}
                </label>
              )
            )}
          </div>

          {/* WEIGHT CHECKBOXES */}
          <div className="mb-2">
            <p className="font-medium text-sm mb-2">Weight</p>
            {["0.5kg", "1kg"].map((weight) => (
              <label key={weight} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={selectedWeights.includes(weight)}
                  onChange={() => handleWeightChange(weight)}
                />
                {weight}
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE CONTENT: Featured + Category Rows */}
        <div className="flex-1">
          {/* Featured Section */}
          <ProductRow
            title="Featured Products"
            products={featuredProducts}
            onAddToCart={handleAddToCart}
          />

          {/* Category-wise sections */}
          {categories.map((cat) => (
            <ProductRow
              key={cat}
              title={cat}
              products={groupedByCategory[cat] || []}
              onAddToCart={handleAddToCart}
            />
          ))}

          {/* If nothing matches filters */}
          {filteredProducts.length === 0 && (
            <div className="mt-10 bg-white rounded-2xl shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">
                No products found 🥲
              </h3>
              <p className="text-gray-500 mb-4">
                Try clearing some filters or increasing the max price.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setMaxPrice(1500);
                  setSelectedFlavours([]);
                  setSelectedWeights([]);
                }}
                className="px-5 py-2 rounded-full bg-[#dda56a] text-white font-semibold hover:bg-[#c8955f]"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterPage;
