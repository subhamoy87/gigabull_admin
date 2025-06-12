import React from 'react';

const DeliverTo = ({ formData, handleInputChange }) => {
  return (
    <div className="form-section">
      <h2>Deliver To</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="deliverToName">Name<span className="required">*</span></label>
          <input
            type="text"
            id="deliverToName"
            name="deliverToName"
            value={formData.deliverToName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="deliverToContactPerson">Contact Person</label>
          <input
            type="text"
            id="deliverToContactPerson"
            name="deliverToContactPerson"
            value={formData.deliverToContactPerson}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="deliverToMobileNo">Mobile No.</label>
          <input
            type="number"
            id="deliverToMobileNo"
            name="deliverToMobileNo"
            value={formData.deliverToMobileNo}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group full-width2">
          <label htmlFor="deliverToAddress">Address <span className="required">*</span></label>
          <textarea
            id="deliverToAddress"
            name="deliverToAddress"
            rows="2"
            value={formData.deliverToAddress}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default DeliverTo;