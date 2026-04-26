import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { invoiceAPI } from "../api/axiosInstance";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FiPlus,
  FiDownload,
  FiEye,
  FiEdit,
  FiTrash2,
  FiSend,
  FiDollarSign,
  FiFileText,
  FiX,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";

const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-600",
    icon: FiFileText,
  },
  issued: { label: "Issued", color: "bg-blue-100 text-blue-700", icon: FiSend },
  paid: { label: "Paid", color: "bg-green-100 text-green-700", icon: FiCheck },
  overdue: {
    label: "Overdue",
    color: "bg-red-100 text-red-700",
    icon: FiAlertCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-600",
    icon: FiX,
  },
};

const STATUS_OPTIONS = ["draft", "issued", "paid", "overdue", "cancelled"];
const TYPE_OPTIONS = ["invoice", "receipt"];
const PAYMENT_METHODS = [
  { value: "", label: "Select Payment Method" },
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "pos", label: "POS" },
  { value: "ussd", label: "USSD" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "other", label: "Other" },
];

const loadImageAsBase64 = (url) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

const formatCurrency = (value) => {
  const num = parseFloat(value) || 0;
  return `NGN ${num.toLocaleString()}`;
};

const generateInvoicePDF = async (invoice, vendor) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const logoData = await loadImageAsBase64(vendor?.logo);

  doc.setFillColor(37, 200, 102);
  doc.rect(0, 0, pageWidth, 40, "F");

  if (logoData) {
    doc.addImage(logoData, "PNG", 15, 8, 20, 20);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(invoice.type.toUpperCase(), logoData ? 42 : 15, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(vendor?.businessName || "Store", logoData ? 42 : 15, 28);
  if (vendor?.phone) {
    doc.text(`Tel: ${vendor.phone}`, logoData ? 42 : 15, 35);
  }

  doc.setTextColor(26, 26, 46);
  let y = 55;

  const customerName = invoice.customer?.name || "";
  const customerPhone = invoice.customer?.phone || "";
  const customerEmail = invoice.customer?.email || "";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Bill To:", 20, y);
  doc.setFont("helvetica", "normal");
  y += 7;
  doc.setFontSize(10);
  if (customerName) {
    doc.text(customerName, 20, y);
    y += 6;
  }
  if (customerPhone) {
    doc.text(`Phone: ${customerPhone}`, 20, y);
    y += 6;
  }
  if (customerEmail) {
    doc.text(`Email: ${customerEmail}`, 20, y);
    y += 6;
  }
  if (invoice.customer?.address) {
    doc.text(invoice.customer.address, 20, y);
  }

  doc.setFont("helvetica", "bold");
  doc.text("Invoice Details:", 120, 60);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 120, 68);
  doc.text(
    `Date: ${new Date(invoice.issueDate).toLocaleDateString("en-NG")}`,
    120,
    75,
  );
  if (invoice.dueDate) {
    doc.text(
      `Due: ${new Date(invoice.dueDate).toLocaleDateString("en-NG")}`,
      120,
      82,
    );
  }
  doc.text(
    `Status: ${STATUS_CONFIG[invoice.status]?.label || invoice.status}`,
    120,
    89,
  );

  y = 100;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Items:", 20, y);

  autoTable(doc, {
    startY: y + 5,
    head: [["#", "Item Description", "Qty", "Unit Price", "Total"]],
    body: invoice.items.map((item, idx) => [
      idx + 1,
      item.name,
      item.qty,
      `NGN ${(item.unitPrice || 0).toLocaleString()}`,
      `NGN ${(item.total || item.qty * item.unitPrice || 0).toLocaleString()}`,
    ]),
    theme: "striped",
    headStyles: {
      fillColor: [26, 26, 46],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 70 },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 35, halign: "right" },
      4: { cellWidth: 35, halign: "right" },
    },
    margin: { left: 20, right: 20 },
  });

  const finalY = (doc.lastAutoTable?.finalY ?? y + 40) + 12;

  doc.setDrawColor(200, 200, 200);
  doc.line(120, finalY, pageWidth - 15, finalY);

  doc.setFontSize(10);
  doc.text("Subtotal:", 120, finalY + 8);
  doc.text(formatCurrency(invoice.subtotal), pageWidth - 15, finalY + 8, { align: "right" });

  if (invoice.discount > 0) {
    doc.text("Discount:", 120, finalY + 16);
    doc.text("-" + formatCurrency(invoice.discount), pageWidth - 15, finalY + 16, { align: "right" });
  }

  if (invoice.tax > 0) {
    doc.text("Tax:", 120, finalY + 24);
    doc.text(formatCurrency(invoice.tax), pageWidth - 15, finalY + 24, { align: "right" });
  }

  const totalY = finalY + (invoice.discount > 0 || invoice.tax > 0 ? 36 : 28);
  doc.setFillColor(37, 200, 102);
  doc.rect(110, totalY, 80, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL: " + formatCurrency(invoice.totalAmount), 115, totalY + 9);

  if ((invoice.amountPaid ?? 0) > 0) {
    doc.setTextColor(26, 26, 46);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Paid: " + formatCurrency(invoice.amountPaid), 20, totalY + 22);
    doc.text("Balance: " + formatCurrency(invoice.balanceDue), 20, totalY + 30);
  }

  if (invoice.notes) {
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "italic");
    doc.text(`Note: ${invoice.notes}`, 20, totalY + 45);
  }

  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Generated by VendPadi", pageWidth / 2, 280, { align: "center" });

  doc.save(`${invoice.invoiceNumber}.pdf`);
};

const generateReceiptPDF = async (invoice, vendor) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const logoData = await loadImageAsBase64(vendor?.logo);

  doc.setFillColor(245, 166, 35);
  doc.rect(0, 0, pageWidth, 35, "F");

  if (logoData) {
    doc.addImage(logoData, "PNG", 15, 8, 18, 18);
  }

  doc.setTextColor(26, 26, 46);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("RECEIPT", logoData ? 40 : 15, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(vendor?.businessName || "Store", logoData ? 40 : 15, 28);
  doc.setFont("helvetica", "normal");
  if (vendor?.phone) {
    doc.text(`Tel: ${vendor.phone}`, logoData ? 40 : 15, 34);
  }

  doc.line(15, 45, pageWidth - 15, 45);

  const customerName = invoice.customer?.name || "";
  const customerPhone = invoice.customer?.phone || "";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Customer: ${customerName || "Customer"}`, 15, 55);

  let yPos = 63;
  if (customerPhone) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Phone: ${customerPhone}`, 15, yPos);
    yPos += 8;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Receipt #: ${invoice.invoiceNumber}`, 15, yPos);
  yPos += 8;
  doc.text(
    `Date: ${new Date(invoice.issueDate).toLocaleDateString("en-NG")}`,
    15,
    yPos,
  );

  yPos += 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Items Purchased", 15, yPos);

  autoTable(doc, {
    startY: yPos + 5,
    head: [["#", "Item", "Qty", "Amount"]],
    body: invoice.items.map((item, idx) => [
      idx + 1,
      item.name,
      item.qty,
      `NGN ${(item.total || item.qty * item.unitPrice).toLocaleString()}`,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [245, 166, 35],
      textColor: [26, 26, 46],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      1: { cellWidth: 95 },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 48, halign: "right" },
    },
    margin: { left: 15, right: 15 },
  });

  const finalY = (doc.lastAutoTable?.finalY ?? yPos + 40) + 12;

  doc.setDrawColor(200, 200, 200);
  doc.line(100, finalY, pageWidth - 15, finalY);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", 120, finalY + 8);
  doc.text(formatCurrency(invoice.totalAmount), pageWidth - 15, finalY + 8, { align: "right" });

  if (invoice.paymentMethod) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Payment Method: ${invoice.paymentMethod.replace("_", " ")}`,
      15,
      finalY + 20,
    );
    if (invoice.paymentReference) {
      doc.text(`Ref: ${invoice.paymentReference}`, 15, finalY + 28);
    }
  }

  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.text("Thank you for your business!", pageWidth / 2, 275, {
    align: "center",
  });
  doc.text("Generated by VendPadi", pageWidth / 2, 280, { align: "center" });

  doc.save(`${invoice.invoiceNumber}.pdf`);
};

function ManualInvoices() {
  const { vendor } = useSelector((state) => state.auth);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [filter, setFilter] = useState({ type: "", status: "" });
  const [stats, setStats] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState(null);
  const [paymentData, setPaymentData] = useState({ amount: "", paymentMethod: "", paymentReference: "" });

  const [formData, setFormData] = useState({
    type: "invoice",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    items: [{ name: "", qty: 1, unitPrice: 0, discount: 0 }],
    discount: 0,
    tax: 0,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
    terms: "",
    paymentMethod: "",
    paymentReference: "",
  });

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.type) params.type = filter.type;
      if (filter.status) params.status = filter.status;
      const [invoicesRes, statsRes] = await Promise.all([
        invoiceAPI.getAll(params),
        invoiceAPI.getStats(),
      ]);
      setInvoices(invoicesRes.data.invoices);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numberFields = ["discount", "tax"];
    setFormData((prev) => ({
      ...prev,
      [name]: numberFields.includes(name) ? (value === "" ? 0 : value) : value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "qty" || field === "unitPrice" || field === "discount") {
      const qty = Number(newItems[index].qty) || 0;
      const price = Number(newItems[index].unitPrice) || 0;
      const disc = Number(newItems[index].discount) || 0;
      newItems[index].total = qty * price - disc;
    }

    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", qty: 1, unitPrice: 0, discount: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, items: newItems }));
    }
  };

  const calculateTotals = useMemo(() => {
    const sub = formData.items.reduce((sum, item) => {
      const qty = parseFloat(item.qty) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      const disc = parseFloat(item.discount) || 0;
      return sum + (qty * price - disc);
    }, 0);
    const discount = parseFloat(formData.discount) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const total = sub - discount + tax;
    return { subtotal: sub, total };
  }, [formData.items, formData.discount, formData.tax]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = [];
    
    if (!formData.customerName && !formData.customerPhone) {
      errors.push("Add customer name or phone number");
    }
    
    const validItems = formData.items.filter(
      (item) => item.name && parseFloat(item.qty) > 0 && parseFloat(item.unitPrice) > 0,
    );
    if (validItems.length === 0) {
      errors.push("Add at least one item with name, quantity and price");
    }
    
    if (formData.type === "invoice" && !formData.dueDate) {
      errors.push("Invoices should have a due date");
    }
    
    validItems.forEach((item, i) => {
      if (parseFloat(item.qty) < 1) {
        errors.push(`Item ${i+1}: Quantity must be at least 1`);
      }
      if (parseFloat(item.unitPrice) < 0) {
        errors.push(`Item ${i+1}: Price cannot be negative`);
      }
      if (parseFloat(item.discount || 0) < 0) {
        errors.push(`Item ${i+1}: Discount cannot be negative`);
      }
    });
    
    if (errors.length > 0) {
      errors.forEach(err => toast.error(err));
      return;
    }
    
    if (parseFloat(formData.discount) < 0) {
      toast.error("Discount cannot be negative");
      return;
    }
    
    if (parseFloat(formData.tax) < 0) {
      toast.error("Tax cannot be negative");
      return;
    }

    if (validItems.length < formData.items.length) {
      const emptyItems = formData.items.filter(
        (item) => !item.name || !item.qty || !item.unitPrice,
      );
      if (emptyItems.length > 0) {
        toast.error("Remove empty items before submitting");
        return;
      }
    }

    const payload = {
      type: formData.type,
      customer: {
        name: formData.customerName,
        phone: formData.customerPhone,
        email: formData.customerEmail,
        address: formData.customerAddress,
      },
      items: validItems,
      discount: formData.discount || 0,
      tax: formData.tax || 0,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate || null,
      notes: formData.notes,
      terms: formData.terms,
      paymentMethod: formData.paymentMethod,
      paymentReference: formData.paymentReference,
    };

    try {
      if (editingInvoice) {
        await invoiceAPI.update(editingInvoice._id, payload);
        toast.success("Invoice updated");
      } else {
        await invoiceAPI.create(payload);
        toast.success(
          `${formData.type === "invoice" ? "Invoice" : "Receipt"} created`,
        );
      }
      setShowModal(false);
      setEditingInvoice(null);
      resetForm();
      fetchInvoices();
    } catch (error) {
      if (error.response?.status === 403) {
        const { message, requiredPlan, trialActive } = error.response.data;
        toast.error(
          <div>
            <div>{message}</div>
            {trialActive && <div className="text-sm mt-1">Trial period active</div>}
          </div>,
          { duration: 5000 }
        );
      } else if (error.response?.status === 400 && error.response?.data?.message) {
        let msg = error.response.data.message;
        if (msg.includes("tax")) msg = "Tax cannot be negative";
        if (msg.includes("discount")) msg = "Discount cannot be negative";
        if (msg.includes("qty")) msg = "Quantity must be at least 1";
        if (msg.includes("unitPrice")) msg = "Price must be greater than 0";
        if (msg.includes("validation failed")) msg = "Please check your form values: " + msg;
        toast.error(msg);
      } else if (error.response?.status === 400) {
        const msgs = [];
        if (error.response.data?.errors) {
          Object.values(error.response.data.errors).forEach(err => {
            msgs.push(err.message);
          });
        }
        if (msgs.length > 0) {
          msgs.forEach(m => toast.error(m));
        } else {
          toast.error("Please check your form values");
        }
      } else {
        toast.error(error.response?.data?.message || "Failed to save");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: "invoice",
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      customerAddress: "",
      items: [{ name: "", qty: 1, unitPrice: 0, discount: 0 }],
      discount: 0,
      tax: 0,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      notes: "",
      terms: "",
      paymentMethod: "",
      paymentReference: "",
    });
  };

  const openEditModal = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      type: invoice.type,
      customerName: invoice.customer?.name || "",
      customerPhone: invoice.customer?.phone || "",
      customerEmail: invoice.customer?.email || "",
      customerAddress: invoice.customer?.address || "",
      items:
        invoice.items.length > 0
          ? invoice.items
          : [{ name: "", qty: 1, unitPrice: 0, discount: 0 }],
      discount: invoice.discount || 0,
      tax: invoice.tax || 0,
      issueDate:
        invoice.issueDate?.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      dueDate: invoice.dueDate?.split("T")[0] || "",
      notes: invoice.notes || "",
      terms: invoice.terms || "",
      paymentMethod: invoice.paymentMethod || "",
      paymentReference: invoice.paymentReference || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const invoice = invoices.find(i => i._id === id);
    if (!invoice) return;
    
    let confirmMsg = "Delete this invoice?";
    
    if (invoice.status === "paid") {
      confirmMsg = "This invoice is fully paid. Are you sure you want to delete it?";
    } else if (invoice.amountPaid > 0) {
      confirmMsg = `This invoice has NGN ${invoice.amountPaid.toLocaleString()} paid. Delete anyway?`;
    } else if (invoice.status === "issued") {
      confirmMsg = "This invoice has been issued to the customer. Delete anyway?";
    }
    
    if (!window.confirm(confirmMsg)) return;
    
    try {
      await invoiceAPI.delete(id);
      toast.success("Invoice deleted");
      fetchInvoices();
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Cannot delete this invoice");
      } else {
        toast.error("Failed to delete");
      }
    }
  };

  const handleDownload = (invoice) => {
    if (invoice.type === "receipt") {
      generateReceiptPDF(invoice, vendor);
    } else {
      generateInvoicePDF(invoice, vendor);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await invoiceAPI.update(id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchInvoices();
    } catch (error) {
      toast.error("Failed to update status");
      fetchInvoices();
    }
  };

  const quickMarkPaid = async (id) => {
    const invoice = invoices.find(i => i._id === id);
    if (!invoice) return;
    
    const balance = invoice.balanceDue || 0;
    if (balance > 0) {
      try {
        await invoiceAPI.recordPayment(id, {
          amount: balance,
          paymentMethod: "other",
          paymentReference: "Quick payment"
        });
        toast.success("Marked as paid");
        fetchInvoices();
      } catch (error) {
        toast.error("Failed to record payment");
      }
    } else {
      handleStatusChange(id, "paid");
    }
  };

  const quickIssue = async (id) => {
    handleStatusChange(id, "issued");
  };

  const openPaymentModal = (invoice) => {
    setPaymentInvoice(invoice);
    setPaymentData({
      amount: invoice.balanceDue?.toString() || invoice.totalAmount?.toString() || "",
      paymentMethod: "",
      paymentReference: ""
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await invoiceAPI.recordPayment(paymentInvoice._id, {
        amount: parseFloat(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        paymentReference: paymentData.paymentReference
      });
      toast.success("Payment recorded");
      setShowPaymentModal(false);
      fetchInvoices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to record payment");
    }
  };

  const { subtotal, total } = calculateTotals;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
            >
              <FiArrowLeft /> Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Invoices & Receipts
              </h1>
              <p className="text-gray-500">Create manual invoices and receipts</p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <FiPlus /> New Invoice
          </Link>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm text-gray-500">Total Invoices</div>
              <div className="text-xl font-bold">
                {stats.stats?.reduce((s, x) => s + x.totalCount, 0) || 0}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm text-gray-500">Total Amount</div>
              <div className="text-xl font-bold text-green-600">
                NGN{" "}
                {(
                  stats.stats?.reduce((s, x) => s + x.totalAmount, 0) || 0
                ).toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm text-gray-500">Paid</div>
              <div className="text-xl font-bold text-blue-600">
                NGN{" "}
                {(
                  stats.stats?.reduce((s, x) => s + x.totalPaid, 0) || 0
                ).toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm text-gray-500">Overdue</div>
              <div className="text-xl font-bold text-red-600">
                {stats.overdueCount || 0}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="border rounded-lg px-3 py-2">
              <option value="">All Types</option>
              <option value="invoice">Invoices</option>
              <option value="receipt">Receipts</option>
            </select>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="border rounded-lg px-3 py-2">
              <option value="">All Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No invoices found
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Invoice #
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Customer
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                      Total
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                      Paid
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                      Due
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            invoice.type === "receipt"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                          {invoice.type === "receipt" ? "Receipt" : "Invoice"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {invoice.customer?.phone ||
                          invoice.customer?.name ||
                          "-"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-right text-green-600">
                        {formatCurrency(invoice.amountPaid)}
                      </td>
                      <td className="px-4 py-3 text-right text-orange-600">
                        {formatCurrency(invoice.balanceDue)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={invoice.status}
                          onChange={(e) => handleStatusChange(invoice._id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${STATUS_CONFIG[invoice.status]?.color}`}
                        >
                          <option value="draft">Draft</option>
                          <option value="issued">Issued</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(invoice.issueDate).toLocaleDateString(
                          "en-NG",
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => handleDownload(invoice)}
                            className="p-1.5 text-gray-500 hover:text-green-600"
                            title="Download PDF">
                            <FiDownload size={16} />
                          </button>
                          {invoice.status === "draft" && (
                            <button
                              onClick={() => quickIssue(invoice._id)}
                              className="p-1.5 text-blue-600 hover:text-blue-800"
                              title="Issue Invoice">
                              <FiSend size={16} />
                            </button>
                          )}
                          {invoice.balanceDue > 0 && invoice.status !== "paid" && (
                            <button
                              onClick={() => openPaymentModal(invoice)}
                              className="p-1.5 text-orange-600 hover:text-orange-800"
                              title="Record Payment">
                              <FiDollarSign size={16} />
                            </button>
                          )}
                          {invoice.balanceDue > 0 && (
                            <button
                              onClick={() => quickMarkPaid(invoice._id)}
                              className="p-1.5 text-green-600 hover:text-green-800"
                              title="Mark Fully Paid">
                              <FiCheck size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(invoice._id)}
                            className="p-1.5 text-red-500 hover:text-red-700"
                            title="Delete Invoice">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingInvoice ? "Edit" : "Create"}{" "}
                {formData.type === "invoice" ? "Invoice" : "Receipt"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingInvoice(null);
                }}
                className="text-gray-500">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    disabled={!!editingInvoice}>
                    {TYPE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t === "invoice" ? "Invoice" : "Receipt"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name <span className="text-gray-400">(or leave empty)</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Required for WhatsApp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date <span className="text-gray-400">(invoices only)</span>
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, "name", e.target.value)
                        }
                        className="flex-1 border rounded-lg px-3 py-2"
                        placeholder="e.g. Laptop HP"
                      />
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          handleItemChange(index, "qty", e.target.value)
                        }
                        className="w-20 border rounded-lg px-3 py-2"
                        placeholder="1"
                        min="1"
                      />
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(index, "unitPrice", e.target.value)
                        }
                        className="w-28 border rounded-lg px-3 py-2"
                        placeholder="0"
                      />
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          handleItemChange(index, "discount", e.target.value)
                        }
                        className="w-24 border rounded-lg px-3 py-2"
                        placeholder="0"
                        min="0"
                      />
                      <div className="w-24 py-2 text-sm text-gray-600">
                        NGN{" "}
                        {(
                          (Number(item.qty) || 0) *
                            (Number(item.unitPrice) || 0) -
                          (Number(item.discount) || 0)
                        ).toLocaleString()}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                        disabled={formData.items.length === 1}>
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium">
                  + Add Item
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Discount
</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax
                  </label>
                  <input
                    type="number"
                    name="tax"
                    value={formData.tax}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax
                  </label>
                  <input
                    type="number"
                    name="tax"
                    value={formData.tax}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount
                  </label>
                  <div className="w-full border rounded-lg px-3 py-2 bg-gray-100 font-bold text-green-600">
                    NGN {total.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms
                  </label>
                  <textarea
                    name="terms"
                    value={formData.terms}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    rows={2}
                  />
                </div>
              </div>

              {editingInvoice && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2">
                      {PAYMENT_METHODS.map((pm) => (
                        <option key={pm.value} value={pm.value}>
                          {pm.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Reference
                    </label>
                    <input
                      type="text"
                      name="paymentReference"
                      value={formData.paymentReference}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingInvoice(null);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  {editingInvoice ? "Update" : "Create"}{" "}
                  {formData.type === "invoice" ? "Invoice" : "Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Record Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-500">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500">Invoice</p>
                <p className="font-medium">{paymentInvoice?.invoiceNumber}</p>
                <p className="text-green-600 font-bold">{formatCurrency(paymentInvoice?.totalAmount)}</p>
                <p className="text-sm text-gray-500">Balance: {formatCurrency(paymentInvoice?.balanceDue)}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter amount"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm.value} value={pm.value}>{pm.label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference (Optional)</label>
                <input
                  type="text"
                  name="paymentReference"
                  value={paymentData.paymentReference}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, paymentReference: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Transaction reference"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManualInvoices;
