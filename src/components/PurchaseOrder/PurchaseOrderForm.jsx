import React, { useState, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import './PurchaseOrder.css';

// Import the new components 
// import MessageBox from './MessageBox';
// import VendorDetails from '../../components/PurchaseOrder/FormSections/VendorDetails'; 
// import CustomerDetails from '../../components/PurchaseOrder/FormSections/CustomerDetails';
// import OrderInformation from '../../components/PurchaseOrder/FormSections/OrderInformation'; 
// import DeliverTo from '../../components/PurchaseOrder/FormSections/DeliverTo';
// import OrderItems from '../../components/PurchaseOrder/FormSections/OrderItems';
// import ShippingPaymentTotals from '../../components/PurchaseOrder/FormSections/ShippingPaymentTotals';
// import Authorization from '../../components/PurchaseOrder/FormSections/Authorization';

const PurchaseOrderForm = () => {
    // Form state
    const [formData, setFormData] = useState({
        vendorName: 'Spotdeal Enterprises',
        vendorContactPerson: 'Priya Paul',
        vendorAddress: 'Metropolitan CZ-20B Co-Opt Housing Society Ltd Canal South Road, Kolkata - 700105',
        vendorMobileNo: '+91 9874525414',
        vendorEmail: 'spotdealenterprises@gmail.com',
        customerName: '',
        customerContactPerson: '',
        customerAddress: '',
        customerMobileNo: '',
        customerEmail: '',
        poNumber: '',
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: '',
        deliverToName: '',
        deliverToAddress: '',
        shippingMethod: '',
        shippingTerm: '',
        paymentTerm: '',
        shippingHandlingCharges: 0,
        otherCost: 0,
        selectedCurrency: 'USD', // Default currency
        signatureImageBase64: null
    });

    const [items, setItems] = useState([
        { id: 1, slNo: 1, description: '', quantity: 0, unitPrice: 0, amount: 0 }
    ]);

    const [totals, setTotals] = useState({
        subtotal: 0,
        totalAmount: 0
    });

    const [message, setMessage] = useState({ text: '', type: '' });
    
    // Currency options for the dropdown
    const currencyOptions = [
        { value: 'USD', label: 'USD - US Dollar ($)' },
        { value: 'EUR', label: 'EUR - Euro (€)' },
        { value: 'GBP', label: 'GBP - British Pound (£)' },
        { value: 'INR', label: 'INR - Indian Rupee (₹)' },
        { value: 'JPY', label: 'JPY - Japanese Yen (¥)' },
        { value: 'CAD', label: 'CAD - Canadian Dollar (C$)' },
        { value: 'AUD', label: 'AUD - Australian Dollar (A$)' },
    ];

    const calculateTotals = useCallback(() => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const shipping = parseFloat(formData.shippingHandlingCharges) || 0;
        const otherCost = parseFloat(formData.otherCost) || 0;
        const totalAmount = subtotal + shipping + otherCost;
        setTotals({ subtotal, totalAmount });
    }, [items, formData.shippingHandlingCharges, formData.otherCost]);

    useEffect(() => {
        calculateTotals();
    }, [calculateTotals]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (id, field, value) => {
        setItems(prevItems => prevItems.map(item =>
            item.id === id
                ? {
                    ...item,
                    [field]: ['quantity', 'unitPrice'].includes(field) ? parseFloat(value) || 0 : value,
                    amount: (field === 'quantity' ? parseFloat(value) || 0 : item.quantity) * (field === 'unitPrice' ? parseFloat(value) || 0 : item.unitPrice)
                }
                : item
        ));
    };
    
    const addItemRow = () => {
        const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
        setItems(prevItems => [
            ...prevItems,
            { id: newId, slNo: prevItems.length + 1, description: '', quantity: 0, unitPrice: 0, amount: 0 }
        ]);
    };

    const removeItemRow = (id) => {
        if (items.length <= 1) {
            setMessage({ text: 'At least one item is required', type: 'error' });
            return;
        }
        setItems(prevItems => prevItems.filter(item => item.id !== id).map((item, index) => ({ ...item, slNo: index + 1 })));
    };

    const handleSignatureImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, signatureImageBase64: reader.result }));
                setMessage({ text: 'Signature image uploaded!', type: 'success' });
            };
            reader.readAsDataURL(file);
        } else {
            setMessage({ text: 'Please upload a valid image file.', type: 'error' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation can be added here
        generatePDF();
    };

      const generatePDF = async () => {
        // Prepare the submission data
        const submissionData = {
          ...formData,
          items: items.map(item => ({
            slNo: item.slNo,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount
          })),
          subtotal: totals.subtotal,
          totalAmount: totals.totalAmount
        };
    
        // Create a new jsPDF instance with portrait orientation (p) and A4 size
        const doc = new jsPDF('p', 'mm', 'a4');
    
        // Set document properties
        doc.setProperties({
          title: `Purchase Order - ${submissionData.poNumber}`,
          subject: 'Purchase Order',
          author:  'Spotdeal Enterprises',
          keywords: 'purchase, order, po',
          creator: 'Spotdeal Enterprises'
        });
    
        // Set default font
        doc.setFont('helvetica');
        doc.setFontSize(10);
    
        // Add border around the entire page
        doc.rect(10, 10, 190, 277); // Main border (A4 size is 210x297mm, leaving 10mm margin)    
    
        // Add company header
        doc.setDrawColor(0, 0, 0);
        doc.setFillColor(240, 240, 240);
        doc.rect(15, 40, 180, 10, 'F'); // Background for title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Spotdeal Enterprises', 15, 20);
    
        // Add contact information
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Email: ${submissionData.vendorEmail}`, 15, 30);
        doc.text(`P.O. Number: ${submissionData.poNumber}`, 160, 30);
    
        doc.text(`Contact: ${submissionData.vendorMobileNo}`, 15, 36);
        doc.text(`Date: ${submissionData.orderDate}`, 160, 36);
    
        // Add title with border
        doc.setDrawColor(0, 0, 0);
        doc.setFillColor(240, 240, 240);
        doc.rect(15, 40, 180, 10, 'F'); // Background for title
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Purchase Order', 105, 47, { align: 'center' });
    
        // Vendor Details section with border
        doc.setDrawColor(0, 0, 0);
        doc.rect(15, 55, 60, 45); // Vendor border
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Vendor Details', 16, 60);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Company: ${submissionData.vendorName}`, 16, 65);
        const splitAddress1 = doc.splitTextToSize(`Address: ${submissionData.vendorAddress}`, 58);
        doc.text(splitAddress1, 16, 70);
        doc.text(`Contact Per: ${submissionData.vendorContactPerson}`, 16, 85);
        doc.text(`Mobile No: ${submissionData.vendorMobileNo}`, 16, 92);
        doc.text(`Email:${submissionData.vendorEmail}`, 16, 98);
    
        // Customer Details section with border
        doc.rect(75, 55, 60, 45); // Customer border
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Customer Details', 76, 60);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Company: ${submissionData.customerName || ''}`, 76, 65);
        const splitAddress2 = doc.splitTextToSize(`Address: ${formData.customerAddress}`, 58);
        doc.text(splitAddress2, 76, 70);
        doc.text(`Contact Per: ${submissionData.customerContactPerson || ''}`, 76, 85);
        doc.text(`Mobile No: ${submissionData.customerMobileNo || ''}`, 76, 92);
        doc.text(`Email: ${submissionData.customerEmail || ''}`, 76, 98);
    
        // Deliver To section with border
        doc.rect(135, 55, 60, 45); // Delivery border
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Deliver To', 136, 60);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Name: ${submissionData.deliverToName || ''}`, 136, 65);
        const splitAddress3 = doc.splitTextToSize(`Address: ${formData.deliverToAddress}`, 58);
        doc.text(splitAddress3, 136, 70);
        doc.text(`Contact Per: ${submissionData.deliverToContactPerson || ''}`, 136, 85);
        doc.text(`Mobile No: ${submissionData.deliverToMobileNo || ''}`, 136, 92);
    
        // Shipping section with border
        doc.rect(15, 102, 180, 15); // Shipping border
        let currentY = 110;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Shipping Method', 18, currentY - 3);
        doc.text('Incoterms® 2020', 88, currentY - 3);
        doc.text('Delivery Date', 150, currentY - 3);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
    
        doc.text(submissionData.shippingMethod || '', 32, currentY + 5);
        doc.text(submissionData.shippingTerm || '', 98, currentY + 5);
        doc.text(submissionData.deliveryDate || '', 155, currentY + 5);
        currentY += 11;
    
        // Items Table with borders
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.rect(15, currentY, 180, 7); // Draw rectangle for header
        doc.text('Sl.', 16, currentY + 5);
        doc.text('Description', 25, currentY + 5);
        doc.text('Quantity', 145, currentY + 5, { align: 'right' });
        doc.text(`Price (${submissionData.selectedCurrency})`, 170, currentY + 5, { align: 'right' });
        doc.text('Amount', 190, currentY + 5, { align: 'right' });
    
        // Items Table Rows
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        currentY += 7; // Move to start of first row
        submissionData.items.forEach(item => {
          const rowHeight = 7;
          // Check if we need a new page for the current row
          if (currentY + rowHeight > 270) {
            doc.addPage();
            doc.rect(10, 10, 190, 277); // Border for new page
            currentY = 20;
            // Redraw table header on new page
            doc.setFont('helvetica', 'bold');
            doc.rect(15, currentY, 180, 7);
            doc.text('Sl. No.', 18, currentY + 5);
            doc.text('Description', 45, currentY + 5);
            doc.text('Quantity', 135, currentY + 5, { align: 'right' });
            doc.text('Price', 165, currentY + 5, { align: 'right' });
            doc.text('Amount', 190, currentY + 5, { align: 'right' });
            doc.setFont('helvetica', 'normal');        
            currentY += 7;
          }
    
          doc.rect(15, currentY, 180, rowHeight);
          doc.text(item.slNo.toString(), 16, currentY + 5);
    
          // Split description if too long
          const descLines = doc.splitTextToSize(item.description, 80);
          if (descLines.length > 1) {
            doc.text(descLines[0], 25, currentY + 5);
            for (let i = 1; i < descLines.length; i++) {
              currentY += 5;
              doc.rect(15, currentY, 180, rowHeight); // Extend row for multi-line
              doc.text(descLines[i], 25, currentY + 5);
            }
          } else {
            doc.text(item.description, 25, currentY + 5);
          }
    
          doc.text(item.quantity.toString(), 142, currentY + 5, { align: 'right' });
          doc.text(item.unitPrice.toFixed(2), 164, currentY + 5, { align: 'right' });
          doc.text(item.amount.toFixed(2), 190, currentY + 5, { align: 'right' });      
          currentY += rowHeight;
        });
    
        // Payment Term and Totals Section with border
        doc.rect(15, currentY + 5, 180, 45); // Border for totals section
    
        currentY += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('Payment Term:', 16, currentY);
        doc.setFont('helvetica', 'normal');
        const splitPaymentTerm = doc.splitTextToSize(submissionData.paymentTerm, 60);
        doc.text(splitPaymentTerm, 16, currentY + 5);
    
        // Totals
        doc.setFont('helvetica', 'bold');
        doc.text('Subtotal:', 150, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(submissionData.subtotal.toFixed(2), 190, currentY, { align: 'right' });
        currentY += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('Shipping:', 150, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(submissionData.shippingHandlingCharges.toString(), 190, currentY, { align: 'right' });
        currentY += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('Other Cost:', 150, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(submissionData.otherCost.toString(), 190, currentY, { align: 'right' });
    
        currentY += 7;
        doc.setFont('helvetica', 'bold');
        doc.text(`Grand Total (${submissionData.selectedCurrency})`, 140, currentY);
        doc.text(submissionData.totalAmount.toFixed(2), 190, currentY, { align: 'right' });
        
        // Horizontal line before totals
        doc.line(140, currentY - 5, 195, currentY - 5);
    
        // Horizontal line after totals
        doc.line(140, currentY + 3, 195, currentY + 3);
        currentY += 15;
    
        // // Authorized Signatory with border
        doc.text('Authorized Signatory', 15, currentY + 20);
        doc.setFont('helvetica', 'normal');    
        doc.text(submissionData.vendorContactPerson, 15, currentY + 10);
        
    
        // Signature line
        doc.line(15, currentY + 15, 65, currentY + 15);
    
         
    const generatePDF = () => {
      // Prepare the submission data
      const submissionData = {
        ...formData,
        items: items.map(item => ({
          slNo: item.slNo,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount
        })),
        subtotal: totals.subtotal,
        totalAmount: totals.totalAmount
      }; 
      
      currentY += 15;
      
      // Save the PDF
      doc.save(`Purchase_Order_${submissionData.poNumber}.pdf`);
    
      // Show success message
      showMessage('PDF generated successfully!', 'success');
    };
    
    // doc.text(submissionData.authorizedSignatory, 15, currentY + 25);
    // doc.text('Authorized Signatory', 15, currentY + 30);
     // Add signature image if uploaded
            if (formData.signatureImageBase64) {
                try {
                    const img = new Image();
                    img.src = formData.signatureImageBase64;
    
                    await new Promise((resolve, reject) => {
                        img.onload = () => resolve();
                        img.onerror = (error) => reject(new Error('Failed to load signature image.'));
                    });
                    const signatureX = 15; // Left margin
                    const signatureY = currentY + 5; // Below the signature line
                    const maxWidth = 50;
                    const maxHeight = 20;
                    let width = img.width;
                    let height = img.height;
    
                    // Maintain aspect ratio
                    if (width > maxWidth) {
                        const ratio = maxWidth / width;
                        width = maxWidth;
                        height = height * ratio;
                    }
                    if (height > maxHeight) {
                        const ratio = maxHeight / height;
                        height = maxHeight;
                        width = width * ratio;
                    }
    
                    const imgFormat = formData.signatureImageBase64.substring("data:image/".length, formData.signatureImageBase64.indexOf(";base64")).toUpperCase();
                    doc.addImage(formData.signatureImageBase64, imgFormat, signatureX, signatureY + 16, width +15, height +10);
                } catch (error) {
                    console.error("Error adding signature image:", error);
                }
            }
    
        // Save the PDF
        doc.save(`Purchase_Order_${submissionData.poNumber}.pdf`);
    
        // Show success message
        showMessage('PDF generated successfully!', 'success');
      };

    return (
        <div className="purchase-order-container">
            <div className="form-wrapper">
                <div className="header">
                    <h1>Purchase Order</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-section details-flex">
                        <div>
                            <h3>Vendor Details</h3>
                            <div className="form-group">
                                <label>Name:</label>
                                <input type="text" name="vendorName" value={formData.vendorName} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Address:</label>
                                <textarea name="vendorAddress" value={formData.vendorAddress} readOnly rows="3"></textarea>
                            </div>
                            <div className="form-group">
                                <label>Contact Person:</label>
                                <input type="text" name="vendorContactPerson" value={formData.vendorContactPerson} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Mobile No:</label>
                                <input type="tel" name="vendorMobileNo" value={formData.vendorMobileNo} readOnly />
                            </div>
                             <div className="form-group">
                                <label>Email:</label>
                                <input type="email" name="vendorEmail" value={formData.vendorEmail} readOnly />
                            </div>
                        </div>

                        <div>
                            <h3>Customer Details</h3>
                            <div className="form-group">
                                <label>Name:</label>
                                <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Address:</label>
                                <textarea name="customerAddress" value={formData.customerAddress} onChange={handleInputChange} rows="3" required></textarea>
                            </div>
                            <div className="form-group">
                                <label>Contact Person:</label>
                                <input type="text" name="customerContactPerson" value={formData.customerContactPerson} onChange={handleInputChange} required/>
                            </div>
                            <div className="form-group">
                                <label>Mobile No:</label>
                                <input type="tel" name="customerMobileNo" value={formData.customerMobileNo} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Order Information</h3>
                        <div className="details-grid">
                            <div className="form-group">
                                <label>P.O. Number:</label>
                                <input type="text" name="poNumber" value={formData.poNumber} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Order Date:</label>
                                <input type="date" name="orderDate" value={formData.orderDate} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Delivery Date:</label>
                                <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleInputChange} required />
                            </div>
                            {/* --- CURRENCY DROPDOWN ADDED HERE --- */}
                            <div className="form-group">
                                <label htmlFor="currency">Currency:</label>
                                <select id="currency" name="selectedCurrency" value={formData.selectedCurrency} onChange={handleInputChange}>
                                    <option value="">Select...</option>
                                    {currencyOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Deliver To</h3>
                        <div className="details-grid">
                             <div className="form-group">
                                <label>Name:</label>
                                <input type="text" name="deliverToName" value={formData.deliverToName} onChange={handleInputChange} required/>
                            </div>
                            <div className="form-group">
                                <label>Address:</label>
                                <textarea name="deliverToAddress" value={formData.deliverToAddress} onChange={handleInputChange} rows="3" required></textarea>
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-section line-items">
                        <h3>Order Items</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Description</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id}>
                                        <td><input type="text" value={item.slNo} readOnly /></td>
                                        <td><textarea value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} rows="1"></textarea></td>
                                        <td><input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} min="0" /></td>
                                        <td><input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)} min="0" step="0.01" /></td>
                                        <td>{item.amount.toFixed(2)}</td>
                                        <td><button type="button" onClick={() => removeItemRow(item.id)} className="remove-item-btn">Remove</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={addItemRow} className="add-item-btn">Add Item</button>
                    </div>

                    <div className="form-section">
                         <h3>Shipping & Payment</h3>
                        <div className="details-grid">
                            <div className="form-group">
                                <label>Shipping Method:</label>
                                <input type="text" name="shippingMethod" value={formData.shippingMethod} onChange={handleInputChange} required/>
                            </div>
                            <div className="form-group">
                                <label>Shipping Term (Incoterms):</label>
                                <input type="text" name="shippingTerm" value={formData.shippingTerm} onChange={handleInputChange} required/>
                            </div>
                            <div className="form-group">
                                <label>Payment Term:</label>
                                <textarea name="paymentTerm" value={formData.paymentTerm} onChange={handleInputChange} rows="3" required></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="form-section totals-section">
                        <div className="total-row">
                            <span>Subtotal:</span>
                            <span>{formData.selectedCurrency} {totals.subtotal.toFixed(2)}</span>
                        </div>
                         <div className="total-row">
                            <span>Shipping & Handling:</span>
                            <input type="number" name="shippingHandlingCharges" value={formData.shippingHandlingCharges} onChange={handleInputChange}/>
                        </div>
                        <div className="total-row">
                            <span>Other Costs:</span>
                            <input type="number" name="otherCost" value={formData.otherCost} onChange={handleInputChange} />
                        </div>
                        <div className="total-row grand-total">
                            <span>Grand Total:</span>
                            <span>{formData.selectedCurrency} {totals.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Authorization</h3>
                        <div className="form-group">
                            <label htmlFor="signatureImageUpload">Upload Signature/Stamp:</label>
                            <input type="file" id="signatureImageUpload" accept="image/*" onChange={handleSignatureImageUpload} required/>
                            {formData.signatureImageBase64 && (
                                <img src={formData.signatureImageBase64} alt="Signature Preview" style={{ maxWidth: '150px', maxHeight: '100px', border: '1px solid #ccc', marginTop: '5px' }} />
                            )}
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">Generate Purchase Order</button>
                </form>
            </div>
        </div>
    );
};

export default PurchaseOrderForm;