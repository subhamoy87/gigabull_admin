import React from 'react';

const ShippingPaymentTotals = ({ formData, handleInputChange, totals }) => {
  return (
    <div className="form-section">
      <h2>Shipping, Payment & Totals</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="shippingMethod">Shipping Method</label>
          <input
            type="text"
            id="shippingMethod"
            name="shippingMethod"
            value={formData.shippingMethod}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="shippingTerm">Incoterms® 2020</label>
          <input
            type="text"
            id="shippingTerm"
            name="shippingTerm"
            value={formData.shippingTerm}
            onChange={handleInputChange}
          />
        </div>        
        {/* CURRENCY SELECTION SECTION */}  
            <div className="form-group">
              <label htmlFor="currency">Select Currency:</label>
              <select
                id="currency"
                name="selectedCurrency" // Name matches state key if using generic handleInputChange
                value={formData.selectedCurrency}
                onChange={handleInputChange} // Specific handler for currency
                className="form-control"
              >
                <option value="INR">INR - Indian Rupee (₹)</option>
                <option value="USD">USD - US Dollar ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="GBP">GBP - British Pound (£)</option>
                <option value="JPY">JPY - Japanese Yen (¥)</option>
                <option value="CAD">CAD - Canadian Dollar (C$)</option>
                <option value="AUD">AUD - Australian Dollar (A$)</option>
              </select>
            </div>
            <div className="form-group full-width2">
          <label htmlFor="paymentTerm">Payment Term</label>
          <input
            type="text"
            id="paymentTerm"
            name="paymentTerm"
            value={formData.paymentTerm}
            onChange={handleInputChange}
          />
        </div>
        <div className="totals-section">
          <div className="total-row">
            <label>Subtotal:</label>
            <input
              type="text"
              value={totals.subtotal.toFixed(2)}
              readOnly
              className="readonly-field total-field"
            />
          </div>
          <div className="total-row">
            <label>Shipping Charge:</label>
            <input
              type="number"
              id="shippingHandlingCharges"
              name="shippingHandlingCharges"
              value={formData.shippingHandlingCharges}
              onChange={handleInputChange}
              // step="0.01"
              className="total-field"
            />
          </div>
          <div className="total-row">
            <label>Other Costs:</label>
            <input
              type="number"
              id="otherCost"
              name="otherCost"
              value={formData.otherCost}
              onChange={handleInputChange}
              // step="0.01"
              className="total-field"
            />
          </div>
          <div className="total-row grand-total">
            <label>Total Amount:</label>
            <input
              type="text"
              value={totals.totalAmount.toFixed(2)}
              readOnly
              className="readonly-field total-field"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPaymentTotals;