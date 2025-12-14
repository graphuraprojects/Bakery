import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/product";

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
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

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
            {/* Image */}
            <img
              src={
                item.images?.[0]
                  ? item.images[0].startsWith("http")
                    ? item.images[0]
                    : `http://localhost:5000${item.images[0]}`
                  : "https://via.placeholder.com/400x400?text=No+Image"
              }
              alt={item.name}
              className="w-full h-56 object-cover rounded-t-2xl"
            />

            {/* Content */}
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

                <Link to={`/product/${item._id}`}>
                  <button className="px-5 py-2 rounded-full bg-gradient-to-r from-[#dda56a] to-[#e8b381] text-white font-semibold">
                    Order Now
                  </button>
                </Link>
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
