import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import successAnimation from "../assets/success.json"; // Replace with your Lottie JSON

const Congratulations = () => {
  const { width, height } = useWindowSize(); // Get screen size for confetti effect

  useEffect(() => {
    window.scrollTo(0, 0); // Ensure page scrolls to the top when loaded
  }, []);

  return (
    <div
      className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #1B002A, #4C0050, #721474)",
        color: "#fff",
        textAlign: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 🎊 Confetti Effect */}
      <Confetti width={width} height={height} numberOfPieces={100} />

      {/* 🎉 Floating Glow Effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="position-absolute top-0 start-50 translate-middle-x"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(100px)",
          zIndex: "0",
        }}
      ></motion.div>

      {/* 🏆 Animated 3D Success Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="mb-4"
        style={{ width: "180px", height: "180px", zIndex: 1 }}
      >
        <Lottie animationData={successAnimation} loop={false} />
      </motion.div>

      {/* 🎉 Animated Heading */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fw-bold text-warning"
        style={{ fontSize: "3rem", zIndex: 1 }}
      >
        🎉 تهانينا! 🎉
      </motion.h1>

      {/* ✅ Success Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="fs-4"
      >
        ✅ لقد تم تسجيلك بنجاح في الحدث! ستتلقى رسالة تأكيد قريبًا.  
        <br />
        🎊 نحن متحمسون لانضمامك إلينا!
      </motion.p>

      {/* 🎯 Animated Call-to-Action */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5, type: "spring" }}
      >
        <Link
          to="/event"
          className="btn btn-lg btn-light mt-4 px-5 py-3 fw-bold"
          style={{
            borderRadius: "50px",
            fontSize: "1.5rem",
            textDecoration: "none",
            color: "#4C0050",
            background: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0px 4px 15px rgba(255, 255, 255, 0.2)",
            transition: "transform 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          🔙 العودة إلى الصفحة الرئيسية
        </Link>
      </motion.div>
    </div>
  );
};

export default Congratulations;
