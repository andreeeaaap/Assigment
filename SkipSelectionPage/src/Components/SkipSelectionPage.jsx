import React, { useState, useEffect } from "react";
import "./SkipSelection.css";

const SkipSelectionPage = () => {
  const [skips, setSkips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkip, setSelectedSkip] = useState(null);

  useEffect(() => {
    const fetchSkips = async () => {
      try {
        const response = await fetch(
          "https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        const formattedSkips = data.map((skip) => ({
          id: skip.id,
          size: skip.size,
          price: skip.price_before_vat,
          vat: skip.vat,
          hirePeriod: skip.hire_period_days,
          capacity: `${skip.size} yards`,
          features: [
            `Hire for ${skip.hire_period_days} days`,
            skip.allowed_on_road && "Can be placed on road",
            skip.allows_heavy_waste && "Accepts heavy waste",
          ].filter(Boolean),
          imageUrl: "/src/Components/skip.jpg",
        }));

        setSkips(formattedSkips);
      } catch (err) {
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSkips();
  }, []);

  if (loading)
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading available skips...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-screen">
        <div className="error-icon">!</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );

  return (
    <div className="skip-selection-container">
      <header className="selection-header">
        <h1>Select Your Skip Size</h1>
        <p>Choose the perfect skip for your needs</p>
      </header>

      <div className="skips-grid">
        {skips.map((skip) => (
          <div
            key={skip.id}
            className={`skip-card ${
              selectedSkip === skip.id ? "selected" : ""
            }`}
            onClick={() => setSelectedSkip(skip.id)}
          >
            <div className="card-badge">{skip.size} Yards</div>
            <img
              src={skip.imageUrl}
              alt={`${skip.size} cubic yard skip`}
              className="skip-image"
            />

            <div className="card-content">
              <h3>{skip.size} Yard Skip</h3>

              <div className="price-section">
                <span className="price">£{skip.price.toFixed(2)}</span>
                <span className="vat">+ VAT</span>
              </div>

              <ul className="features-list">
                {skip.features.map((feature, index) => (
                  <li key={index}>
                    <span className="feature-icon">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-footer">
              {selectedSkip === skip.id ? (
                <button className="selected-btn">Selected</button>
              ) : (
                <button className="select-btn">Select This Skip</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="action-bar">
        {selectedSkip && (
          <div className="selection-summary">
            Selected:{" "}
            <strong>
              {skips.find((s) => s.id === selectedSkip)?.size} Yards Skip
            </strong>
          </div>
        )}
        <button
          className={`continue-btn ${!selectedSkip ? "disabled" : ""}`}
          disabled={!selectedSkip}
        >
          Continue to Booking
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default SkipSelectionPage;
