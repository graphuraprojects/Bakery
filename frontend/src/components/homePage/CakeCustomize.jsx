import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const cakes = [
    {
        name: "Party Chocolate Cake",
        img: "https://i.pinimg.com/1200x/8e/00/d3/8e00d3dcba05753cec89bd5120cd18be.jpg",
    },
    {
        name: "Valentine's Day Specail Cake",
        img: "https://i.pinimg.com/736x/f5/e1/0e/f5e10efa13c6d921d23f064af75f1886.jpg",
    },
    {
        name: "Castle Theme Cake",
        img: "https://i.pinimg.com/736x/17/13/56/1713561bb30593265188620cdf092de8.jpg",
    },
    {
        name: "Unicorn Theme Cake",
        img: "https://i.pinimg.com/736x/5b/c2/7a/5bc27a7bd4d1435fb3a18bf26d824e1e.jpg",
    },
];

const CakeCustomize = () => {
    return (
        <section className="w-full bg-[#fff9f4] py-16 px-4 sm:px-8 lg:px-20">
            <div className="max-w-7xl mx-auto text-center">

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#8b5e3c]"
                >
                    Customize Your Perfect Cake
                </motion.h2>

                <p className="text-[#8b5e3c]/70 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
                    Choose your design, flavor, size and create your dream celebration cake.
                </p>

                {/* Cake Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7 mt-14">
                    {cakes.map((cake, index) => (
                        <motion.div
                            key={cake.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="h-72 sm:h-80 md:h-80 md:w-full overflow-hidden">
                                <img
                                    src={cake.img}
                                    alt={cake.name}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                />
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg sm:text-xl font-semibold text-[#8b5e3c]">
                                    {cake.name}
                                </h3>
                                <p className="text-sm text-[#8b5e3c]/70 mt-2">
                                    Customize flavors, layers, toppings & more.
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <Link to="/customize">
                        <button className="mt-10 px-8 sm:px-10 py-3 rounded-full bg-[#8b5e3c] text-white text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition">
                            Customize Now →
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CakeCustomize;
