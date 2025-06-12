import React from 'react';

const CustomerDetails = ({ formData, handleInputChange }) => {
  return (
    <div className="form-section">
      <h2>Customer Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="customerName">Company Name <span className="required">*</span></label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="customerContactPerson">Contact Person</label>
          <input
            type="text"
            id="customerContactPerson"
            name="customerContactPerson"
            value={formData.customerContactPerson}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="customerMobileNo">Mobile No.</label>
          <input
            type="number"
            id="customerMobileNo"
            name="customerMobileNo"
            value={formData.customerMobileNo}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="customerEmail">Email</label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="customerAddress">Address <span className="required">*</span></label>
          <textarea
            id="customerAddress"
            name="customerAddress"
            rows="2"
            value={formData.customerAddress}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;