import React from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaMapMarkerAlt,
  FaArrowRight,
  FaPaperPlane,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../assets/homePage/logo White.png";

const Footer = () => {
  const serviceLinks = [
    { label: "Birthday Cakes", category: "Birthday Cakes" },
    { label: "Wedding Cakes", category: "Wedding Cakes" },
    { label: "Custom Cakes", category: "Custom Cakes" },
    { label: "Pastries", category: "Pastries" },
    { label: "Rolls", category: "Rolls" },
    { label: "Premium Cakes", category: "Premium Cakes" },
  ];

  return (
    <footer className="bg-[#6f482a] pt-16 pb-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* ================= LOGO + ABOUT ================= */}
        <div>
          <img
            src={logo}
            alt="Graphura Bakery"
            className="h-14 mb-4 drop-shadow-md"
          />

          <p className="text-sm text-[#F9FBFB] leading-relaxed mb-6">
            Freshly baked happiness every day — Cakes, pastries, cookies & more.
            Made with love for every celebration!
          </p>

          <div className="flex items-center gap-3 mt-4">
            <div className="bg-[#d78f52] p-3 rounded-full shadow-lg">
              <FaEnvelope className="text-white" />
            </div>
            <p className="text-sm text-[#F9FBFB]">
              Email us <br />
              <span className="font-semibold">official@graphura.in</span>
            </p>
          </div>
        </div>

        {/* ================= QUICK LINKS ================= */}
        <div>
          <h3 className="text-xl font-semibold text-[#F9FBFB] mb-4 after:block after:w-14 after:h-[3px] after:bg-[#d78f52] after:mt-1">
            Quick Links
          </h3>

          <ul className="space-y-3 text-[#F9FBFB]">
            {[
              { path: "/home", label: "Home" },
              { path: "/menu", label: "Menu" },
              { path: "/customize", label: "Custom Cake" },
              { path: "/about", label: "About Us" },
              { path: "/contact-us", label: "Contact" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className="flex items-center gap-2 hover:text-[#d78f52] transition"
                >
                  <FaArrowRight size={12} /> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ================= SERVICES (MENU CATEGORIES) ================= */}
        <div>
          <h3 className="text-xl font-semibold text-[#F9FBFB] mb-4 after:block after:w-14 after:h-[3px] after:bg-[#d78f52] after:mt-1">
            Services
          </h3>

          <ul className="space-y-3 text-[#F9FBFB]">
            {serviceLinks.map((item) => (
              <li key={item.category}>
                <Link
                  to="/menu"
                  state={{ fromFooter: true, category: item.category }}
                  className="flex items-center gap-2 hover:text-[#d78f52] transition"
                >
                  <FaArrowRight size={12} /> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ================= NEWSLETTER + SOCIAL ================= */}
        <div>
          <h3 className="text-xl font-semibold text-[#F9FBFB] mb-4 after:block after:w-14 after:h-[3px] after:bg-[#d78f52] after:mt-1">
            Newsletter
          </h3>

          <p className="text-sm text-[#F9FBFB] mb-4">
            Get offers, bakery updates, and festive cake combos!
          </p>

          <div className="bg-white rounded-full flex overflow-hidden shadow-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 text-sm focus:outline-none"
            />
            <button className="bg-[#d78f52] px-4 py-2 text-white">
              <FaPaperPlane />
            </button>
          </div>

          <div className="flex gap-5 mt-6 text-xl text-[#F9FBFB]">
            {[
              {
                icon: FaLinkedin,
                path: "https://www.linkedin.com/company/graphura-india-private-limited",
              },
              {
                icon: FaInstagram,
                path: "https://www.instagram.com/graphura.in",
              },
              {
                icon: FaFacebook,
                path: "https://www.facebook.com/Graphura.in",
              },
              { icon: FaXTwitter, path: "https://x.com/Graphura" },
              {
                icon: FaMapMarkerAlt,
                path: "https://maps.app.goo.gl/DoXYDapgZWJix4uE7",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#e6b07c] transition"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="mt-10 py-4 bg-[#fff9f4]">
        <p className="text-center text-sm text-[#4a3f35] font-semibold">
          © 2025{" "}
          <span className="text-[#6f482a] font-semibold">
            Graphura India Private Limited
          </span>{" "}
          — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
