// import React, { useState } from "react";
// import Select from "react-select";
// import countries from "world-countries";
// import apiService from "../services/apiService";
// import { toast } from "react-toastify";

// const EventRegistration = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     country_of_residence: null,
//   });

//   // Convert countries to options for react-select
//   // Filter out Israel from the countries array
//   const countryOptions = countries
//     .filter((country) => country.name.common !== "Israel")
//     .map((country) => ({
//       value: country.cca2,
//       label: country.name.common,
//     }));

//   const customStyles = {
//     control: (provided) => ({
//       ...provided,
//       backgroundColor: "#1c1c1c",
//       borderColor: "#6c757d", // Matches Bootstrap's secondary color
//       color: "#ffffff",
//       boxShadow: "none",
//       "&:hover": {
//         borderColor: "#6c757d",
//       },
//     }),
//     menu: (provided) => ({
//       ...provided,
//       backgroundColor: "#1c1c1c",
//       color: "#ffffff",
//     }),
//     singleValue: (provided) => ({
//       ...provided,
//       color: "#ffffff",
//     }),
//     placeholder: (provided) => ({
//       ...provided,
//       color: "#6c757d",
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isFocused ? "#343a40" : "#1c1c1c",
//       color: "#ffffff",
//     }),
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleCountryChange = (selectedOption) => {
//     setFormData({ ...formData, country_of_residence: selectedOption });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }

//     if (!formData.country_of_residence) {
//       toast.error("Please select a country.");
//       return;
//     }

//     try {
//       await apiService.post("/events/register", {
//         first_name: formData.firstName,
//         last_name: formData.lastName,
//         email: formData.email,
//         phone: formData.phone,
//         country_of_residence: formData.country_of_residence.label, // Send selected country
//       });
//       toast.success("Event registered successfully! Check your inbox or junk.");
//       alert("Event registered successfully! Check your inbox or junk.");
//       setFormData({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         country_of_residence: null,
//       });
//     } catch (error) {
//       toast.error("Registration failed. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-dark d-flex align-items-center justify-content-center text-light">
//       <div className="container bg-dark">
//         <div className="row justify-content-center">
//           {/* Event Image */}
//           <div className="col-lg-6 col-sm-6 mb-4 text-center">
//             <img
//               src="/HassanEvent.jpeg"
//               alt="Event Poster"
//               className="img-fluid rounded shadow-lg"
//             />
//           </div>

//           {/* Registration Form */}
//           <div className="col-lg-6 col-sm-6 align-self-center">
//             <form
//               onSubmit={handleSubmit}
//               className="p-4 rounded shadow-lg text-light"
//               style={{
//                 backgroundColor: "rgba(0, 0, 0, 0.12)", // Semi-transparent black
//               }}
//             >
//               <h2 className="text-center mb-5">Event Registration</h2>
//               <div className="row g-3">
//                 <div className="col-12 col-md-12 mb-4">
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     placeholder="First Name"
//                     className="form-control text-center bg-dark text-light border-secondary"
//                     required
//                   />
//                 </div>
//                 <div className="col-12 col-md-12 mb-4">
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     placeholder="Last Name"
//                     className="form-control text-center bg-dark text-light border-secondary"
//                     required
//                   />
//                 </div>
//                 <div className="col-12 col-md-12 mb-4">
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="Email"
//                     className="form-control text-center bg-dark text-light border-secondary"
//                     required
//                   />
//                 </div>
//                 <div className="col-12 col-md-12 mb-4">
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     placeholder="Phone Number"
//                     className="form-control text-center bg-dark text-light border-secondary"
//                     required
//                   />
//                 </div>
//                 <div className="col-12 col-md-12 mb-4">
//                   <Select
//                     options={countryOptions}
//                     value={formData.country_of_residence}
//                     onChange={handleCountryChange}
//                     placeholder="Select Country"
//                     styles={customStyles}
//                     classNamePrefix="react-select"
//                   />
//                 </div>
//                 <div className="col-12 col-md-12 text-center">
//                   <button type="submit" className="btn btn-primary w-100">
//                     Register
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// {/* Countdown Timer */}
// <div className="row justify-content-center text-center mb-4">
// <div className="col-md-8 bg-dark p-3 rounded shadow-lg text-rtl">
//   <h2 className="text-warning">: ينتهي التسجيل خلال ⏳ </h2>
//   <h3 className="display-6 text-light">
//     أيام : {timeLeft.days}  ساعات : {timeLeft.hours} دقائق : {timeLeft.minutes}   ثوانٍ : {timeLeft.seconds}
//     </h3>
// </div>
// </div>

// export default EventRegistration;
import React, { useState, useEffect } from "react";
import TestimonialSection from "./TestimonialSection";
import { Modal } from "react-bootstrap";
import apiService from "../services/apiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from "react-select"; // Dropdown for country selection
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const arabicCountries = [
  { value: "AF", label: "أفغانستان" },
  { value: "AL", label: "ألبانيا" },
  { value: "DZ", label: "الجزائر" },
  { value: "AD", label: "أندورا" },
  { value: "AO", label: "أنغولا" },
  { value: "AG", label: "أنتيغوا وبربودا" },
  { value: "AR", label: "الأرجنتين" },
  { value: "AM", label: "أرمينيا" },
  { value: "AU", label: "أستراليا" },
  { value: "AT", label: "النمسا" },
  { value: "AZ", label: "أذربيجان" },
  { value: "BH", label: "البحرين" },
  { value: "BD", label: "بنغلاديش" },
  { value: "BB", label: "بربادوس" },
  { value: "BY", label: "بيلاروسيا" },
  { value: "BE", label: "بلجيكا" },
  { value: "BZ", label: "بليز" },
  { value: "BJ", label: "بنين" },
  { value: "BT", label: "بوتان" },
  { value: "BO", label: "بوليفيا" },
  { value: "BA", label: "البوسنة والهرسك" },
  { value: "BW", label: "بوتسوانا" },
  { value: "BR", label: "البرازيل" },
  { value: "BN", label: "بروناي" },
  { value: "BG", label: "بلغاريا" },
  { value: "BF", label: "بوركينا فاسو" },
  { value: "BI", label: "بوروندي" },
  { value: "CV", label: "الرأس الأخضر" },
  { value: "KH", label: "كمبوديا" },
  { value: "CM", label: "الكاميرون" },
  { value: "CA", label: "كندا" },
  { value: "CF", label: "جمهورية إفريقيا الوسطى" },
  { value: "TD", label: "تشاد" },
  { value: "CL", label: "تشيلي" },
  { value: "CN", label: "الصين" },
  { value: "CO", label: "كولومبيا" },
  { value: "KM", label: "جزر القمر" },
  { value: "CD", label: "جمهورية الكونغو الديمقراطية" },
  { value: "CG", label: "الكونغو" },
  { value: "CR", label: "كوستاريكا" },
  { value: "CI", label: "ساحل العاج" },
  { value: "HR", label: "كرواتيا" },
  { value: "CU", label: "كوبا" },
  { value: "CY", label: "قبرص" },
  { value: "CZ", label: "التشيك" },
  { value: "DK", label: "الدنمارك" },
  { value: "DJ", label: "جيبوتي" },
  { value: "DM", label: "دومينيكا" },
  { value: "DO", label: "جمهورية الدومينيكان" },
  { value: "EC", label: "الإكوادور" },
  { value: "EG", label: "مصر" },
  { value: "SV", label: "السلفادور" },
  { value: "GQ", label: "غينيا الاستوائية" },
  { value: "ER", label: "إريتريا" },
  { value: "EE", label: "إستونيا" },
  { value: "ET", label: "إثيوبيا" },
  { value: "FJ", label: "فيجي" },
  { value: "FI", label: "فنلندا" },
  { value: "FR", label: "فرنسا" },
  { value: "GA", label: "الغابون" },
  { value: "GM", label: "غامبيا" },
  { value: "GE", label: "جورجيا" },
  { value: "DE", label: "ألمانيا" },
  { value: "GH", label: "غانا" },
  { value: "GR", label: "اليونان" },
  { value: "GT", label: "غواتيمالا" },
  { value: "GN", label: "غينيا" },
  { value: "GW", label: "غينيا بيساو" },
  { value: "GY", label: "غيانا" },
  { value: "HT", label: "هايتي" },
  { value: "HN", label: "هندوراس" },
  { value: "HU", label: "المجر" },
  { value: "IS", label: "آيسلندا" },
  { value: "IN", label: "الهند" },
  { value: "ID", label: "إندونيسيا" },
  { value: "IR", label: "إيران" },
  { value: "IQ", label: "العراق" },
  { value: "IE", label: "أيرلندا" },
  { value: "IT", label: "إيطاليا" },
  { value: "JM", label: "جامايكا" },
  { value: "JP", label: "اليابان" },
  { value: "JO", label: "الأردن" },
  { value: "KZ", label: "كازاخستان" },
  { value: "KE", label: "كينيا" },
  { value: "KW", label: "الكويت" },
  { value: "KG", label: "قيرغيزستان" },
  { value: "LA", label: "لاوس" },
  { value: "LV", label: "لاتفيا" },
  { value: "LB", label: "لبنان" },
  { value: "LY", label: "ليبيا" },
  { value: "LU", label: "لوكسمبورغ" },
  { value: "MG", label: "مدغشقر" },
  { value: "MY", label: "ماليزيا" },
  { value: "MV", label: "المالديف" },
  { value: "ML", label: "مالي" },
  { value: "MT", label: "مالطا" },
  { value: "MX", label: "المكسيك" },
  { value: "MA", label: "المغرب" },
  { value: "MZ", label: "موزمبيق" },
  { value: "NA", label: "ناميبيا" },
  { value: "NP", label: "نيبال" },
  { value: "NL", label: "هولندا" },
  { value: "NZ", label: "نيوزيلندا" },
  { value: "NG", label: "نيجيريا" },
  { value: "NO", label: "النرويج" },
  { value: "OM", label: "عمان" },
  { value: "PK", label: "باكستان" },
  { value: "PA", label: "بنما" },
  { value: "PG", label: "بابوا غينيا الجديدة" },
  { value: "PY", label: "باراغواي" },
  { value: "PE", label: "بيرو" },
  { value: "PH", label: "الفلبين" },
  { value: "PL", label: "بولندا" },
  { value: "PT", label: "البرتغال" },
  { value: "QA", label: "قطر" },
  { value: "RO", label: "رومانيا" },
  { value: "RU", label: "روسيا" },
  { value: "SA", label: "المملكة العربية السعودية" },
  { value: "SD", label: "السودان" },
  { value: "SY", label: "سوريا" },
  { value: "TN", label: "تونس" },
  { value: "TR", label: "تركيا" },
  { value: "AE", label: "الإمارات العربية المتحدة" },
  { value: "GB", label: "المملكة المتحدة" },
  { value: "US", label: "الولايات المتحدة الأمريكية" },
  { value: "YE", label: "اليمن" },
];

const EventRegistrationAR = () => {
  const navigate = useNavigate();
  // Fixing the event time (March 21, 2025, at 9:00 PM UTC)
  const eventDate = new Date("2025-03-21T21:00:00Z").getTime();

  // State for countdown
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime(); // Current time in milliseconds
      const difference = eventDate - now; // Difference in milliseconds

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown(); // Run immediately
    const timer = setInterval(updateCountdown, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value });

    // Basic Validation: Check if the phone number length is valid
    if (value.length < 8 || value.length > 15) {
      setPhoneError("📱 رقم الهاتف غير صحيح! الرجاء إدخال رقم صالح.");
    } else {
      setPhoneError("");
    }
  };

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country_of_residence: null,
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (selectedOption) => {
    setFormData({ ...formData, country_of_residence: selectedOption });
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      country_of_residence: formData.country_of_residence?.label || "",
      event_number: 2,
      event_name: "Forex Bootcamp",
    };

    try {
      if (phoneError) {
        toast.error("يرجى إدخال رقم هاتف صحيح قبل المتابعة.");
        return;
      }

      const response = await apiService.post("/events/register", dataToSend);
      toast.success("Event registered successfully! Check your inbox or junk.");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        country_of_residence: "",
      });
      handleClose();
      navigate("/congratulations");
    } catch (error) {
      console.error("❌ خطأ أثناء التسجيل:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="container-fluid text-white min-vh-100 d-flex align-items-center"
      style={{
        background:
          "linear-gradient(135deg, #0B0E27 20%, #12183B 60%, #1C214E 100%)",
      }}
    >
      <div className="container">
        {/* Countdown Timer with New Design */}
        <div className="row justify-content-center text-center mb-4">
          <div
            className="col-md-8 p-4 rounded shadow-lg"
            style={{
              background: "linear-gradient(135deg, #1C214E, #283162)",
              borderRadius: "15px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h2 className="text-warning mb-3" dir="rtl">
              ⏳ ينتهي التسجيل خلال:
            </h2>
            <div
              className="d-flex justify-content-center gap-3"
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                fontFamily: "monospace",
                letterSpacing: "3px",
                color: "#F8F9FA",
              }}
              dir="rtl"
            >
              <div className="px-3 py-2 bg-dark rounded">
                <span>{timeLeft.days}</span>{" "}
                <small style={{ fontSize: "1rem" }}>أيام</small>
              </div>
              <div className="px-3 py-2 bg-dark rounded">
                <span>{timeLeft.hours}</span>{" "}
                <small style={{ fontSize: "1rem" }}>ساعات</small>
              </div>
              <div className="px-3 py-2 bg-dark rounded">
                <span>{timeLeft.minutes}</span>{" "}
                <small style={{ fontSize: "1rem" }}>دقائق</small>
              </div>
              <div className="px-3 py-2 bg-dark rounded">
                <span>{timeLeft.seconds}</span>{" "}
                <small style={{ fontSize: "1rem" }}>ثوانٍ</small>
              </div>
            </div>
          </div>
        </div>

        <div className="row align-items-center">
          {/* Text Section - Left Side */}
          <div className="col-md-12 text-center px-4">
            <h2 className="text-warning fw-bold mb-2">Zoom تدريب مباشر على </h2>
            <h1 className="display-4 fw-bold mb-3">معسكر الفوركس التدريبي</h1>
            <h3 className="text-primary fw-semibold mb-3">
              <span dir="rtl">
                🚀 تعلم الفوركس من الصفر خلال ٣ أيام فقط! 🚀
              </span>
            </h3>
            <p className="text-light mb-3" dir="rtl">
              هل تبحث عن فرصة لدخول عالم التداول؟ انضم إلى معسكر الفوركس
              التدريبي واكتسب المهارات الأساسية التي تحتاجها لبدء التداول بثقة!
            </p>
            <p className="text-light fs-5">
              <span dir="rtl"> 📅 الخميس 21 مارس 2025 - 🕘 9:00 مساءً </span>
            </p>
          </div>

          {/* Image Section - Right Side
          <div className="col-md-6 d-flex justify-content-center">
            <img
              src={hasanPic}
              alt="مدرب الفوركس"
              className="img-fluid rounded shadow-lg"
              style={{
                maxWidth: "400px",
                maxHeight: "500px",
                objectFit: "cover",
              }}
            />
          </div> */}
        </div>

        {/* 🔵 Register Button */}
        <div className="row justify-content-center mt-4">
          <div className="col-md-6 text-center" dir="rtl">
            <button
              className="btn btn-lg btn-primary fw-bold px-5 py-3 shadow"
              style={{
                borderRadius: "50px",
                fontSize: "1.5rem",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              onClick={handleShow}
            >
              📢 سجل الآن
            </button>
          </div>
        </div>

        {/* Registration Modal */}
        {/* Registration Modal */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title dir="rtl">📅 سجل لحضور الحدث مجانًا</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="form-control text-end"
                  placeholder="الاسم الأول"
                  dir="rtl"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="form-control text-end"
                  placeholder="اسم العائلة"
                  dir="rtl"
                  required
                />
              </div>
              <div className="mb-3">
                <PhoneInput
                  country={"lb"} // Default country set to Lebanon (change if needed)
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputClass="form-control text-start text-black w-100"
                  dropdownClass="custom-dropdown"
                  containerStyle={{ width: "100%", color: "#000000" }}
                  excludeCountries={["il"]}
                />
                {phoneError && (
                  <small className="text-warning">{phoneError}</small>
                )}
              </div>
              <div className="mb-3" dir="rtl">
                {/* Country Dropdown */}
                <Select
                  options={arabicCountries}
                  value={formData.country_of_residence}
                  onChange={handleCountryChange}
                  placeholder="اختر بلد الإقامة"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#ffffff", // Same as input fields
                      borderColor: "#ffffff",
                      borderRadius: "5px",
                      padding: "3px",
                      color: "#000000",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#ffffff",
                      color: "#000000",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "#000000",
                    }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      backgroundColor: isFocused ? "#007bff" : "#ffffff",
                      color: isFocused ? "#ffffff" : "#000000",
                    }),
                  }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control text-end"
                  placeholder="البريد الإلكتروني"
                  dir="rtl"
                  required
                />
              </div>
              <button type="submit" className="btn btn-warning w-100">
                تسجيل الآن
              </button>
            </form>
          </Modal.Body>
        </Modal>

        {/* 🔴 Video Section */}
        <div className="row justify-content-center mt-5">
          <h2 className="text-danger text-center mb-4" dir="rtl">
            🎥 شاهد هذا الفيديو لتتعرف على ما ستتعلمه خلال ٣ أيام فقط!
          </h2>

          <div className="col-md-8">
            <div className="ratio ratio-16x9">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/S6N4LUvz06o?si=V0nZlcJyxnSMaE8B"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        {/* 🔵 Register Button */}
        <div className="row justify-content-center mt-4">
          <div className="col-md-6 text-center" dir="rtl">
            <button
              className="btn btn-lg btn-primary fw-bold px-5 py-3 shadow"
              style={{
                borderRadius: "50px",
                fontSize: "1.5rem",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              onClick={handleShow}
            >
              📢 سجل الآن
            </button>
          </div>
        </div>

        {/* What We Cover + Registration Form */}
        <div className="row align-items-center my-5">
          {/* What We Cover Section */}
          <div className="col-md-6">
            <h2 className="text-warning mb-4 text-center" dir="rtl">
              ما الذي سنغطيه؟
            </h2>
            <ul className="list-unstyled text-light fs-5" dir="rtl">
              <li className="mt-5 mb-5">
                ✔ تعلم أساسيات الفوركس من الصفر، خطوة بخطوة
              </li>
              <li className="mt-5 mb-5">
                ✔ اكتشف استراتيجيات تداول مجربة ومثبتة النجاح
              </li>
              <li className="mt-5 mb-5">
                ✔ ابدأ التداول بثقة مع نصائح من محترفي السوق
              </li>
              <li className="mt-5 mb-5">
                ✔ احصل على دعم مستمر ومواد تدريبية مجانية
              </li>
              <li className="mt-5 mb-5">
                ✔ شاهد قصص نجاح طالبنا الذين بدؤوا من الصفر
              </li>
            </ul>
          </div>

          {/* Registration Form */}
          <div className="col-md-6">
            <div className="bg-primary text-white p-4 rounded shadow-lg">
              {/* Countdown Timer in Form */}
              <div className="text-center mb-3" dir="rtl">
                <h5 className="text-warning">⏳ ينتهي التسجيل خلال:</h5>
                <h4 className="fw-bold">
                  {timeLeft.days} أيام - {timeLeft.hours} ساعات -{" "}
                  {timeLeft.minutes} دقائق - {timeLeft.seconds} ثوانٍ
                </h4>
              </div>

              {/* Form */}
              <h4 className="text-center mb-3" dir="rtl">
                📅 سجل لحضور الحدث مجانًا
              </h4>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="form-control text-end"
                    placeholder="الاسم الأول"
                    dir="rtl"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="form-control text-end"
                    placeholder="اسم العائلة"
                    dir="rtl"
                    required
                  />
                </div>
                <div className="mb-3">
                  <PhoneInput
                    country={"lb"} // Default country set to Lebanon (change if needed)
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    inputClass="form-control text-start text-black w-100"
                    dropdownClass="custom-dropdown"
                    containerStyle={{ width: "100%", color: "#000000" }}
                    excludeCountries={["il"]}
                  />
                  {phoneError && (
                    <small className="text-warning">{phoneError}</small>
                  )}
                </div>
                <div className="mb-3" dir="rtl">
                  {/* Country Dropdown */}
                  <Select
                    options={arabicCountries}
                    value={formData.country_of_residence}
                    onChange={handleCountryChange}
                    placeholder="اختر بلد الإقامة"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#ffffff", // Same as input fields
                        borderColor: "#ffffff",
                        borderRadius: "5px",
                        padding: "3px",
                        color: "#000000",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "#ffffff",
                        color: "#000000",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "#000000",
                      }),
                      option: (base, { isFocused }) => ({
                        ...base,
                        backgroundColor: isFocused ? "#007bff" : "#ffffff",
                        color: isFocused ? "#ffffff" : "#000000",
                      }),
                    }}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control text-end"
                    placeholder="البريد الإلكتروني"
                    dir="rtl"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-warning w-100 fw-bold"
                  dir="rtl"
                >
                  احجز مكانك الآن
                </button>
                <p className="text-center mt-2" dir="rtl">
                  🔒 لا رسوم - يمكنك إلغاء الاشتراك في أي وقت
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* 🔵 Register Button */}
        <div className="row justify-content-center mt-4">
          <div className="col-md-6 text-center" dir="rtl">
            <button
              className="btn btn-lg btn-primary fw-bold px-5 py-3 shadow"
              style={{
                borderRadius: "50px",
                fontSize: "1.5rem",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              onClick={handleShow}
            >
              📢 سجل الآن
            </button>
          </div>
        </div>

        {/* Testimonial Section */}
        <TestimonialSection />

        {/* 🔵 Register Button */}
        <div className="row justify-content-center mt-4">
          <div className="col-md-6 text-center" dir="rtl">
            <button
              className="btn btn-lg btn-primary fw-bold px-5 py-3 shadow"
              style={{
                borderRadius: "50px",
                fontSize: "1.5rem",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              onClick={handleShow}
            >
              📢 سجل الآن
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="container my-5 text-center">
          <h2 className="text-warning fw-bold mb-3" dir="rtl">
            🔹 احجز مقعدك الآن – عدد المقاعد محدود! 🔥🔥
          </h2>
          <p className="text-light fs-5 mb-3" dir="rtl">
            📍 يبدأ التدريب قريبًا! سجل الآن وابدأ رحلتك في عالم الفوركس 🚀
          </p>
          <p className="text-light fs-5" dir="rtl">
            📩 بعد إتمام التسجيل، ستصلك رسالة عبر البريد الإلكتروني، وسيتواصل
            معك فريقنا عبر واتساب لتأكيد حضورك ✅
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationAR;
