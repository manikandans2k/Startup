import React from "react";

const Categories = ({ onCategoryClick }) => {
  const categories = [
    {
      name: "Home Stone Appliances",
      icon: "fa-home",
      color: "warning",
      value: "home",
      description: "Premium stone fixtures for modern homes",
    },
    {
      name: "Stone Interior Designs",
      icon: "fa-couch",
      color: "secondary",
      value: "interior",
      description: "Elegant interiors with natural stone",
    },
    {
      name: "Pillars & Columns",
      icon: "fa-columns",
      color: "dark",
      value: "pillars",
      description: "Majestic stone pillars for architecture",
    },
    {
      name: "Temple & God Statues",
      icon: "fa-om",
      color: "danger",
      value: "temple",
      description: "Divine sculptures for worship",
    },
    {
      name: "Name Boards & Engravings",
      icon: "fa-signature",
      color: "primary",
      value: "nameboard",
      description: "Custom engraved stone signage",
    },
    {
      name: "Custom Stone Carvings",
      icon: "fa-hammer",
      color: "info",
      value: "custom",
      description: "Bespoke artistic stone work",
    },
  ];

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <h2 className="text-center display-5 fw-bold mb-5">
          Our Product Categories
        </h2>

        <div className="row g-4">
          {categories.map((category, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div
                className={`category-card card h-100 border-0 shadow-sm bg-${category.color} bg-opacity-10`}
                onClick={() => onCategoryClick(category.value)}
              >
                <div className="card-body p-4">
                  <i
                    className={`fas ${category.icon} fs-1 text-${category.color} mb-3`}
                  ></i>
                  <h3 className="h4 fw-bold mb-2">{category.name}</h3>
                  <p className="text-muted mb-3">{category.description}</p>
                  <button
                    className={`btn btn-link text-${category.color} fw-semibold p-0`}
                  >
                    View Collection →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
