import React from 'react';

const OrderInformation = ({ formData, handleInputChange }) => {
  return (
    <div className="form-section">
      <h2>Order Information</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="poNumber">P.O. Number <span className="required">*</span></label>
          <input
            type="text"
            id="poNumber"
            name="poNumber"
            value={formData.poNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="orderDate">Order Date <span className="required">*</span></label>
          <input
            type="date"
            id="orderDate"
            name="orderDate"
            value={formData.orderDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="deliveryDate">Expected Delivery Date</label>
          <input
            type="date"
            id="deliveryDate"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderInformation;