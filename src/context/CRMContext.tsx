import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Case,
  CaseTimelineEvent,
  CaseTask,
  CaseDocument,
  CaseNote,
  Family,
  CalendarEvent,
  Invoice,
  Vehicle,
  InventoryItem,
  StaffMember,
  CompanySettings,
  AppNotification,
  Toast
} from '../types/crm';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
}

interface CRMContextType {
  // Navigation & View
  currentModule: string;
  setCurrentModule: (module: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Active Detail Views
  activeCaseId: string | null;
  setActiveCaseId: (id: string | null) => void;
  drawerItem: { type: 'case' | 'family' | 'invoice' | 'vehicle' | 'staff'; id: string } | null;
  setDrawerItem: (item: { type: 'case' | 'family' | 'invoice' | 'vehicle' | 'staff'; id: string } | null) => void;
  
  // Global Search & Create Modal
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCreateCaseModalOpen: boolean;
  setIsCreateCaseModalOpen: (open: boolean) => void;

  // Confirm Dialog & Toast System
  confirmDialog: ConfirmDialogState | null;
  openConfirmDialog: (config: Omit<ConfirmDialogState, 'isOpen'>) => void;
  closeConfirmDialog: () => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Notifications Feed
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Cases CRUD
  cases: Case[];
  addCase: (newCase: Omit<Case, 'id' | 'caseNumber' | 'createdAt' | 'notesCount' | 'docsCount'>) => void;
  updateCase: (id: string, updatedData: Partial<Case>) => void;
  deleteCase: (id: string) => void;
  archiveCase: (id: string) => void;
  duplicateCase: (id: string) => void;
  updateCaseStatus: (caseId: string, status: Case['status']) => void;

  // Timeline Events
  timelineEvents: CaseTimelineEvent[];
  addTimelineEvent: (event: Omit<CaseTimelineEvent, 'id' | 'timestamp'>) => void;

  // Tasks CRUD
  tasks: CaseTask[];
  addTask: (task: Omit<CaseTask, 'id'>) => void;
  updateTask: (id: string, updatedData: Partial<CaseTask>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  moveTaskStatus: (taskId: string, newStatus: CaseTask['status']) => void;

  // Documents CRUD
  documents: CaseDocument[];
  addDocument: (doc: Omit<CaseDocument, 'id'>) => void;
  renameDocument: (id: string, newName: string) => void;
  deleteDocument: (docId: string) => void;

  // Notes CRUD
  notes: CaseNote[];
  addNote: (caseId: string, text: string, author?: string) => void;
  deleteNote: (id: string) => void;

  // Families CRUD
  families: Family[];
  addFamily: (family: Omit<Family, 'id' | 'linkedCases' | 'lastActivity'>) => void;
  updateFamily: (id: string, updatedData: Partial<Family>) => void;
  deleteFamily: (id: string) => void;

  // Calendar CRUD
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updatedData: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  // Invoices CRUD
  invoices: Invoice[];
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  updateInvoice: (id: string, updatedData: Partial<Invoice>) => void;
  markInvoiceStatus: (id: string, status: Invoice['status']) => void;
  deleteInvoice: (id: string) => void;

  // Vehicles CRUD
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updatedData: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  // Inventory CRUD
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updatedData: Partial<InventoryItem>) => void;
  adjustStock: (id: string, delta: number) => void;
  deleteInventoryItem: (id: string) => void;

  // Staff CRUD
  staff: StaffMember[];
  addStaff: (member: Omit<StaffMember, 'id' | 'activeCasesCount'>) => void;
  updateStaff: (id: string, updatedData: Partial<StaffMember>) => void;
  toggleStaffStatus: (id: string) => void;
  deleteStaff: (id: string) => void;

  // Settings
  settings: CompanySettings;
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const INITIAL_CASES: Case[] = [
  {
    id: 'case-101',
    caseNumber: 'FHC-2026-0841',
    deceasedName: 'Eleanor Vance Sterling',
    dateOfBirth: '1942-03-14',
    dateOfDeath: '2026-07-18',
    placeOfDeath: 'St. Jude Memorial Hospital, Seattle',
    primaryContactId: 'fam-1',
    primaryContactName: 'Arthur Sterling',
    relationship: 'Son',
    phone: '(206) 555-0192',
    email: 'arthur.sterling@example.com',
    serviceType: 'Traditional Funeral',
    funeralDate: '2026-07-23',
    funeralTime: '10:30 AM',
    location: 'Main Chapel - Grace Memorial',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Marcus Vance',
    status: 'Service Scheduled',
    estimatedCost: 8450,
    paidAmount: 5000,
    notesCount: 2,
    docsCount: 3,
    createdAt: '2026-07-18'
  },
  {
    id: 'case-102',
    caseNumber: 'FHC-2026-0842',
    deceasedName: 'Robert James Harrison',
    dateOfBirth: '1955-11-20',
    dateOfDeath: '2026-07-19',
    placeOfDeath: 'Private Residence, Bellevue',
    primaryContactId: 'fam-2',
    primaryContactName: 'Margaret Harrison',
    relationship: 'Spouse',
    phone: '(425) 555-0144',
    email: 'm.harrison@example.com',
    serviceType: 'Direct Cremation',
    funeralDate: '2026-07-24',
    funeralTime: '02:00 PM',
    location: 'Elysium Crematory Suite',
    assignedStaffId: 'staff-2',
    assignedStaffName: 'Elena Rostova',
    status: 'Active',
    estimatedCost: 3200,
    paidAmount: 3200,
    notesCount: 1,
    docsCount: 1,
    createdAt: '2026-07-19'
  },
  {
    id: 'case-103',
    caseNumber: 'FHC-2026-0843',
    deceasedName: 'Harold Montgomery',
    dateOfBirth: '1938-06-05',
    dateOfDeath: '2026-07-20',
    placeOfDeath: 'Evergreen Hospice Center',
    primaryContactId: 'fam-3',
    primaryContactName: 'Clara Montgomery',
    relationship: 'Daughter',
    phone: '(206) 555-0873',
    email: 'clara.m@example.com',
    serviceType: 'Celebration of Life',
    funeralDate: '2026-07-26',
    funeralTime: '11:00 AM',
    location: 'Oceanview Garden Pavilion',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Marcus Vance',
    status: 'In Transit',
    estimatedCost: 6100,
    paidAmount: 2000,
    notesCount: 0,
    docsCount: 0,
    createdAt: '2026-07-20'
  }
];

const INITIAL_TIMELINE: CaseTimelineEvent[] = [
  {
    id: 'tl-1',
    caseId: 'case-101',
    title: 'First Call & Case Initiated',
    description: 'Received initial call from St. Jude Memorial Hospital. Transfer authorized by Arthur Sterling.',
    timestamp: '2026-07-18 08:30 AM',
    author: 'Marcus Vance',
    type: 'case_created'
  },
  {
    id: 'tl-2',
    caseId: 'case-101',
    title: 'Death Certificate Issued',
    description: 'Official death certificate filed with King County Registrar.',
    timestamp: '2026-07-19 02:15 PM',
    author: 'Elena Rostova',
    type: 'document_uploaded'
  }
];

const INITIAL_TASKS: CaseTask[] = [
  {
    id: 'task-1',
    caseId: 'case-101',
    caseName: 'Eleanor Vance Sterling',
    title: 'Verify Permit for Burial at Pinegrove Park',
    assignedStaffName: 'Elena Rostova',
    dueDate: '2026-07-22',
    dueTime: '11:00 AM',
    priority: 'High',
    status: 'In Progress'
  },
  {
    id: 'task-2',
    caseId: 'case-101',
    caseName: 'Eleanor Vance Sterling',
    title: 'Print Service Memory Programs (150 Copies)',
    assignedStaffName: 'David Mercer',
    dueDate: '2026-07-22',
    dueTime: '03:00 PM',
    priority: 'Medium',
    status: 'To Do'
  },
  {
    id: 'task-3',
    caseId: 'case-102',
    caseName: 'Robert James Harrison',
    title: 'Obtain Coroner Release Certificate',
    assignedStaffName: 'Marcus Vance',
    dueDate: '2026-07-21',
    dueTime: '05:00 PM',
    priority: 'High',
    status: 'Completed'
  }
];

const INITIAL_DOCS: CaseDocument[] = [
  {
    id: 'doc-1',
    caseId: 'case-101',
    caseName: 'Eleanor Vance Sterling',
    name: 'Death_Certificate_Sterling_Official.pdf',
    category: 'Death Certificates',
    size: '1.4 MB',
    uploadDate: '2026-07-19',
    fileType: 'pdf'
  },
  {
    id: 'doc-2',
    caseId: 'case-101',
    caseName: 'Eleanor Vance Sterling',
    name: 'Funeral_Service_Contract_Signed.pdf',
    category: 'Contracts',
    size: '2.8 MB',
    uploadDate: '2026-07-20',
    fileType: 'pdf'
  }
];

const INITIAL_NOTES: CaseNote[] = [
  {
    id: 'note-1',
    caseId: 'case-101',
    author: 'Marcus Vance',
    avatar: 'MV',
    date: '2026-07-20',
    time: '11:30 AM',
    text: 'Family requested specific hymn selections: "Amazing Grace" and "Abide With Me". Organist confirmed.'
  }
];

const INITIAL_FAMILIES: Family[] = [
  {
    id: 'fam-1',
    name: 'Sterling Family',
    relationship: 'Son / Next of Kin',
    phone: '(206) 555-0192',
    email: 'arthur.sterling@example.com',
    address: '1420 Highland Dr, Seattle, WA 98109',
    linkedCases: [
      { caseId: 'case-101', deceasedName: 'Eleanor Vance Sterling', caseNumber: 'FHC-2026-0841' }
    ],
    lastActivity: '2026-07-20 (Invoice Paid)',
    notes: 'Prefers communication via phone calls before 5 PM.'
  },
  {
    id: 'fam-2',
    name: 'Harrison Family',
    relationship: 'Spouse',
    phone: '(425) 555-0144',
    email: 'm.harrison@example.com',
    address: '8820 NE 10th St, Bellevue, WA 98004',
    linkedCases: [
      { caseId: 'case-102', deceasedName: 'Robert James Harrison', caseNumber: 'FHC-2026-0842' }
    ],
    lastActivity: '2026-07-19 (Contract Signed)',
    notes: 'Requested urn delivery directly to private residence.'
  },
  {
    id: 'fam-3',
    name: 'Montgomery Family',
    relationship: 'Daughter',
    phone: '(206) 555-0873',
    email: 'clara.m@example.com',
    address: '3412 Alki Ave SW, Seattle, WA 98116',
    linkedCases: [
      { caseId: 'case-103', deceasedName: 'Harold Montgomery', caseNumber: 'FHC-2026-0843' }
    ],
    lastActivity: '2026-07-20 (Meeting Scheduled)',
    notes: 'Planning outdoor memorial celebration.'
  }
];

const INITIAL_CALENDAR: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Funeral Service: Eleanor Vance Sterling',
    caseId: 'case-101',
    caseNumber: 'FHC-2026-0841',
    deceasedName: 'Eleanor Vance Sterling',
    startDate: '2026-07-23',
    startTime: '10:30 AM',
    endTime: '12:00 PM',
    type: 'Funeral',
    location: 'Main Chapel - Grace Memorial',
    staffName: 'Marcus Vance'
  },
  {
    id: 'cal-2',
    title: 'Family Viewing: Eleanor Vance Sterling',
    caseId: 'case-101',
    caseNumber: 'FHC-2026-0841',
    deceasedName: 'Eleanor Vance Sterling',
    startDate: '2026-07-22',
    startTime: '04:00 PM',
    endTime: '07:00 PM',
    type: 'Viewing',
    location: 'Parlor Suite B',
    staffName: 'Marcus Vance'
  },
  {
    id: 'cal-3',
    title: 'Private Cremation Service: Robert Harrison',
    caseId: 'case-102',
    caseNumber: 'FHC-2026-0842',
    deceasedName: 'Robert James Harrison',
    startDate: '2026-07-24',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    type: 'Cremation',
    location: 'Elysium Crematory Suite',
    staffName: 'Elena Rostova'
  }
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-091',
    familyId: 'fam-1',
    familyName: 'Arthur Sterling',
    caseId: 'case-101',
    caseNumber: 'FHC-2026-0841',
    deceasedName: 'Eleanor Vance Sterling',
    items: [
      { id: 'i1', description: 'Professional Director Services', quantity: 1, unitPrice: 3200, total: 3200 },
      { id: 'i2', description: 'Solid Mahogany Casket', quantity: 1, unitPrice: 3850, total: 3850 },
      { id: 'i3', description: 'Hearse & Limousine Transportation', quantity: 1, unitPrice: 850, total: 850 },
      { id: 'i4', description: 'Custom Print Memorial Programs', quantity: 150, unitPrice: 3.6, total: 540 }
    ],
    totalAmount: 8440,
    paidAmount: 5000,
    dueDate: '2026-07-30',
    issueDate: '2026-07-20',
    status: 'Pending'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-092',
    familyId: 'fam-2',
    familyName: 'Margaret Harrison',
    caseId: 'case-102',
    caseNumber: 'FHC-2026-0842',
    deceasedName: 'Robert James Harrison',
    items: [
      { id: 'i1', description: 'Direct Cremation Complete Package', quantity: 1, unitPrice: 2400, total: 2400 },
      { id: 'i2', description: 'Hand-Carved Walnut Urn', quantity: 1, unitPrice: 800, total: 800 }
    ],
    totalAmount: 3200,
    paidAmount: 3200,
    dueDate: '2026-07-24',
    issueDate: '2026-07-19',
    status: 'Paid'
  }
];

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    name: 'Cadillac XTS Eagle Hearse',
    registrationNumber: 'WA-772-FHC',
    type: 'Hearse',
    photo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
    driverName: 'Thomas Wright',
    status: 'Available',
    nextMaintenanceDate: '2026-08-15',
    mileage: '24,150 miles'
  },
  {
    id: 'veh-2',
    name: 'Lincoln Continental Presidential Limousine',
    registrationNumber: 'WA-773-FHC',
    type: 'Limousine',
    photo: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    driverName: 'David Mercer',
    status: 'In Service',
    nextMaintenanceDate: '2026-08-01',
    mileage: '31,800 miles'
  }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-item-1',
    name: 'Heritage Solid Mahogany Casket',
    category: 'Caskets',
    stock: 4,
    lowStockAlert: 2,
    purchasePrice: 1850,
    sellingPrice: 3850,
    supplier: 'Batesville Casket Co.',
    location: 'Showroom Bay 1'
  },
  {
    id: 'inv-item-2',
    name: 'Classic Brushed Bronze Urn',
    category: 'Urns',
    stock: 1,
    lowStockAlert: 3,
    purchasePrice: 280,
    sellingPrice: 750,
    supplier: 'Matthews Aurora',
    location: 'Urn Vault A'
  }
];

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Marcus Vance',
    position: 'Senior Funeral Director',
    role: 'Funeral Director',
    email: 'm.vance@elysiumfuneral.com',
    phone: '(206) 555-0101',
    status: 'Active',
    photo: 'MV',
    activeCasesCount: 2
  },
  {
    id: 'staff-2',
    name: 'Elena Rostova',
    position: 'Operations Manager & Embalmer',
    role: 'Manager',
    email: 'e.rostova@elysiumfuneral.com',
    phone: '(206) 555-0102',
    status: 'Active',
    photo: 'ER',
    activeCasesCount: 1
  },
  {
    id: 'staff-3',
    name: 'David Mercer',
    position: 'Transport Specialist & Fleet Lead',
    role: 'Driver',
    email: 'd.mercer@elysiumfuneral.com',
    phone: '(206) 555-0103',
    status: 'Active',
    photo: 'DM',
    activeCasesCount: 1
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Deposit Payment Processed',
    message: '$5,000 paid for Eleanor Sterling case invoice #INV-2026-091',
    timestamp: '10 minutes ago',
    read: false,
    type: 'success',
    linkModule: 'Invoices',
    linkId: 'inv-1'
  },
  {
    id: 'notif-2',
    title: 'New Service Scheduled',
    message: 'Traditional Funeral scheduled for Eleanor Vance Sterling on July 23',
    timestamp: '1 hour ago',
    read: false,
    type: 'info',
    linkModule: 'Calendar',
    linkId: 'cal-1'
  }
];

const INITIAL_SETTINGS: CompanySettings = {
  companyName: 'Elysium Funeral Directors & Mortuary',
  tagline: 'Dignified & Compassionate Care Since 1994',
  logoText: 'ELYSIUM',
  address: '1200 Grand View Boulevard, Seattle, WA 98101',
  phone: '(206) 555-0100',
  email: 'care@elysiumfuneral.com',
  website: 'https://elysiumfuneral.com',
  taxId: 'TAX-99482-WA',
  currency: 'USD ($)',
  timeZone: 'America/Los_Angeles (PST)',
  primaryColor: '#2563eb',
  taxRate: 9.8
};

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentModule, setCurrentModule] = useState<string>('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [drawerItem, setDrawerItem] = useState<{ type: 'case' | 'family' | 'invoice' | 'vehicle' | 'staff'; id: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateCaseModalOpen, setIsCreateCaseModalOpen] = useState<boolean>(false);

  // Confirm Dialog & Toast System State
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Entities State
  const [cases, setCases] = useState<Case[]>(INITIAL_CASES);
  const [timelineEvents, setTimelineEvents] = useState<CaseTimelineEvent[]>(INITIAL_TIMELINE);
  const [tasks, setTasks] = useState<CaseTask[]>(INITIAL_TASKS);
  const [documents, setDocuments] = useState<CaseDocument[]>(INITIAL_DOCS);
  const [notes, setNotes] = useState<CaseNote[]>(INITIAL_NOTES);
  const [families, setFamilies] = useState<Family[]>(INITIAL_FAMILIES);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [settings, setSettings] = useState<CompanySettings>(INITIAL_SETTINGS);

  // TOAST & DIALOG HELPERS
  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openConfirmDialog = (config: Omit<ConfirmDialogState, 'isOpen'>) => {
    setConfirmDialog({ ...config, isOpen: true });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(null);
  };

  const addNotification = (title: string, message: string, type: AppNotification['type'] = 'info', linkModule?: string, linkId?: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type,
      linkModule,
      linkId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // CASES CRUD
  const addCase = (newCaseData: Omit<Case, 'id' | 'caseNumber' | 'createdAt' | 'notesCount' | 'docsCount'>) => {
    const id = `case-${Date.now()}`;
    const caseNumber = `FHC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCase: Case = {
      ...newCaseData,
      id,
      caseNumber,
      createdAt: new Date().toISOString().split('T')[0],
      notesCount: 0,
      docsCount: 0
    };
    setCases(prev => [newCase, ...prev]);

    // Timeline event
    const tlEvent: CaseTimelineEvent = {
      id: `tl-${Date.now()}`,
      caseId: id,
      title: 'Case File Created',
      description: `New funeral arrangement initiated for ${newCase.deceasedName}`,
      timestamp: new Date().toLocaleString(),
      author: newCase.assignedStaffName,
      type: 'case_created'
    };
    setTimelineEvents(prev => [tlEvent, ...prev]);

    // Calendar Event if date given
    if (newCase.funeralDate) {
      const calEvt: CalendarEvent = {
        id: `cal-${Date.now()}`,
        title: `${newCase.serviceType}: ${newCase.deceasedName}`,
        caseId: id,
        caseNumber,
        deceasedName: newCase.deceasedName,
        startDate: newCase.funeralDate,
        startTime: newCase.funeralTime || '10:00 AM',
        endTime: '12:00 PM',
        type: newCase.serviceType.includes('Cremation') ? 'Cremation' : 'Funeral',
        location: newCase.location,
        staffName: newCase.assignedStaffName
      };
      setCalendarEvents(prev => [...prev, calEvt]);
    }

    addToast(`Case #${caseNumber} for ${newCase.deceasedName} created successfully!`);
    addNotification('New Funeral Case Initiated', `Case #${caseNumber} created for ${newCase.deceasedName}`, 'success', 'Cases', id);
  };

  const updateCase = (id: string, updatedData: Partial<Case>) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
    addToast('Case record updated successfully.');
  };

  const deleteCase = (id: string) => {
    const caseToDelete = cases.find(c => c.id === id);
    setCases(prev => prev.filter(c => c.id !== id));
    // Cascade cleanup
    setTasks(prev => prev.filter(t => t.caseId !== id));
    setDocuments(prev => prev.filter(d => d.caseId !== id));
    setNotes(prev => prev.filter(n => n.caseId !== id));
    setCalendarEvents(prev => prev.filter(ce => ce.caseId !== id));
    setTimelineEvents(prev => prev.filter(te => te.caseId !== id));
    
    if (activeCaseId === id) setActiveCaseId(null);
    if (drawerItem?.id === id) setDrawerItem(null);

    addToast(`Case #${caseToDelete?.caseNumber || id} deleted permanently.`, 'warning');
    addNotification('Case Deleted', `Case #${caseToDelete?.caseNumber} was removed from database`, 'warning');
  };

  const archiveCase = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'Archived' } : c));
    addToast('Case moved to archives.', 'info');
  };

  const duplicateCase = (id: string) => {
    const orig = cases.find(c => c.id === id);
    if (!orig) return;
    const newId = `case-${Date.now()}`;
    const newNum = `FHC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const copy: Case = {
      ...orig,
      id: newId,
      caseNumber: newNum,
      deceasedName: `${orig.deceasedName} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCases(prev => [copy, ...prev]);
    addToast(`Duplicated case #${newNum} created.`);
  };

  const updateCaseStatus = (caseId: string, status: Case['status']) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, status } : c));
    addToast(`Case status updated to ${status}.`);
  };

  const addTimelineEvent = (event: Omit<CaseTimelineEvent, 'id' | 'timestamp'>) => {
    const newEvt: CaseTimelineEvent = {
      ...event,
      id: `tl-${Date.now()}`,
      timestamp: new Date().toLocaleString()
    };
    setTimelineEvents(prev => [newEvt, ...prev]);
  };

  // TASKS CRUD
  const addTask = (taskData: Omit<CaseTask, 'id'>) => {
    const newTask: CaseTask = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
    addToast(`Task "${taskData.title}" created.`);
  };

  const updateTask = (id: string, updatedData: Partial<CaseTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    addToast('Task details updated.');
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    addToast('Task removed.', 'warning');
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Completed' ? 'To Do' : 'Completed';
        if (nextStatus === 'Completed') {
          addToast(`Task "${t.title}" marked as Completed!`);
        }
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const moveTaskStatus = (taskId: string, newStatus: CaseTask['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    addToast(`Task moved to ${newStatus}.`);
  };

  // DOCUMENTS CRUD
  const addDocument = (docData: Omit<CaseDocument, 'id'>) => {
    const newDoc: CaseDocument = {
      ...docData,
      id: `doc-${Date.now()}`
    };
    setDocuments(prev => [newDoc, ...prev]);
    
    if (docData.caseId) {
      setCases(prev => prev.map(c => c.id === docData.caseId ? { ...c, docsCount: c.docsCount + 1 } : c));
    }
    addToast(`Document "${docData.name}" uploaded successfully!`);
    addNotification('Document Uploaded', `${docData.name} added to vault`, 'info', 'Documents', newDoc.id);
  };

  const renameDocument = (id: string, newName: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, name: newName } : d));
    addToast('Document renamed.');
  };

  const deleteDocument = (docId: string) => {
    const docToDelete = documents.find(d => d.id === docId);
    setDocuments(prev => prev.filter(d => d.id !== docId));
    if (docToDelete?.caseId) {
      setCases(prev => prev.map(c => c.id === docToDelete.caseId ? { ...c, docsCount: Math.max(0, c.docsCount - 1) } : c));
    }
    addToast('Document deleted.', 'warning');
  };

  // NOTES CRUD
  const addNote = (caseId: string, text: string, author: string = 'Marcus Vance') => {
    const newNote: CaseNote = {
      id: `note-${Date.now()}`,
      caseId,
      author,
      avatar: author.split(' ').map(n => n[0]).join(''),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };
    setNotes(prev => [newNote, ...prev]);
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, notesCount: c.notesCount + 1 } : c));
    addToast('Arrangement note posted.');
  };

  const deleteNote = (id: string) => {
    const noteToDelete = notes.find(n => n.id === id);
    setNotes(prev => prev.filter(n => n.id !== id));
    if (noteToDelete?.caseId) {
      setCases(prev => prev.map(c => c.id === noteToDelete.caseId ? { ...c, notesCount: Math.max(0, c.notesCount - 1) } : c));
    }
    addToast('Note deleted.', 'warning');
  };

  // FAMILIES CRUD
  const addFamily = (famData: Omit<Family, 'id' | 'linkedCases' | 'lastActivity'>) => {
    const newFam: Family = {
      ...famData,
      id: `fam-${Date.now()}`,
      linkedCases: [],
      lastActivity: `${new Date().toISOString().split('T')[0]} (Family Profile Created)`
    };
    setFamilies(prev => [newFam, ...prev]);
    addToast(`Family record for ${famData.name} created!`);
  };

  const updateFamily = (id: string, updatedData: Partial<Family>) => {
    setFamilies(prev => prev.map(f => f.id === id ? { ...f, ...updatedData } : f));
    addToast('Family details updated.');
  };

  const deleteFamily = (id: string) => {
    const fam = families.find(f => f.id === id);
    setFamilies(prev => prev.filter(f => f.id !== id));
    addToast(`Family "${fam?.name}" deleted.`, 'warning');
  };

  // CALENDAR CRUD
  const addCalendarEvent = (evtData: Omit<CalendarEvent, 'id'>) => {
    const newEvt: CalendarEvent = {
      ...evtData,
      id: `cal-${Date.now()}`
    };
    setCalendarEvents(prev => [...prev, newEvt]);
    addToast(`Event "${evtData.title}" scheduled on ${evtData.startDate}.`);
  };

  const updateCalendarEvent = (id: string, updatedData: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(ce => ce.id === id ? { ...ce, ...updatedData } : ce));
    addToast('Service event updated.');
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(ce => ce.id !== id));
    addToast('Calendar event removed.', 'warning');
  };

  // INVOICES CRUD
  const createInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const newInv: Invoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`
    };
    setInvoices(prev => [newInv, ...prev]);
    addToast(`Invoice #${newInv.invoiceNumber} created for ${newInv.familyName}!`);
    addNotification('New Invoice Issued', `Invoice #${newInv.invoiceNumber} issued for $${newInv.totalAmount.toLocaleString()}`, 'info', 'Invoices', newInv.id);
  };

  const updateInvoice = (id: string, updatedData: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...updatedData } : i));
    addToast('Invoice details updated.');
  };

  const markInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(i => {
      if (i.id === id) {
        const paidAmount = status === 'Paid' ? i.totalAmount : i.paidAmount;
        return { ...i, status, paidAmount };
      }
      return i;
    }));
    addToast(`Invoice marked as ${status}.`);
    if (status === 'Paid') {
      addNotification('Invoice Paid', `Payment settled for invoice`, 'success', 'Invoices', id);
    }
  };

  const deleteInvoice = (id: string) => {
    const inv = invoices.find(i => i.id === id);
    setInvoices(prev => prev.filter(i => i.id !== id));
    addToast(`Invoice #${inv?.invoiceNumber} deleted.`, 'warning');
  };

  // VEHICLES CRUD
  const addVehicle = (vehData: Omit<Vehicle, 'id'>) => {
    const newVeh: Vehicle = {
      ...vehData,
      id: `veh-${Date.now()}`
    };
    setVehicles(prev => [...prev, newVeh]);
    addToast(`Vehicle ${vehData.name} registered to fleet.`);
  };

  const updateVehicle = (id: string, updatedData: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updatedData } : v));
    addToast('Fleet vehicle updated.');
  };

  const deleteVehicle = (id: string) => {
    const v = vehicles.find(veh => veh.id === id);
    setVehicles(prev => prev.filter(veh => veh.id !== id));
    addToast(`Vehicle "${v?.name}" removed from fleet.`, 'warning');
  };

  // INVENTORY CRUD
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-item-${Date.now()}`
    };
    setInventory(prev => [...prev, newItem]);
    addToast(`Inventory item "${itemData.name}" added.`);
  };

  const updateInventoryItem = (id: string, updatedData: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(inv => inv.id === id ? { ...inv, ...updatedData } : inv));
    addToast('Inventory record updated.');
  };

  const adjustStock = (id: string, delta: number) => {
    setInventory(prev => prev.map(inv => {
      if (inv.id === id) {
        const nextStock = Math.max(0, inv.stock + delta);
        if (nextStock <= inv.lowStockAlert) {
          addNotification('Low Stock Alert', `${inv.name} stock level is low (${nextStock} left)`, 'warning', 'Inventory', id);
        }
        return { ...inv, stock: nextStock };
      }
      return inv;
    }));
    addToast('Stock level adjusted.');
  };

  const deleteInventoryItem = (id: string) => {
    const item = inventory.find(i => i.id === id);
    setInventory(prev => prev.filter(i => i.id !== id));
    addToast(`Item "${item?.name}" deleted from catalog.`, 'warning');
  };

  // STAFF CRUD
  const addStaff = (staffData: Omit<StaffMember, 'id' | 'activeCasesCount'>) => {
    const initials = staffData.name.split(' ').map(n => n[0]).join('');
    const newStaff: StaffMember = {
      ...staffData,
      id: `staff-${Date.now()}`,
      photo: initials,
      activeCasesCount: 0
    };
    setStaff(prev => [...prev, newStaff]);
    addToast(`Team member ${staffData.name} added as ${staffData.role}!`);
  };

  const updateStaff = (id: string, updatedData: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
    addToast('Employee profile updated.');
  };

  const toggleStaffStatus = (id: string) => {
    setStaff(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Active' ? 'Off Duty' : 'Active';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
    addToast('Staff status updated.');
  };

  const deleteStaff = (id: string) => {
    const member = staff.find(s => s.id === id);
    setStaff(prev => prev.filter(s => s.id !== id));
    addToast(`Staff member "${member?.name}" removed.`, 'warning');
  };

  // SETTINGS
  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast('Company branding & system settings saved successfully!');
  };

  return (
    <CRMContext.Provider
      value={{
        currentModule,
        setCurrentModule,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        activeCaseId,
        setActiveCaseId,
        drawerItem,
        setDrawerItem,
        searchQuery,
        setSearchQuery,
        isCreateCaseModalOpen,
        setIsCreateCaseModalOpen,
        confirmDialog,
        openConfirmDialog,
        closeConfirmDialog,
        toasts,
        addToast,
        removeToast,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        cases,
        addCase,
        updateCase,
        deleteCase,
        archiveCase,
        duplicateCase,
        updateCaseStatus,
        timelineEvents,
        addTimelineEvent,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        moveTaskStatus,
        documents,
        addDocument,
        renameDocument,
        deleteDocument,
        notes,
        addNote,
        deleteNote,
        families,
        addFamily,
        updateFamily,
        deleteFamily,
        calendarEvents,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        invoices,
        createInvoice,
        updateInvoice,
        markInvoiceStatus,
        deleteInvoice,
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        adjustStock,
        deleteInventoryItem,
        staff,
        addStaff,
        updateStaff,
        toggleStaffStatus,
        deleteStaff,
        settings,
        updateSettings
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
