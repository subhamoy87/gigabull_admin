import React from 'react';

// const Authorization = ({ formData, handleInputChange, handleSignatureUpload }) => {
  const Authorization = ({ formData, handleSignatureImageUpload }) => {
  return (
    <div className="form-section">
      <h2>Authorization</h2>
      {/* <div className="form-group">
        <label htmlFor="authorizedSignatory">
          Authorized Signatory Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="authorizedSignatory"
          name="authorizedSignatory"
          value={formData.authorizedSignatory}
          onChange={handleInputChange}
          required
        />
      </div> */}
      <div className="form-group">
        <label htmlFor="signatureImageUpload">Upload Signature/Stamp:</label>
        <input
          type="file"
          id="signatureImageUpload"
          accept="image/*"
          onChange={handleSignatureImageUpload}
        />
        {formData.signatureImageBase64 && (
          <img
            src={formData.signatureImageBase64}
            alt="Signature Preview"
            style={{
              maxWidth: "100px",
              maxHeight: "50px",
              border: "1px solid #ccc",
              marginTop: "5px",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Authorization;