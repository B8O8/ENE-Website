import React from "react";
import "./TopCategories.css";

const categories = [
  { id: 1, icon: "fa-chart-line", name: "Sales" },
  { id: 2, icon: "fa-bullhorn", name: "Marketing" },
  { id: 3, icon: "fa-lightbulb", name: "Personal Development" },
  { id: 4, icon: "fa-chart-bar", name: "Forex Trading" },
  { id: 5, icon: "fa-users", name: "Networking" },
];

const TopCategories = () => {
  return (
    <div className="categories-section py-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-4">
          Top Categories <span className="highlight-line"></span>
        </h2>
        <div className="row justify-content-center">
          {categories.map((category) => (
            <div
              key={category.id}
              className="col-12 col-sm-6 col-md-4 col-lg-2 mb-3 category-card"
            >
              <div className="card p-3 text-center shadow-sm">
                <i className={`fas ${category.icon} icon`}></i>
                <h6 className="mt-2">{category.name}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCategories;
