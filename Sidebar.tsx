import React from 'react';
import { InvoiceData, LineItem, BankDetails } from './types';
import { Plus, Trash2, Printer, ChevronDown, ChevronUp, Image as ImageIcon, X, Download, EyeOff, Layout } from 'lucide-react';

interface SidebarProps {
  data: InvoiceData;
  setData: (data: InvoiceData) => void;
  onAddLineItem: () => void;
  onRemoveLineItem: (id: string) => void;
  onUpdateLineItem: (id: string, updates: Partial<LineItem>) => void;
  onPrint: () => void;
  onDownload: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-xs font-bold text-black uppercase tracking-widest">{title}</h2>
        {isOpen ? <ChevronUp size={14} className="text-black" /> : <ChevronDown size={14} className="text-black" />}
      </button>
      {isOpen && <div className="p-4 pt-0 space-y-4">{children}</div>}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ data, setData, onAddLineItem, onRemoveLineItem, onUpdateLineItem, onPrint, onDownload }) => {
  const updateField = (field: keyof InvoiceData, value: any) => {
    setData({ ...data, [field]: value });
  };

  const updateBankField = (field: keyof BankDetails, value: string) => {
    setData({
      ...data,
      bankDetails: { ...data.bankDetails, [field]: value }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('headerImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full md:w-80 bg-white border-r no-print flex flex-col h-screen shadow-xl z-50">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-black">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 w-7 h-7 rounded-sm flex items-center justify-center">
            <span className="text-white font-black text-[10px]">ETC</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">Invoice Editor</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Section title="Page Settings">
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-black uppercase mb-1 block">Paper Size</label>
              <div className="grid grid-cols-2 gap-2">
                {['A4', 'Letter'].map((size) => (
                  <button
                    key={size}
                    onClick={() => updateField('pageSize', size)}
                    className={`py-2 px-3 text-xs font-bold border rounded-md transition-all ${
                      data.pageSize === size 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-gray-400 border-gray-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Header Visibility">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors">
              <input 
                type="checkbox"
                checked={data.hideHeader}
                onChange={e => updateField('hideHeader', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-[10px] font-bold text-black uppercase flex items-center gap-2">
                <EyeOff size={14} className="text-gray-400" />
                Hide Branding (Logo + Bars)
              </span>
            </label>

            {!data.hideHeader && (
              <div className="grid grid-cols-1 gap-2 pl-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={data.hideBlackBar}
                    onChange={e => updateField('hideBlackBar', e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded"
                  />
                  <span className="text-[10px] font-bold text-gray-500 uppercase group-hover:text-black">Hide Black Bar</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={data.hideLogo}
                    onChange={e => updateField('hideLogo', e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded"
                  />
                  <span className="text-[10px] font-bold text-gray-500 uppercase group-hover:text-black">Hide ETC Logo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={data.hideRedBar}
                    onChange={e => updateField('hideRedBar', e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded"
                  />
                  <span className="text-[10px] font-bold text-gray-500 uppercase group-hover:text-black">Hide Red Bar</span>
                </label>
              </div>
            )}
            
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors">
              <input 
                type="checkbox"
                checked={data.hideWarehouseHeader}
                onChange={e => updateField('hideWarehouseHeader', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-[10px] font-bold text-black uppercase">Hide Warehouse Text</span>
            </label>
          </div>
        </Section>

        <Section title="Header Overlay Image">
          <div className="space-y-4">
            {!data.headerImage ? (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-red-200 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Upload Image</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="relative group">
                  <img src={data.headerImage} alt="Header" className="w-full h-auto rounded border" />
                  <button 
                    onClick={() => updateField('headerImage', undefined)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-black uppercase flex justify-between">
                      Width (px) <span>{data.headerImageWidth}px</span>
                    </label>
                    <input type="range" min="50" max="800" step="5" value={data.headerImageWidth} onChange={e => updateField('headerImageWidth', parseInt(e.target.value))} className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer accent-red-600" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-black uppercase block mb-1">Pos X</label>
                      <input type="number" value={data.headerImageX} onChange={e => updateField('headerImageX', parseInt(e.target.value) || 0)} className="w-full text-xs p-1 border rounded bg-gray-50" />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-black uppercase block mb-1">Pos Y</label>
                      <input type="number" value={data.headerImageY} onChange={e => updateField('headerImageY', parseInt(e.target.value) || 0)} className="w-full text-xs p-1 border rounded bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Section>

        <Section title="General Information">
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-black uppercase mb-1 block">Invoice Number</label>
              <input type="text" value={data.invoiceNumber} onChange={e => updateField('invoiceNumber', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-black focus:ring-1 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-black uppercase mb-1 block">Date</label>
              <input type="text" value={data.invoiceDate} onChange={e => updateField('invoiceDate', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-black focus:ring-1 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-black uppercase mb-1 block">Shipment Number</label>
              <input type="text" value={data.shipmentNumber} onChange={e => updateField('shipmentNumber', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-black focus:ring-1 focus:ring-red-500 outline-none" />
            </div>
          </div>
        </Section>

        <Section title="Client Details">
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-black uppercase mb-1 block">Client Name</label>
              <input type="text" value={data.clientName} onChange={e => updateField('clientName', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-black focus:ring-1 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-black uppercase mb-1 block">Phone</label>
              <input type="text" value={data.clientPhone} onChange={e => updateField('clientPhone', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-black focus:ring-1 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-black uppercase mb-1 block">Address</label>
              <textarea value={data.clientAddress} onChange={e => updateField('clientAddress', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-black min-h-[60px] focus:ring-1 focus:ring-red-500 outline-none" />
            </div>
          </div>
        </Section>

        <Section title="Line Items">
          <div className="space-y-4">
            {data.lineItems.map((item, idx) => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-md border border-gray-200 relative group">
                <button onClick={() => onRemoveLineItem(item.id)} className="absolute -top-2 -right-2 p-1 bg-white border border-gray-200 text-black hover:text-red-500 rounded-full shadow-sm transition-colors">
                  <Trash2 size={12} />
                </button>
                <div className="space-y-2">
                  <input className="w-full text-xs font-bold bg-transparent outline-none focus:text-red-600 text-black" value={item.description} onChange={e => onUpdateLineItem(item.id, { description: e.target.value })} />
                  <input className="w-full text-[10px] text-black bg-transparent outline-none" placeholder="Code/HS Code" value={item.code} onChange={e => onUpdateLineItem(item.id, { code: e.target.value })} />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[8px] text-black block uppercase">Qty</label>
                      <input type="number" className="w-full text-xs bg-white border border-gray-200 p-1 rounded text-black" value={item.qty} onChange={e => onUpdateLineItem(item.id, { qty: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div className="flex-1">
                      <label className="text-[8px] text-black block uppercase">Unit</label>
                      <input type="text" className="w-full text-xs bg-white border border-gray-200 p-1 rounded uppercase text-black" value={item.unit} onChange={e => onUpdateLineItem(item.id, { unit: e.target.value })} />
                    </div>
                    <div className="flex-1">
                      <label className="text-[8px] text-black block uppercase">Rate</label>
                      <input type="number" className="w-full text-xs bg-white border border-gray-200 p-1 rounded text-black" value={item.rate} onChange={e => onUpdateLineItem(item.id, { rate: parseFloat(e.target.value) || 0 })} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={onAddLineItem} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-md text-black hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center gap-2 text-xs font-medium">
              <Plus size={14} /> Add Item
            </button>
          </div>
        </Section>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
        <button onClick={onPrint} className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-all active:scale-95 text-xs uppercase tracking-widest">
          <Printer size={16} />
          Print
        </button>
        <button onClick={onDownload} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all active:scale-95 uppercase tracking-widest text-xs">
          <Download size={18} />
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
