
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min"; // Ensure Bootstrap JS is properly imported

const TestimonialSection = () => {
  const reviewImages = Array.from(
    { length: 19 },
    (_, i) => `/reviews/review${i + 1}.jpeg`
  );

  const [imagesPerSlide, setImagesPerSlide] = useState(3);

  useEffect(() => {
    const updateImagesPerSlide = () => {
      if (window.innerWidth < 768) {
        setImagesPerSlide(1); // Small screens → 1 image
      } else if (window.innerWidth < 992) {
        setImagesPerSlide(2); // Medium screens → 2 images
      } else {
        setImagesPerSlide(3); // Large screens → 3 images
      }
    };

    updateImagesPerSlide();
    window.addEventListener("resize", updateImagesPerSlide);

    return () => window.removeEventListener("resize", updateImagesPerSlide);
  }, []);

  const chunkArray = (arr, size) => {
    return arr.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);
  };

  const groupedImages = chunkArray(reviewImages, imagesPerSlide);

  useEffect(() => {
    const carouselElement = document.getElementById("testimonialCarousel");
    const carousel = new bootstrap.Carousel(carouselElement, {
      ride: false, // Disable automatic ride
      interval: false, // Prevent Bootstrap from overriding our manual interval
      wrap: true, // Allows looping of carousel
    });

    const slideInterval = setInterval(() => {
      carousel.next(); // Move to the next slide every 2 seconds
    }, 4000);

    return () => clearInterval(slideInterval);
  }, [groupedImages]);

  return (
    <div className="container my-5">
      <h2 className="text-center text-warning mb-4" dir="rtl">
        💬 ماذا قال طالبنا عن معسكر الفوركس التدريبي؟ شاهد قصص نجاحهم!
      </h2>

      {/* Bootstrap Carousel (Manually Controlled) */}
      <div id="testimonialCarousel" className="carousel slide" data-bs-ride="false">
        <div className="carousel-inner">
          {groupedImages.map((group, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              <div className="row justify-content-center">
                {group.map((image, i) => (
                  <div key={i} className={`col-${12 / imagesPerSlide} d-flex justify-content-center`}>
                    <img
                      src={image}
                      alt={`Testimonial ${i + 1}`}
                      className="img-fluid rounded shadow"
                      style={{
                        maxWidth: "90%",
                        maxHeight: "300px",
                        objectFit: "cover",
                        transition: "opacity 0.8s ease-in-out",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
