import React, { useState, useEffect, useCallback } from 'react';
const { default: jsPDF } = await import('jspdf');
// import MessageBox from './MessageBox';
import './ProformaInvoiceForm.css';

const ProformaInvoiceForm = () => {
    // 1. State Management for all form fields
    const [formData, setFormData] = useState({
        // Header
        invoiceNumber: '',
        issueDate: new Date().toISOString().split('T')[0], // Default to today
        buyerReference: '',
        dueDate: '',
        deliveryDate: '',
        pages: '1 of 1', // Will be dynamic for multi-page PDFs
        
        // Seller Details
        sellerName: 'Spotdeal Enterprises', // Pre-fill as per previous example
        sellerAddress: 'Metropolitan CZ-20B Co-Opt Housing Society Ltd Canal South Road, Kolkata - 700105', // Pre-fill
        sellerPhone: '+91 9874525414', // Pre-fill
        sellerEmail: 'spotdealenterprises@gmail.com', // Pre-fill

        // Buyer Details
        buyerName: '',
        buyerAddress: '',
        buyerPhone: '',
        buyerEmail: '',

        // Shipping / Payment
        methodOfDispatch: '',
        typeOfShipment: '',
        termsOfPayment: '',
        portOfLoading: '',
        portOfDischarge: '',
        incoterms: 'EXW', // Default Incoterm

        // Additional Info
        additionalInfo: '',

        // Bank Details
        bankDetails: `Bank Name: [Your Bank Name]\nAccount No: [Your Account Number]\nSWIFT Code: [Your SWIFT Code]\nBranch: [Your Branch Name]`, // Placeholder for multiple lines or structured data

        // Signatory
        signatoryCompany: 'Spotdeal Enterprises', // Pre-fill
        nameOfAuthorizedSignatory: 'Priya Paul', // Pre-fill
        signatureImageBase64: null, // For uploaded signature

        // Currency
        selectedCurrency: 'USD', // Default currency
    });

    // State for dynamic line items
    const [items, setItems] = useState([
        { id: 1, productCode: '', description: '', unitQuantity: 0, unitType: '', price: 0, amount: 0 }
    ]);

    // State for calculated totals
    const [totals, setTotals] = useState({
        totalThisPage: 0,
        consignmentTotal: 0,
    });

    const [message, setMessage] = useState({ text: '', type: '' });

    // Constants for dropdown options
    const currencyOptions = [
        { value: 'USD', label: 'USD - US Dollar ($)' },
        { value: 'EUR', label: 'EUR - Euro (€)' },
        { value: 'GBP', label: 'GBP - British Pound (£)' },
        { value: 'INR', label: 'INR - Indian Rupee (₹)' },
        { value: 'JPY', label: 'JPY - Japanese Yen (¥)' },
        { value: 'CAD', label: 'CAD - Canadian Dollar (C$)' },
        { value: 'AUD', label: 'AUD - Australian Dollar (A$)' },
    ];

    const unitTypeOptions = ['Pcs', 'Kg', 'Meters', 'Liters', 'Box', 'Set'];
    const dispatchOptions = ['Air Cargo', 'Sea Freight', 'Road Transport', 'Courier'];
    const shipmentOptions = ['FCL', 'LCL', 'Break Bulk', 'Parcel'];
    const paymentTermsOptions = ['Advance', 'Net 30', 'Net 60', 'CAD', 'LC'];
    const incotermsOptions = ['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF'];

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };
    // Simple MessageBox component (can be in a separate file like common/MessageBox.jsx)
const MessageBox = ({ message }) => {
    if (!message.text) return null;
    return (
        <div className={`message-box ${message.type}`}>
            {message.text}
        </div>
    );
};

    // 2. Calculation Logic (useEffect and useCallback)
    const calculateTotals = useCallback(() => {
        let currentTotal = 0;
        items.forEach(item => {
            currentTotal += (item.unitQuantity * item.price);
        });
        setTotals({
            totalThisPage: currentTotal,
            consignmentTotal: currentTotal, // For this simple template, they are the same
        });
    }, [items]);

    useEffect(() => {
        calculateTotals();
    }, [calculateTotals, items]); // Recalculate if items change

    // 3. Handlers for form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (id, field, value) => {
        setItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.id === id
                    ? {
                        ...item,
                        [field]: field === 'unitQuantity' || field === 'price' ? parseFloat(value) || 0 : value,
                        amount: field === 'unitQuantity' || field === 'price'
                            ? (field === 'unitQuantity' ? parseFloat(value) || 0 : item.unitQuantity) *
                              (field === 'price' ? parseFloat(value) || 0 : item.price)
                            : item.amount
                    }
                    : item
            );
            return updatedItems;
        });
    };

    const addItemRow = () => {
        const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
        setItems(prevItems => [...prevItems, { id: newId, productCode: '', description: '', unitQuantity: 0, unitType: '', price: 0, amount: 0 }]);
    };

    const removeItemRow = (id) => {
        if (items.length <= 1) {
            showMessage('At least one item is required.', 'error');
            return;
        }
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };    

    const handleSignatureImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showMessage('Please upload an image file (PNG, JPG, GIF).', 'error');
                console.log('Bad Image!!');
                setFormData(prev => ({ ...prev, signatureImageBase64: null }));
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, signatureImageBase64: reader.result }));
                showMessage('Signature image uploaded!', 'success');
            };
            reader.onerror = () => {
                showMessage('Failed to read signature image.', 'error');
                setFormData(prev => ({ ...prev, signatureImageBase64: null }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, signatureImageBase64: null }));
        }
    };


    // 4. PDF Generation Function
  const generatePDF = async () => {
    try {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF('p', 'mm', 'a4');
        const margin = 10;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight(); // Add this line

        let currentY = margin;

        // Set default font
        doc.setFont('helvetica');
        doc.setFontSize(10);
        doc.setDrawColor(0); // Black border color
        doc.setLineWidth(0.2); // Thin border

        // Header Section with border
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFORMA INVOICE', pageWidth / 2, currentY + 10, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        currentY += 20;

        // Main container border
        doc.rect(margin, currentY, pageWidth - 2 * margin, pageHeight - currentY - margin);

        // Invoice Details Box (top right)
        const invoiceBoxWidth = 60;
        const invoiceBoxHeight = 25;
        doc.rect(pageWidth - margin - invoiceBoxWidth, currentY, invoiceBoxWidth, invoiceBoxHeight);

        doc.text(`Pages: ${formData.pages}`, pageWidth - margin - invoiceBoxWidth + 2, currentY + 5);
        doc.text(`Invoice Number:`, pageWidth - margin - invoiceBoxWidth + 2, currentY + 10);
        doc.text(formData.invoiceNumber, pageWidth - margin - 2, currentY + 10, { align: 'right' });
        doc.text(`Issue Date:`, pageWidth - margin - invoiceBoxWidth + 2, currentY + 15);
        doc.text(formData.issueDate, pageWidth - margin - 2, currentY + 15, { align: 'right' });
        doc.text(`Buyer Reference:`, pageWidth - margin - invoiceBoxWidth + 2, currentY + 20);
        doc.text(formData.buyerReference, pageWidth - margin - 2, currentY + 20, { align: 'right' });

        // Seller & Buyer Boxes with borders
        const boxWidth = (pageWidth - 3 * margin - invoiceBoxWidth) / 2;
        const boxHeight = 40;
        
        // Seller Box
        doc.rect(margin, currentY, boxWidth, boxHeight);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Seller', margin + 2, currentY + 5);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(formData.sellerName, margin + 2, currentY + 10);
        doc.text(doc.splitTextToSize(formData.sellerAddress, boxWidth - 4), margin + 2, currentY + 15);
        doc.text(`Phone: ${formData.sellerPhone}`, margin + 2, currentY + 25);
        doc.text(`Email: ${formData.sellerEmail}`, margin + 2, currentY + 30);

        // Buyer Box
        doc.rect(margin + boxWidth + margin, currentY, boxWidth, boxHeight);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Buyer', margin + boxWidth + margin + 2, currentY + 5);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(formData.buyerName, margin + boxWidth + margin + 2, currentY + 10);
        doc.text(doc.splitTextToSize(formData.buyerAddress, boxWidth - 4), margin + boxWidth + margin + 2, currentY + 15);
        doc.text(`Phone: ${formData.buyerPhone}`, margin + boxWidth + margin + 2, currentY + 25);
        doc.text(`Email: ${formData.buyerEmail}`, margin + boxWidth + margin + 2, currentY + 30);

        currentY += boxHeight;

        // Horizontal line separator
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 5;

        // Shipment and Payment Details with borders
        const detailBoxHeight = 30;
        doc.rect(margin, currentY, pageWidth - 2 * margin, detailBoxHeight);
        
        // Vertical separators
        doc.line(margin + (pageWidth - 2 * margin) / 3, currentY, margin + (pageWidth - 2 * margin) / 3, currentY + detailBoxHeight);
        doc.line(margin + 2 * (pageWidth - 2 * margin) / 3, currentY, margin + 2 * (pageWidth - 2 * margin) / 3, currentY + detailBoxHeight);
        
        // Horizontal separator
        doc.line(margin, currentY + detailBoxHeight / 2, pageWidth - margin, currentY + detailBoxHeight / 2);

        // Labels
        doc.setFont('helvetica', 'bold');
        doc.text('Method of Dispatch', margin + 5, currentY + 7);
        doc.text('Type of Shipment', margin + (pageWidth - 2 * margin) / 3 + 5, currentY + 7);
        doc.text('Terms / Method of Payment', margin + 2 * (pageWidth - 2 * margin) / 3 + 5, currentY + 7);
        
        doc.text('Port of Loading', margin + 5, currentY + detailBoxHeight / 2 + 7);
        doc.text('Port of Discharge', margin + (pageWidth - 2 * margin) / 3 + 5, currentY + detailBoxHeight / 2 + 7);

        // Values
        doc.setFont('helvetica', 'normal');
        doc.text(formData.methodOfDispatch, margin + 5, currentY + 15);
        doc.text(formData.typeOfShipment, margin + (pageWidth - 2 * margin) / 3 + 5, currentY + 15);
        doc.text(formData.termsOfPayment, margin + 2 * (pageWidth - 2 * margin) / 3 + 5, currentY + 15);
        
        doc.text(formData.portOfLoading, margin + 5, currentY + detailBoxHeight / 2 + 15);
        doc.text(formData.portOfDischarge, margin + (pageWidth - 2 * margin) / 3 + 5, currentY + detailBoxHeight / 2 + 15);

        currentY += detailBoxHeight + 5;

        // Products Table with borders
        const tableHeaderHeight = 8;
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, currentY, pageWidth - 2 * margin, tableHeaderHeight, 'F');
        doc.rect(margin, currentY, pageWidth - 2 * margin, tableHeaderHeight);
        
        // Table headers
        doc.setFont('helvetica', 'bold');
        doc.text('Product Code', margin + 5, currentY + 6);
        doc.text('Description of Goods', margin + 30, currentY + 6);
        doc.text('Unit Quantity', margin + 110, currentY + 6, { align: 'right' });
        doc.text('Unit Type', margin + 130, currentY + 6);
        doc.text('Price', margin + 150, currentY + 6, { align: 'right' });
        doc.text('Amount', margin + 180, currentY + 6, { align: 'right' });
        
        currentY += tableHeaderHeight;

        // Table rows
        doc.setFont('helvetica', 'normal');
        items.forEach(item => {
            // Check if we need a new page
            if (currentY > doc.internal.pageSize.getHeight() - 20) {
                doc.addPage();
                currentY = margin;
                // Redraw table header on new page
                doc.setFillColor(240, 240, 240);
                doc.rect(margin, currentY, pageWidth - 2 * margin, tableHeaderHeight, 'F');
                doc.rect(margin, currentY, pageWidth - 2 * margin, tableHeaderHeight);
                doc.setFont('helvetica', 'bold');
                doc.text('Product Code', margin + 5, currentY + 6);
                doc.text('Description of Goods', margin + 30, currentY + 6);
                doc.text('Unit Quantity', margin + 110, currentY + 6, { align: 'right' });
                doc.text('Unit Type', margin + 130, currentY + 6);
                doc.text('Price', margin + 150, currentY + 6, { align: 'right' });
                doc.text('Amount', margin + 180, currentY + 6, { align: 'right' });
                currentY += tableHeaderHeight;
                doc.setFont('helvetica', 'normal');
            }

            // Calculate row height based on description
            const descLines = doc.splitTextToSize(item.description, 70);
            const rowHeight = Math.max(10, descLines.length * 5);

            // Draw row border
            doc.rect(margin, currentY, pageWidth - 2 * margin, rowHeight);

            // Product Code
            doc.text(item.productCode, margin + 5, currentY + 6);
            
            // Description (with line breaks if needed)
            descLines.forEach((line, i) => {
                doc.text(line, margin + 30, currentY + 6 + (i * 5));
            });
            
            // Other columns
            doc.text(item.unitQuantity.toString(), margin + 110, currentY + 6, { align: 'right' });
            doc.text(item.unitType, margin + 130, currentY + 6);
            doc.text(`${formData.selectedCurrency} ${item.price.toFixed(2)}`, margin + 150, currentY + 6, { align: 'right' });
            doc.text(`${formData.selectedCurrency} ${item.amount.toFixed(2)}`, margin + 180, currentY + 6, { align: 'right' });
            
            currentY += rowHeight;
        });

        // Totals Section with borders
        currentY += 5;
        const totalsBoxHeight = 20;
        doc.rect(pageWidth - margin - 100, currentY, 100, totalsBoxHeight);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Total This Page', pageWidth - margin - 95, currentY + 8);
        doc.text(`${formData.selectedCurrency} ${totals.totalThisPage.toFixed(2)}`, pageWidth - margin - 5, currentY + 8, { align: 'right' });
        
        doc.rect(pageWidth - margin - 100, currentY + totalsBoxHeight, 100, totalsBoxHeight);
        doc.text('Consignment Total', pageWidth - margin - 95, currentY + totalsBoxHeight + 8);
        doc.text(`${formData.selectedCurrency} ${totals.consignmentTotal.toFixed(2)}`, pageWidth - margin - 5, currentY + totalsBoxHeight + 8, { align: 'right' });
        
        currentY += totalsBoxHeight * 2 + 5;

        // Additional Info with border
        doc.setFont('helvetica', 'bold');
        doc.text('Additional Info', margin + 5, currentY + 5);
        doc.setFont('helvetica', 'normal');
        const infoLines = doc.splitTextToSize(formData.additionalInfo, pageWidth - 2 * margin - 10);
        const infoBoxHeight = Math.max(20, infoLines.length * 5 + 10);
        doc.rect(margin, currentY, pageWidth - 2 * margin, infoBoxHeight);
        
        infoLines.forEach((line, i) => {
            doc.text(line, margin + 5, currentY + 10 + (i * 5));
        });
        
        currentY += infoBoxHeight + 5;

        // Footer Section with borders
        const footerHeight = 40;
        doc.rect(margin, currentY, pageWidth - 2 * margin, footerHeight);
        
        // Vertical separator
        doc.line(margin + (pageWidth - 2 * margin) / 2, currentY, margin + (pageWidth - 2 * margin) / 2, currentY + footerHeight);
        
        // Left side - Incoterms and Signatory
        doc.setFont('helvetica', 'bold');
        doc.text('Incoterms® 2020', margin + 5, currentY + 8);
        doc.setFont('helvetica', 'normal');
        doc.text(formData.incoterms, margin + 40, currentY + 8);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Currency', margin + 5, currentY + 16);
        doc.setFont('helvetica', 'normal');
        doc.text(formData.selectedCurrency, margin + 40, currentY + 16);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Signatory Company', margin + 5, currentY + 24);
        doc.setFont('helvetica', 'normal');
        doc.text(formData.signatoryCompany, margin + 50, currentY + 24);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Name of Authorized Signatory', margin + 5, currentY + 32);
        doc.setFont('helvetica', 'normal');
        doc.text(formData.nameOfAuthorizedSignatory, margin + 70, currentY + 32);
        
        // Right side - Bank Details and Signature
        doc.setFont('helvetica', 'bold');
        doc.text('Bank Details', margin + (pageWidth - 2 * margin) / 2 + 5, currentY + 8);
        doc.setFont('helvetica', 'normal');
        const bankLines = doc.splitTextToSize(formData.bankDetails, (pageWidth - 2 * margin) / 2 - 10);
        bankLines.forEach((line, i) => {
            doc.text(line, margin + (pageWidth - 2 * margin) / 2 + 5, currentY + 16 + (i * 5));
        });
        
        // Signature area
        doc.setFont('helvetica', 'bold');
        doc.text('Signature', margin + (pageWidth - 2 * margin) / 2 + 5, currentY + 32);
        doc.line(margin + (pageWidth - 2 * margin) / 2 + 40, currentY + 32, margin + (pageWidth - 2 * margin) / 2 + 100, currentY + 32);
        
        // Add signature image if uploaded
        if (formData.signatureImageBase64) {
            try {
                const img = new Image();
                img.src = formData.signatureImageBase64;

                await new Promise((resolve, reject) => {
                    img.onload = () => resolve();
                    img.onerror = (error) => reject(new Error('Failed to load signature image.'));
                });

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
                doc.addImage(formData.signatureImageBase64, imgFormat, margin + (pageWidth - 2 * margin) / 2 + 45, currentY + 25, width, height);
            } catch (error) {
                console.error("Error adding signature image:", error);
            }
        }

        doc.save(`Proforma_Invoice_${formData.invoiceNumber || 'New'}.pdf`);
        showMessage('PDF generated successfully!', 'success');
    } catch (error) {
        console.error("Error during PDF generation:", error);
        showMessage('Failed to generate PDF. Please try again or check console for details.', 'error');
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.invoiceNumber || !formData.issueDate || !formData.sellerName || !formData.buyerName || items.length === 0 || items.some(item => !item.description || item.unitQuantity <= 0 || item.price <= 0)) {
            showMessage('Please fill in all required fields and ensure items have descriptions, quantity > 0, and price > 0.', 'error');
            return;
        }

        await generatePDF();
    };

    return (
        <div className="proforma-invoice-container">
            <MessageBox message={message} />

            <div className="form-wrapper">
                <div className="header">
                    <h1>Proforma Invoice</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Invoice Details */}
                    <div className="form-section invoice-details">
                        <div className="form-group">
                            <label htmlFor="invoiceNumber">Invoice Number:</label>
                            <input type="text" id="invoiceNumber" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="issueDate">Issue Date:</label>
                            <input type="date" id="issueDate" name="issueDate" value={formData.issueDate} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="buyerReference">Buyer Reference:</label>
                            <input type="text" id="buyerReference" name="buyerReference" value={formData.buyerReference} onChange={handleInputChange} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="dueDate">Due Date:</label>
                            <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleInputChange} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="deliveryDate">Delivery Date:</label>
                            <input type="date" id="deliveryDate" name="deliveryDate" value={formData.deliveryDate} onChange={handleInputChange} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="currency">Currency:</label>
                            <select id="currency" name="selectedCurrency" value={formData.selectedCurrency} onChange={handleInputChange} className="form-control" required>
                                <option value="">Select...</option>
                                {currencyOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Seller and Buyer Details */}
                    <div className="form-section seller-buyer-details">
                        <div className="seller-details">
                            <h3>Seller</h3>
                            <div className="form-group">
                                <label htmlFor="sellerName">Name:</label>
                                <input type="text" id="sellerName" name="sellerName" value={formData.sellerName} onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="sellerAddress">Address:</label>
                                <textarea id="sellerAddress" name="sellerAddress" value={formData.sellerAddress} onChange={handleInputChange} rows="3"></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="sellerPhone">Phone:</label>
                                <input type="tel" id="sellerPhone" name="sellerPhone" value={formData.sellerPhone} onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="sellerEmail">Email:</label>
                                <input type="email" id="sellerEmail" name="sellerEmail" value={formData.sellerEmail} onChange={handleInputChange}/>
                            </div>
                        </div>

                        <div className="buyer-details">
                            <h3>Buyer</h3>
                            <div className="form-group">
                                <label htmlFor="buyerName">Name:</label>
                                <input type="text" id="buyerName" name="buyerName" value={formData.buyerName} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="buyerAddress">Address:</label>
                                <textarea id="buyerAddress" name="buyerAddress" value={formData.buyerAddress} onChange={handleInputChange} required rows="3"></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="buyerPhone">Phone:</label>
                                <input type="tel" id="buyerPhone" name="buyerPhone" value={formData.buyerPhone} onChange={handleInputChange} required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="buyerEmail">Email:</label>
                                <input type="email" id="buyerEmail" name="buyerEmail" value={formData.buyerEmail} onChange={handleInputChange}/>
                            </div>
                        </div>
                    </div>

                    {/* Shipment and Payment */}
                    <div className="form-section shipment-payment">
                        <h3>Shipment & Payment Details</h3>
                        <div className="form-group">
                            <label htmlFor="methodOfDispatch">Method of Dispatch:</label>
                            <select id="methodOfDispatch" name="methodOfDispatch" value={formData.methodOfDispatch} onChange={handleInputChange} className="form-control" required>
                                <option value="">Select...</option>
                                {dispatchOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="typeOfShipment">Type of Shipment:</label>
                            <select id="typeOfShipment" name="typeOfShipment" value={formData.typeOfShipment} onChange={handleInputChange} className="form-control" required>
                                <option value="">Select...</option>
                                {shipmentOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="termsOfPayment">Terms / Method of Payment:</label>
                            <select id="termsOfPayment" name="termsOfPayment" value={formData.termsOfPayment} onChange={handleInputChange} className="form-control" required>
                                <option value="">Select...</option>
                                {paymentTermsOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="portOfLoading">Port of Loading:</label>
                            <input type="text" id="portOfLoading" name="portOfLoading" value={formData.portOfLoading} onChange={handleInputChange} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="portOfDischarge">Port of Discharge:</label>
                            <input type="text" id="portOfDischarge" name="portOfDischarge" value={formData.portOfDischarge} onChange={handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="incoterms">Incoterms 2020:</label>
                            <select id="incoterms" name="incoterms" value={formData.incoterms} onChange={handleInputChange} className="form-control">
                                {incotermsOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="form-section line-items">
                        <h3>Description of Goods</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product Code</th>
                                    <th>Description</th>
                                    <th>Unit Quantity</th>
                                    <th>Unit Type</th>
                                    <th>Price</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id}>
                                        <td><input type="text" value={item.productCode} onChange={(e) => handleItemChange(item.id, 'productCode', e.target.value)} /></td>
                                        <td><textarea value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} rows="1"></textarea></td>
                                        <td><input type="number" value={item.unitQuantity} onChange={(e) => handleItemChange(item.id, 'unitQuantity', e.target.value)} min="0" /></td>
                                        <td>
                                            <select value={item.unitType} onChange={(e) => handleItemChange(item.id, 'unitType', e.target.value)}>
                                                <option value="">Select...</option>
                                                {unitTypeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                                            </select>
                                        </td>
                                        <td><input type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', e.target.value)} min="0" step="0.01" /></td>
                                        <td>{item.amount.toFixed(2)}</td>
                                        <td>
                                            <button type="button" onClick={() => removeItemRow(item.id)} className="remove-item-btn">Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={addItemRow} className="add-item-btn">Add Item</button>
                    </div>

                    {/* Totals Section */}
                    <div className="form-section totals-section">
                        <div className="total-row">
                            <span>Total This Page:</span>
                            <span>{formData.selectedCurrency} {totals.totalThisPage.toFixed(2)}</span>
                        </div>
                        <div className="total-row consignment-total">
                            <span>Grand Total:</span>
                            <span>{formData.selectedCurrency} {totals.consignmentTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="form-section additional-info">
                        <h3>Additional Info</h3>
                        <textarea id="additionalInfo" name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} rows="4"></textarea>
                    </div>

                    {/* Bank Details */}
                    <div className="form-section bank-details">
                        <h3>Bank Details</h3>
                        <textarea id="bankDetails" name="bankDetails" value={formData.bankDetails} onChange={handleInputChange} rows="4" placeholder="Bank Name:&#10;Account No:&#10;SWIFT Code:&#10;Branch:"></textarea>
                    </div>

                    {/* Signatory */}
                    <div className="form-section signatory-section">
                        <h3>Signatory</h3>
                        <div className="form-group">
                            <label htmlFor="signatoryCompany">Signatory Company:</label>
                            <input type="text" id="signatoryCompany" name="signatoryCompany" value={formData.signatoryCompany} onChange={handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="nameOfAuthorizedSignatory">Name of Authorized Signatory:</label>
                            <input type="text" id="nameOfAuthorizedSignatory" name="nameOfAuthorizedSignatory" value={formData.nameOfAuthorizedSignatory} onChange={handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="signatureImageUpload">Upload Signature/Stamp:</label>
                            <input type="file" id="signatureImageUpload" accept="image/*" onChange={handleSignatureImageUpload} required/>
                            {formData.signatureImageBase64 && (
                                <img src={formData.signatureImageBase64} alt="Signature Preview" style={{ maxWidth: '100px', maxHeight: '50px', border: '1px solid #ccc', marginTop: '5px' }} />
                            )}
                        </div>
                    </div>

                    <button type="submit" className="generate-pdf-btn">Generate Proforma Invoice PDF</button>
                </form>
            </div>
        </div>
    );
};

export default ProformaInvoiceForm;