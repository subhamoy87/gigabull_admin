import React from 'react';

const VendorDetails = ({ formData }) => {
  return (
    <div className="form-section">
      <h2>Vendor Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="vendorName">Company Name</label>
          <input
            type="text"
            id="vendorName"
            name="vendorName"
            value={formData.vendorName}
            readOnly
            className="readonly-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="vendorContactPerson">Contact Person</label>
          <input
            type="text"
            id="vendorContactPerson"
            name="vendorContactPerson"
            value={formData.vendorContactPerson}
            readOnly
            className="readonly-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="vendorMobileNo">Mobile No.</label>
          <input
            type="tel"
            id="vendorMobileNo"
            name="vendorMobileNo"
            value={formData.vendorMobileNo}
            readOnly
            className="readonly-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="vendorEmail">Email</label>
          <input
            type="email"
            id="vendorEmail"
            name="vendorEmail"
            value={formData.vendorEmail}
            readOnly
            className="readonly-field"
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="vendorAddress">Address</label>
          <textarea
            id="vendorAddress"
            name="vendorAddress"
            rows="2"
            value={formData.vendorAddress}
            readOnly
            className="readonly-field"
          />
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;