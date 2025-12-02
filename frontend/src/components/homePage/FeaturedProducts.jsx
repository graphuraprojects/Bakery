import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const featuredProducts = [
    {
        name: "Chocolate Cake",
        path: "/",
        price: "$25",
        tagline: "Rich • Moist • Melt-in-Your-Mouth",
        description:
            "A premium dark-chocolate layered cake filled with velvety truffle cream, crafted using 100% pure cocoa. Perfect for celebrations and chocolate lovers.",
        specials: [
            "Belgian dark chocolate",
            "Smooth truffle ganache layers",
            "Freshly baked everyday",
            "No preservatives"
        ],
        image:
            "https://i.pinimg.com/1200x/e4/08/f1/e408f15c8b5d5a39a352ae2178c3c3a7.jpg"
    },
    {
        name: "Donuts",
        path: "/",
        price: "$10",
        tagline: "Soft, Fluffy & Melt-in-Your-Mouth Good",
        description:
            "A light and airy donut coated with a smooth sugary glaze for the perfect sweetness. Soft, fresh, and irresistible with every single bite.",
        specials: [
            "Hand-crafted fluffy dough",
            "Perfectly balanced sweetness",
            "Golden fried for a soft bite",
            "Freshly made every morning"
        ],
        image:
            "https://i.pinimg.com/736x/4d/96/a5/4d96a582a7371cee7e5a342faecca78d.jpg"
    },
    {
        name: "Strawberry Pastry",
        path: "/",
        price: "$12",
        tagline: "Bursting With Real Strawberry Flavor",
        description:
            "A soft and fluffy pastry layered with silky cream and juicy strawberry filling. Sweet, refreshing, and the perfect fruity delight for any occasion.",
        specials: [
            "Made with real strawberry pulp",
            "Light and creamy texture",
            "Moist vanilla sponge base",
            "Naturally sweet and refreshing"
        ],
        image:
            "https://i.pinimg.com/1200x/30/29/3f/30293f670a7fb51be8ad92b05bf0a566.jpg"
    },
    {
        name: "Customize Cookies",
        path: "/",
        price: "$8",
        tagline: "Crispy • Chewy • Irresistibly Delicious",
        description:
            "A perfectly baked cookie with a golden crisp edge and a soft, chewy center. Loaded with rich chocolate chunks and baked fresh for the ultimate comfort treat.",
        specials: [
            "Premium chocolate chunks",
            "Soft and chewy center",
            "Freshly baked in small batches",
            "Perfect for all-day snacking"
        ],
        image:
            "https://i.pinimg.com/736x/43/28/5c/43285c85ace909ad5af96ce9eeaa8663.jpg"
    }
];

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const containerStagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.25
        }
    }
};

const FeaturedProducts = () => {
    return (
        <section className="py-18 relative bg-[#e2bf9d] overflow-hidden">

            {/* Section Heading */}
            <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl sm:text-5xl font-bold text-center text-[#8b5e3c] mb-16 drop-shadow-sm"
            >
                Featured Products
            </motion.h2>

            {/* Product Grid */}
            <motion.div
                variants={containerStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-7xl mx-auto px-6 
                           grid 
                           grid-cols-1 
                           sm:grid-cols-2 
                           md:grid-cols-2 
                           lg:grid-cols-4 
                           gap-10"
            >
                {featuredProducts.map((item, idx) => (
                    <motion.div
                        variants={fadeUp}
                        key={idx}
                        whileHover={{ scale: 1.04, translateY: -8 }}
                        transition={{ type: "spring", stiffness: 180 }}
                        className="bg-[#fff9f4] rounded-2xl shadow-lg hover:shadow-2xl 
                                   border border-transparent hover:border-[#c89f7a]/60 
                                   transition-all duration-300 hover:-translate-y-2 
                                   flex flex-col"
                    >
                        {/* Image */}
                        <motion.img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-56 sm:h-64 object-cover rounded-t-2xl 
                                       transition-all duration-500 ease-out hover:brightness-110"
                        />

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">

                            {/* Title */}
                            <h3 className="text-xl sm:text-2xl font-bold text-[#8b5e3c]">
                                {item.name}
                            </h3>

                            {/* Tagline */}
                            <p className="text-[#8b5e3c] mt-1 italic">
                                {item.tagline}
                            </p>

                            {/* Description */}
                            <p className="mt-3 text-[#6f472b] leading-relaxed text-sm flex-grow">
                                {item.description}
                            </p>

                            {/* Price + Order Button */}
                            <div className="mt-6 flex justify-between items-center">
                                <span className="text-lg sm:text-xl font-bold text-[#8b5e3c]">
                                    {item.price}
                                </span>

                                <Link to={`/product/${item.path}`}>
                                    <motion.button
                                        whileTap={{ scale: 0.92 }}
                                        whileHover={{ scale: 1.08 }}
                                        className="px-5 py-2 rounded-full bg-gradient-to-r from-[#dda56a] to-[#e8b381]
                                                   text-white font-semibold shadow-lg hover:shadow-xl 
                                                   transition-all duration-300 hover:brightness-110"
                                    >
                                        Order Now
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* "See more" Button */}
            <div className="mt-10 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex items-center justify-center"
                >
                    <Link to="/more">
                        <button
                            className="px-6 py-2 rounded-full bg-white text-[#8b5e3c] font-semibold 
                                       shadow-md hover:shadow-lg hover:-translate-y-1 
                                       transition-all duration-300 hover:bg-[#f0e3d6] hover:text-[#6f472b] cursor-pointer"
                        >
                            See more
                        </button>
                    </Link>
                </motion.div>
            </div>

        </section>
    );
};

export default FeaturedProducts;
