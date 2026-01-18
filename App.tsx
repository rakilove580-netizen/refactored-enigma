import React, { useState } from 'react';
import { InvoiceData, LineItem } from './types';
import InvoicePreview from './components/InvoicePreview';
import Sidebar from './Sidebar';

const INITIAL_DATA: InvoiceData = {
  invoiceNumber: 'SK25DEC606',
  invoiceDate: '20 Dec 2025',
  shipmentNumber: '14-11 GZ305',
  clientName: 'SHUVO',
  clientPhone: '8801797714771',
  clientAddress: 'Borhanibag, Keraniganj.',
  warehouseAddressHeader: '(Warehouse Address)\nHouse: 16, Road: 19\nNikunja -2, Khilkhet-1229, Bangladesh',
  corporateOffice: 'H# 1357,Flat-lB, Ave.# 10, Mirpur DOHS, Dhaka-1216',
  warehouseAddressFooter: 'H #16, R #19,Nikunja-2,Khelkhet-1229 Dhaka-1216.',
  lineItems: [
    {
      id: '1',
      sl: '1',
      description: 'Door and window decals (door and window accessories)',
      code: '0265074 4450',
      qty: 96.80,
      unit: 'KG',
      rate: 740,
      amount: 71632
    },
    {
      id: '2',
      sl: '2',
      description: 'Door Handle',
      code: '800174126109 4065',
      qty: 4.05,
      unit: 'KG',
      rate: 740,
      amount: 2997
    }
  ],
  paymentOptions: [
    'Cash on Delivery (pick-up) from Dhaka Warehouse'
  ],
  bankDetails: {
    bankName: 'The City Bank PLC',
    accountName: 'ETC GLOBAL',
    accountNumber: '1223111736001',
    branch: 'Pallabi Branch',
    routingNumber: '225263585'
  },
  phone1: '+88 01783 335 343',
  phone2: '+88 01792 922 333',
  website: 'www.etcglobal.store',
  email: 'etcglobal.store@gmail.com',
  pageSize: 'A4',
  headerImageWidth: 300,
  headerImageX: 0,
  headerImageY: 0,
  hideBlackBar: false,
  hideRedBar: false,
  hideLogo: false,
  hideWarehouseHeader: false,
  hideHeader: false
};

const App: React.FC = () => {
  const [data, setData] = useState<InvoiceData>(INITIAL_DATA);

  const updateLineItem = (id: string, updates: Partial<LineItem>) => {
    setData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const newItem = { ...item, ...updates };
          newItem.amount = newItem.qty * newItem.rate;
          return newItem;
        }
        return item;
      })
    }));
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      sl: (data.lineItems.length + 1).toString(),
      description: 'New Item Name',
      code: '',
      qty: 0,
      unit: 'PCS',
      rate: 0,
      amount: 0
    };
    setData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }));
  };

  const removeLineItem = (id: string) => {
    if (data.lineItems.length <= 1) return;
    setData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }));
  };

  const printInvoice = () => {
    window.print();
  };

  const downloadInvoice = () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;
    
    // Create a temporary clone to ensure zero side effects from preview styles
    const opt = {
      margin: 0,
      filename: `ETC_Invoice_${data.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { 
        unit: 'mm', 
        format: data.pageSize.toLowerCase(), 
        orientation: 'portrait',
        compress: true
      }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#e5e7eb]">
      <Sidebar 
        data={data} 
        setData={setData} 
        onAddLineItem={addLineItem}
        onRemoveLineItem={removeLineItem}
        onUpdateLineItem={updateLineItem}
        onPrint={printInvoice}
        onDownload={downloadInvoice}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-12 flex flex-col items-center scrollbar-hide">
        <div className="mb-4 text-xs font-bold text-gray-500 uppercase tracking-widest no-print">
          Previewing: {data.pageSize} Layout
        </div>
        <div className="print-container shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white border border-gray-300">
          <InvoicePreview data={data} updateData={setData} />
        </div>
      </div>
    </div>
  );
};

export default App;
