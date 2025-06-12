import React from 'react';

const OrderItems = ({ items, handleItemChange, addItemRow, removeItemRow, showMessage }) => {
  return (
    <div className="form-section">
      <h2>Order Items</h2>
      <div className="items-container">
        {items.map(item => (
          <div key={item.id} className="item-row">
            <div className="item-field sl-no">
              <label>Sl.No.</label>
              <input
                type="text"
                value={item.slNo}
                readOnly
                className="readonly-field"
              />
            </div>
            <div className="item-field description">
              <label>Description <span className="required">*</span></label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                required
              />
            </div>
            <div className="item-field quantity">
              <label>Quantity <span className="required">*</span></label>
              <input
                type="number"
                min="0"
                step="any"
                value={item.quantity}
                onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                required
              />
            </div>
            <div className="item-field unit-price">
              <label>Unit Price <span className="required">*</span></label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                required
              />
            </div>
            <div className="item-field amount">
              <label>Amount</label>
              <input
                type="text"
                value={item.amount.toFixed(2)}
                readOnly
                className="readonly-field"
              />
            </div>
            <button
              type="button"
              className="remove-item-btn"
              onClick={() => removeItemRow(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="add-item-btn"
        onClick={addItemRow}
      >
        Add Item
      </button>
    </div>
  );
};

export default OrderItems;