export type CaseStatus = 'Draft' | 'Active' | 'Service Scheduled' | 'In Transit' | 'Completed' | 'Archived';

export type ServiceType = 
  | 'Traditional Funeral' 
  | 'Direct Cremation' 
  | 'Memorial Service' 
  | 'Graveside Burial' 
  | 'Celebration of Life' 
  | 'Repatriation';

export interface Case {
  id: string;
  caseNumber: string;
  deceasedName: string;
  dateOfBirth: string;
  dateOfDeath: string;
  placeOfDeath: string;
  primaryContactId: string;
  primaryContactName: string;
  relationship: string;
  phone: string;
  email: string;
  serviceType: ServiceType;
  funeralDate: string;
  funeralTime: string;
  location: string;
  assignedStaffId: string;
  assignedStaffName: string;
  status: CaseStatus;
  estimatedCost: number;
  paidAmount: number;
  notesCount: number;
  docsCount: number;
  createdAt: string;
}

export interface CaseTimelineEvent {
  id: string;
  caseId: string;
  title: string;
  description: string;
  timestamp: string;
  author: string;
  type: 'case_created' | 'document_uploaded' | 'meeting_scheduled' | 'invoice_generated' | 'funeral_completed' | 'note_added' | 'status_changed';
}

export interface CaseTask {
  id: string;
  caseId?: string;
  caseName?: string;
  title: string;
  assignedStaffName: string;
  dueDate: string;
  dueTime: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Completed';
}

export interface CaseDocument {
  id: string;
  caseId?: string;
  caseName?: string;
  name: string;
  category: 'Death Certificates' | 'Contracts' | 'Invoices' | 'Photos' | 'IDs' | 'Other Files';
  size: string;
  uploadDate: string;
  fileType: string;
  url?: string;
}

export interface CaseNote {
  id: string;
  caseId: string;
  author: string;
  avatar: string;
  date: string;
  time: string;
  text: string;
}

export interface Family {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  linkedCases: { caseId: string; deceasedName: string; caseNumber: string }[];
  lastActivity: string;
  notes: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  caseId?: string;
  caseNumber?: string;
  deceasedName?: string;
  startDate: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  type: 'Funeral' | 'Viewing' | 'Burial' | 'Cremation' | 'Family Meeting';
  location: string;
  staffName: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  familyId: string;
  familyName: string;
  caseId?: string;
  caseNumber?: string;
  deceasedName?: string;
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  issueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Vehicle {
  id: string;
  name: string;
  registrationNumber: string;
  type: 'Hearse' | 'Limousine' | 'Transfer Van' | 'First Call Vehicle';
  photo: string;
  driverName: string;
  status: 'Available' | 'In Service' | 'Maintenance';
  nextMaintenanceDate: string;
  mileage: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Caskets' | 'Urns' | 'Flowers' | 'Stationery' | 'Embalming Supplies';
  stock: number;
  lowStockAlert: number;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  location: string;
}

export interface StaffMember {
  id: string;
  name: string;
  position: string;
  role: 'Owner' | 'Manager' | 'Funeral Director' | 'Driver' | 'Office Staff';
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Off Duty';
  photo: string;
  activeCasesCount: number;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  logoText: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  currency: string;
  timeZone: string;
  primaryColor: string;
  taxRate: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  linkModule?: string;
  linkId?: string;
}

export interface Toast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}
