export interface LineItem {
  id: string;
  sl: string;
  description: string;
  code: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  routingNumber: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  shipmentNumber: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  warehouseAddressHeader: string;
  corporateOffice: string;
  warehouseAddressFooter: string;
  lineItems: LineItem[];
  paymentOptions: string[];
  bankDetails: BankDetails;
  phone1: string;
  phone2: string;
  website: string;
  email: string;
  // Page Configuration
  pageSize: 'A4' | 'Letter';
  // Header Customization
  headerImage?: string;
  headerImageWidth: number;
  headerImageX: number;
  headerImageY: number;
  // Visibility Toggles
  hideBlackBar: boolean;
  hideRedBar: boolean;
  hideLogo: boolean;
  hideWarehouseHeader: boolean;
  hideHeader: boolean;
}
