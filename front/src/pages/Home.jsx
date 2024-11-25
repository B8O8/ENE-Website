import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import TopCategories from "../components/TopCategories";
import Footer from "../components/Footer.jsx";


const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <TopCategories />
      <Footer />
    </div>
  );
};

export default Home;
