import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, selectCart } from "../redux/Slice";

const API_BASE = "/api/featured";

/* ================= Animations ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const containerStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.25 },
  },
};

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items } = useSelector(selectCart);

  /* =====================================================
     BUY NOW → ADD TO CART → REDIRECT TO ORDER
  ===================================================== */
  const handleOrderNow = (product) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");

    // ❌ Not logged in
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login", { state: { from: "/order" } });
      return;
    }

    // ❌ Out of stock
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    // ✅ Prevent duplicate add
    const alreadyInCart = items.find((item) => item.id === product._id);

    if (!alreadyInCart) {
      dispatch(
        addToCart({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]
            ? product.images[0].startsWith("http")
              ? product.images[0]
              : `${product.images[0]}`
            : "",
          qty: 1,
        })
      );
    }

    navigate("/order");
  };

  /* =====================================================
     FETCH FEATURED PRODUCTS
  ===================================================== */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(API_BASE);

        if (res.data?.success && Array.isArray(res.data.products)) {
          const featured = res.data.products
            .filter((p) => p.isFeatured === true)
            .slice(0, 4);

          setFeaturedProducts(featured);
        }
      } catch (err) {
        console.error("Failed to load featured products", err);
      }
    };

    fetchProducts();
  }, []);

  if (featuredProducts.length === 0) return null;

  return (
    <section className="py-18 bg-[#e2bf9d]">
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-3xl sm:text-5xl font-bold text-center text-[#8b5e3c] mb-16"
      >
        Featured Products
      </motion.h2>

      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
      >
        {featuredProducts.map((item) => (
          <motion.div
            key={item._id}
            variants={fadeUp}
            whileHover={{ scale: 1.04, y: -8 }}
            className="bg-[#fff9f4] rounded-2xl shadow-lg flex flex-col"
          >
            {/* IMAGE */}
            <img
              src={
                item.images?.[0]
                  ? item.images[0].startsWith("http")
                    ? item.images[0]
                    : `${item.images[0]}`
                  : "https://via.placeholder.com/400x400?text=No+Image"
              }
              alt={item.name}
              className="w-full h-56 object-cover rounded-t-2xl"
            />

            {/* CONTENT */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-[#8b5e3c]">{item.name}</h3>

              <p className="text-sm italic text-[#8b5e3c]">{item.category}</p>

              <p className="mt-3 text-[#6f472b] text-sm line-clamp-3 flex-grow">
                {item.description}
              </p>

              <div className="mt-6 flex justify-between items-center">
                <span className="text-lg font-bold text-[#8b5e3c]">
                  ₹{item.price}
                </span>

                <button
                  onClick={() => handleOrderNow(item)}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-[#dda56a] to-[#e8b381] text-white font-semibold hover:scale-105 transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 flex justify-center">
        <Link to="/menu">
          <button className="px-6 py-2 rounded-full bg-white text-[#8b5e3c] font-semibold shadow-md">
            See more
          </button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
