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
  Toast,
  Conversation,
  ChatMessage,
  CommunicationChannel,
  ConversationStatus,
  ChatAttachment,
  WhatsAppSettings
} from '../types/crm';
import { generateAiFuneralResponse } from '../services/whatsappService';

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

  // WHATSAPP SETTINGS & AI ASSISTANT
  whatsAppSettings: WhatsAppSettings;
  updateWhatsAppSettings: (settings: Partial<WhatsAppSettings>) => void;
  receiveWhatsAppMessage: (familyPhone: string, content: string) => void;
  generateAiReplyForThread: (conversationId: string) => void;

  // CONVERSATIONS & INBOX CRUD
  conversations: Conversation[];
  chatMessages: ChatMessage[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendChatMessage: (conversationId: string, content: string, channel: CommunicationChannel, attachments?: ChatAttachment[]) => void;
  updateConversationStatus: (id: string, status: ConversationStatus) => void;
  togglePinConversation: (id: string) => void;
  archiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  assignConversationStaff: (id: string, staffName: string) => void;

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

const INITIAL_WHATSAPP_SETTINGS: WhatsAppSettings = {
  metaAppId: '10948291048291',
  phoneNumberId: '1058291048102',
  accessToken: 'EAAG9281...FULL_META_ACCESS_TOKEN',
  webhookSecret: 'evergreen_wh_sec_9948120',
  isAutoResponderEnabled: true,
  aiModel: 'GPT-4o Funeral Care',
  aiTone: 'Empathetic & Dignified',
  autoCreateDraftCases: true
};

// INITIAL MOCK CONVERSATIONS & CHAT MESSAGES
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-101',
    familyId: 'fam-101',
    familyName: 'Sterling Family (Arthur Sterling)',
    familyPhone: '020-555-0192',
    familyEmail: 'arthur.sterling@example.com',
    caseId: 'case-101',
    caseNumber: 'FHC-2026-8451',
    deceasedName: 'Eleanor Vance Sterling',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Marcus Vance',
    status: 'Waiting for Family',
    isPinned: true,
    unreadCount: 1,
    lastMessage: 'Thank you, Marcus. We will review the music options tonight.',
    lastMessageTime: '10:42 AM',
    preferredChannel: 'WhatsApp',
    isAiEnabled: true
  },
  {
    id: 'conv-102',
    familyId: 'fam-102',
    familyName: 'Harrison Family (Margaret Harrison)',
    familyPhone: '0121-555-0144',
    familyEmail: 'margaret.harrison@example.com',
    caseId: 'case-102',
    caseNumber: 'FHC-2026-3842',
    deceasedName: 'Robert James Harrison',
    assignedStaffId: 'staff-2',
    assignedStaffName: 'Elena Rostova',
    status: 'Open',
    isPinned: false,
    unreadCount: 0,
    lastMessage: 'The cremation forms have been signed online. What are the next steps?',
    lastMessageTime: 'Yesterday',
    preferredChannel: 'Email',
    isAiEnabled: true
  },
  {
    id: 'conv-103',
    familyId: 'fam-103',
    familyName: 'Montgomery Family (Clara Montgomery)',
    familyPhone: '0161-555-0873',
    familyEmail: 'clara.m@example.com',
    caseId: 'case-103',
    caseNumber: 'FHC-2026-7281',
    deceasedName: 'Harold Montgomery',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Marcus Vance',
    status: 'Waiting for Staff',
    isPinned: false,
    unreadCount: 2,
    lastMessage: 'Could we change the flower arrangement to white lilies?',
    lastMessageTime: '09:15 AM',
    preferredChannel: 'SMS',
    isAiEnabled: true
  }
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-101',
    senderName: 'Marcus Vance',
    senderRole: 'staff',
    avatar: 'MV',
    channel: 'WhatsApp',
    content: 'Good morning Mr. Sterling. I have attached the draft obituary for your mother Eleanor. Please review at your earliest convenience.',
    attachments: [
      { name: 'Draft_Obituary_Eleanor_Sterling.pdf', url: '#', size: '1.2 MB', type: 'pdf' }
    ],
    timestamp: 'Yesterday 04:15 PM',
    read: true,
    deliveryStatus: 'read'
  },
  {
    id: 'msg-2',
    conversationId: 'conv-101',
    senderName: 'Marcus Vance',
    senderRole: 'staff',
    avatar: 'MV',
    channel: 'Internal Note',
    content: 'Internal Note: Son Arthur called regarding organist selection. Confirmed "Amazing Grace" and "Abide With Me".',
    timestamp: 'Yesterday 05:00 PM',
    read: true,
    deliveryStatus: 'read'
  },
  {
    id: 'msg-3',
    conversationId: 'conv-101',
    senderName: 'Arthur Sterling',
    senderRole: 'family',
    avatar: 'AS',
    channel: 'WhatsApp',
    content: 'Thank you, Marcus. We will review the music options tonight.',
    timestamp: 'Today 10:42 AM',
    read: false,
    deliveryStatus: 'delivered'
  },
  {
    id: 'msg-4',
    conversationId: 'conv-103',
    senderName: 'Clara Montgomery',
    senderRole: 'family',
    avatar: 'CM',
    channel: 'SMS',
    content: 'Could we change the flower arrangement to white lilies?',
    timestamp: 'Today 09:15 AM',
    read: false,
    deliveryStatus: 'delivered'
  }
];

const INITIAL_CASES: Case[] = [
  {
    id: 'case-101',
    caseNumber: 'FHC-2026-8451',
    deceasedName: 'Eleanor Vance Sterling',
    dateOfBirth: '1942-03-14',
    dateOfDeath: '2026-07-25',
    placeOfDeath: 'St. Jude Memorial Hospital, London',
    primaryContactId: 'fam-101',
    primaryContactName: 'Arthur Sterling',
    relationship: 'Son',
    phone: '020-555-0192',
    email: 'arthur.sterling@example.com',
    serviceType: 'Traditional Funeral',
    funeralDate: '2026-07-29',
    funeralTime: '10:30 AM',
    location: 'Main Chapel - Grace Memorial',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Marcus Vance',
    status: 'Service Scheduled',
    estimatedCost: 7500,
    paidAmount: 5000,
    notesCount: 2,
    docsCount: 3,
    createdAt: '2026-07-25'
  },
  {
    id: 'case-102',
    caseNumber: 'FHC-2026-3842',
    deceasedName: 'Robert James Harrison',
    dateOfBirth: '1938-11-20',
    dateOfDeath: '2026-07-26',
    placeOfDeath: 'City Hospice, Birmingham',
    primaryContactId: 'fam-102',
    primaryContactName: 'Margaret Harrison',
    relationship: 'Spouse',
    phone: '0121-555-0144',
    email: 'margaret.harrison@example.com',
    serviceType: 'Direct Cremation',
    funeralDate: '2026-08-01',
    funeralTime: '09:30 AM',
    location: 'Birmingham Crematorium',
    assignedStaffId: 'staff-2',
    assignedStaffName: 'Elena Rostova',
    status: 'Draft',
    estimatedCost: 3500,
    paidAmount: 0,
    notesCount: 0,
    docsCount: 1,
    createdAt: '2026-07-26'
  },
  {
    id: 'case-103',
    caseNumber: 'FHC-2026-7281',
    deceasedName: 'Harold Montgomery',
    dateOfBirth: '1948-05-17',
    dateOfDeath: '2026-07-24',
    placeOfDeath: 'Royal Infirmary, Manchester',
    primaryContactId: 'fam-103',
    primaryContactName: 'Clara Montgomery',
    relationship: 'Daughter',
    phone: '0161-555-0873',
    email: 'clara.m@example.com',
    serviceType: 'Memorial Service',
    funeralDate: '2026-07-30',
    funeralTime: '01:00 PM',
    location: 'Greenwood Woodland Chapel',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Marcus Vance',
    status: 'Active',
    estimatedCost: 5400,
    paidAmount: 2000,
    notesCount: 1,
    docsCount: 2,
    createdAt: '2026-07-24'
  },
  {
    id: 'case-104',
    caseNumber: 'FHC-2026-5821',
    deceasedName: 'Gwyneth Davies',
    dateOfBirth: '1935-08-09',
    dateOfDeath: '2026-07-23',
    placeOfDeath: 'Western General, Edinburgh',
    primaryContactId: 'fam-104',
    primaryContactName: 'Thomas Davies',
    relationship: 'Son',
    phone: '0131-555-0921',
    email: 't.davies@example.com',
    serviceType: 'Graveside Burial',
    funeralDate: '2026-07-26',
    funeralTime: '11:30 AM',
    location: 'Dean Cemetery',
    assignedStaffId: 'staff-3',
    assignedStaffName: 'David Martinez',
    status: 'Completed',
    estimatedCost: 6800,
    paidAmount: 6800,
    notesCount: 0,
    docsCount: 2,
    createdAt: '2026-07-23'
  },
  {
    id: 'case-105',
    caseNumber: 'FHC-2026-9192',
    deceasedName: 'Devendra Patel',
    dateOfBirth: '1952-04-02',
    dateOfDeath: '2026-07-27',
    placeOfDeath: 'St. James Hospital, Leeds',
    primaryContactId: 'fam-105',
    primaryContactName: 'Priyesh Patel',
    relationship: 'Son',
    phone: '0113-555-0382',
    email: 'p.patel@example.com',
    serviceType: 'Traditional Funeral',
    funeralDate: '2026-07-27',
    funeralTime: '11:00 AM',
    location: 'Main Chapel - Grace Memorial',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Marcus Vance',
    status: 'In Transit',
    estimatedCost: 8200,
    paidAmount: 8200,
    notesCount: 0,
    docsCount: 3,
    createdAt: '2026-07-27'
  }
];

const INITIAL_TIMELINE: CaseTimelineEvent[] = [
  {
    id: 'tl-1',
    caseId: 'case-101',
    title: 'First Call Intake Complete',
    description: 'Initial information recorded from son Arthur Sterling.',
    timestamp: '25/07/2026, 09:30:00',
    author: 'Marcus Vance',
    type: 'case_created'
  },
  {
    id: 'tl-2',
    caseId: 'case-101',
    title: 'Coroner Release Obtained',
    description: 'Cremation certificate forms filed at local registry.',
    timestamp: '26/07/2026, 11:15:00',
    author: 'Elena Rostova',
    type: 'document_uploaded'
  }
];

const INITIAL_TASKS: CaseTask[] = [
  {
    id: 'task-1',
    caseId: 'case-101',
    caseName: 'Eleanor Vance Sterling',
    title: 'Prepare Reposing Suite A',
    assignedStaffName: 'Sarah Thompson',
    dueDate: '2026-07-28',
    dueTime: '09:00 AM',
    priority: 'High',
    status: 'To Do'
  },
  {
    id: 'task-2',
    caseId: 'case-102',
    caseName: 'Robert James Harrison',
    title: 'Schedule Cremation Slot',
    assignedStaffName: 'Elena Rostova',
    dueDate: '2026-07-29',
    dueTime: '10:00 AM',
    priority: 'Medium',
    status: 'In Progress'
  }
];

const INITIAL_DOCS: CaseDocument[] = [
  {
    id: 'doc-1',
    caseId: 'case-101',
    caseName: 'Eleanor Vance Sterling',
    name: 'Death_Certificate_Sterling.pdf',
    category: 'Death Certificates',
    size: '342 KB',
    uploadDate: '2026-07-25',
    fileType: 'pdf'
  },
  {
    id: 'doc-2',
    caseId: 'case-102',
    caseName: 'Robert James Harrison',
    name: 'Cremation_Auth_Form_Signed.pdf',
    category: 'Contracts',
    size: '890 KB',
    uploadDate: '2026-07-26',
    fileType: 'pdf'
  }
];

const INITIAL_NOTES: CaseNote[] = [
  {
    id: 'note-1',
    caseId: 'case-101',
    author: 'Marcus Vance',
    avatar: 'MV',
    date: '2026-07-25',
    time: '11:00 AM',
    text: 'Family requested specific piano music selection for the entrance.'
  }
];

const INITIAL_FAMILIES: Family[] = [
  {
    id: 'fam-101',
    name: 'Arthur Sterling',
    relationship: 'Son',
    phone: '020-555-0192',
    email: 'arthur.sterling@example.com',
    address: '1420 Highland Dr, London, SW11',
    linkedCases: [
      { caseId: 'case-101', deceasedName: 'Eleanor Vance Sterling', caseNumber: 'FHC-2026-8451' }
    ],
    lastActivity: '2026-07-25 (Case Created)',
    notes: 'Prefers WhatsApp messaging. Son of late Eleanor.'
  },
  {
    id: 'fam-102',
    name: 'Margaret Harrison',
    relationship: 'Spouse',
    phone: '0121-555-0144',
    email: 'margaret.harrison@example.com',
    address: '89 West Boulevard, Birmingham, B32',
    linkedCases: [
      { caseId: 'case-102', deceasedName: 'Robert James Harrison', caseNumber: 'FHC-2026-3842' }
    ],
    lastActivity: '2026-07-26 (Case Created)',
    notes: 'Primary contact for husband Robert Harrison.'
  },
  {
    id: 'fam-103',
    name: 'Clara Montgomery',
    relationship: 'Daughter',
    phone: '0161-555-0873',
    email: 'clara.m@example.com',
    address: '12 Oak Lane, Manchester, M14',
    linkedCases: [
      { caseId: 'case-103', deceasedName: 'Harold Montgomery', caseNumber: 'FHC-2026-7281' }
    ],
    lastActivity: '2026-07-24 (Case Created)',
    notes: 'Awaiting flower selections update.'
  },
  {
    id: 'fam-104',
    name: 'Thomas Davies',
    relationship: 'Son',
    phone: '0131-555-0921',
    email: 't.davies@example.com',
    address: '4 Dean Terrace, Edinburgh, EH4',
    linkedCases: [
      { caseId: 'case-104', deceasedName: 'Gwyneth Davies', caseNumber: 'FHC-2026-5821' }
    ],
    lastActivity: '2026-07-23 (Case Completed)',
    notes: 'Account settled in full.'
  },
  {
    id: 'fam-105',
    name: 'Priyesh Patel',
    relationship: 'Son',
    phone: '0113-555-0382',
    email: 'p.patel@example.com',
    address: '15 Roundhay Road, Leeds, LS8',
    linkedCases: [
      { caseId: 'case-105', deceasedName: 'Devendra Patel', caseNumber: 'FHC-2026-9192' }
    ],
    lastActivity: '2026-07-27 (Case Created)',
    notes: 'Traditional cremation services.'
  }
];

const INITIAL_CALENDAR: CalendarEvent[] = [
  {
    id: 'cal-101',
    title: 'Funeral: Devendra Patel',
    caseId: 'case-105',
    caseNumber: 'FHC-2026-9192',
    deceasedName: 'Devendra Patel',
    startDate: '2026-07-27',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    type: 'Funeral',
    location: 'Main Chapel - Grace Memorial',
    staffName: 'Marcus Vance'
  },
  {
    id: 'cal-102',
    title: 'Viewing: Eleanor Vance Sterling',
    caseId: 'case-101',
    caseNumber: 'FHC-2026-8451',
    deceasedName: 'Eleanor Vance Sterling',
    startDate: '2026-07-27',
    startTime: '04:00 PM',
    endTime: '06:00 PM',
    type: 'Viewing',
    location: 'Reposing Suite A',
    staffName: 'Sarah Thompson'
  },
  {
    id: 'cal-103',
    title: 'Family Meeting: Harrison Family',
    caseId: 'case-102',
    caseNumber: 'FHC-2026-3842',
    deceasedName: 'Robert James Harrison',
    startDate: '2026-07-28',
    startTime: '09:30 AM',
    endTime: '11:00 AM',
    type: 'Family Meeting',
    location: 'Arrangement Room 1',
    staffName: 'Elena Rostova'
  },
  {
    id: 'cal-104',
    title: 'Funeral: Harold Montgomery',
    caseId: 'case-103',
    caseNumber: 'FHC-2026-7281',
    deceasedName: 'Harold Montgomery',
    startDate: '2026-07-30',
    startTime: '01:00 PM',
    endTime: '03:00 PM',
    type: 'Funeral',
    location: 'Greenwood Woodland Chapel',
    staffName: 'Marcus Vance'
  }
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-101',
    familyId: 'fam-101',
    familyName: 'Arthur Sterling',
    caseId: 'case-101',
    caseNumber: 'FHC-2026-8451',
    deceasedName: 'Eleanor Vance Sterling',
    items: [
      { id: 'item-1', description: 'Professional Funeral Services Fee', quantity: 1, unitPrice: 3500, total: 3500 },
      { id: 'item-2', description: 'Grace Memorial Main Chapel Rental', quantity: 1, unitPrice: 1500, total: 1500 },
      { id: 'item-3', description: 'Mercedes Hearse & Limousine Transport', quantity: 1, unitPrice: 1500, total: 1500 },
      { id: 'item-4', description: 'Coffin selection - Solid Oak wood', quantity: 1, unitPrice: 1000, total: 1000 }
    ],
    totalAmount: 7500,
    paidAmount: 5000,
    dueDate: '2026-08-05',
    issueDate: '2026-07-25',
    status: 'Pending'
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-102',
    familyId: 'fam-102',
    familyName: 'Margaret Harrison',
    caseId: 'case-102',
    caseNumber: 'FHC-2026-3842',
    deceasedName: 'Robert James Harrison',
    items: [
      { id: 'item-1', description: 'Direct Cremation Package', quantity: 1, unitPrice: 2800, total: 2800 },
      { id: 'item-2', description: 'Standard Eco Ash Urn casket', quantity: 1, unitPrice: 700, total: 700 }
    ],
    totalAmount: 3500,
    paidAmount: 0,
    dueDate: '2026-08-10',
    issueDate: '2026-07-26',
    status: 'Pending'
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-103',
    familyId: 'fam-103',
    familyName: 'Clara Montgomery',
    caseId: 'case-103',
    caseNumber: 'FHC-2026-7281',
    deceasedName: 'Harold Montgomery',
    items: [
      { id: 'item-1', description: 'Memorial Chapel Service Package', quantity: 1, unitPrice: 4200, total: 4200 },
      { id: 'item-2', description: 'Flower arrangements - Roses & Lilies', quantity: 1, unitPrice: 1200, total: 1200 }
    ],
    totalAmount: 5400,
    paidAmount: 2000,
    dueDate: '2026-08-02',
    issueDate: '2026-07-24',
    status: 'Pending'
  },
  {
    id: 'inv-104',
    invoiceNumber: 'INV-2026-104',
    familyId: 'fam-104',
    familyName: 'Thomas Davies',
    caseId: 'case-104',
    caseNumber: 'FHC-2026-5821',
    deceasedName: 'Gwyneth Davies',
    items: [
      { id: 'item-1', description: 'Traditional Graveside Burial arrangement', quantity: 1, unitPrice: 4800, total: 4800 },
      { id: 'item-2', description: 'Cemetery plots reservation & digging', quantity: 1, unitPrice: 2000, total: 2000 }
    ],
    totalAmount: 6800,
    paidAmount: 6800,
    dueDate: '2026-07-26',
    issueDate: '2026-07-23',
    status: 'Paid'
  },
  {
    id: 'inv-105',
    invoiceNumber: 'INV-2026-105',
    familyId: 'fam-105',
    familyName: 'Priyesh Patel',
    caseId: 'case-105',
    caseNumber: 'FHC-2026-9192',
    deceasedName: 'Devendra Patel',
    items: [
      { id: 'item-1', description: 'Traditional Asian Funeral Cremation rites', quantity: 1, unitPrice: 5200, total: 5200 },
      { id: 'item-2', description: 'Crematorium rental & ash retrieval', quantity: 1, unitPrice: 3000, total: 3000 }
    ],
    totalAmount: 8200,
    paidAmount: 8200,
    dueDate: '2026-07-27',
    issueDate: '2026-07-27',
    status: 'Paid'
  },
  {
    id: 'inv-106',
    invoiceNumber: 'INV-2026-106',
    familyId: 'fam-101',
    familyName: 'Arthur Sterling',
    caseId: 'case-101',
    caseNumber: 'FHC-2026-8451',
    deceasedName: 'Eleanor Vance Sterling',
    items: [
      { id: 'item-1', description: 'Overdue service deposit surcharge', quantity: 1, unitPrice: 1200, total: 1200 }
    ],
    totalAmount: 1200,
    paidAmount: 0,
    dueDate: '2026-07-17',
    issueDate: '2026-07-10',
    status: 'Overdue'
  }
];

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    name: 'Mercedes-Benz E-Class Hearse',
    registrationNumber: 'EX26 WRN',
    type: 'Hearse',
    photo: 'H1',
    driverName: 'James Wilson',
    status: 'Available',
    nextMaintenanceDate: '2026-09-12',
    mileage: '12,450 mi'
  },
  {
    id: 'veh-2',
    name: 'Jaguar XJ Limousine',
    registrationNumber: 'EX26 YKM',
    type: 'Limousine',
    photo: 'L1',
    driverName: 'James Wilson',
    status: 'In Service',
    nextMaintenanceDate: '2026-10-05',
    mileage: '8,900 mi'
  },
  {
    id: 'veh-3',
    name: 'Ford Transit Transfer Van',
    registrationNumber: 'EX26 TYN',
    type: 'Transfer Van',
    photo: 'V1',
    driverName: 'James Wilson',
    status: 'Available',
    nextMaintenanceDate: '2026-08-20',
    mileage: '24,600 mi'
  }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-item-1',
    name: 'Solid English Oak Casket',
    category: 'Caskets',
    stock: 5,
    lowStockAlert: 2,
    purchasePrice: 400,
    sellingPrice: 1000,
    supplier: 'British Caskets Ltd',
    location: 'Storage Room A'
  },
  {
    id: 'inv-item-2',
    name: 'Polished Brass Urn',
    category: 'Urns',
    stock: 12,
    lowStockAlert: 4,
    purchasePrice: 80,
    sellingPrice: 220,
    supplier: 'Legacy Urns',
    location: 'Storage Room B'
  }
];

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Marcus Vance',
    position: 'Senior Funeral Director',
    role: 'Funeral Director',
    email: 'm.vance@evergreen.co.uk',
    phone: '020-555-0101',
    status: 'Active',
    photo: 'MV',
    activeCasesCount: 3
  },
  {
    id: 'staff-2',
    name: 'Elena Rostova',
    position: 'Funeral Director',
    role: 'Funeral Director',
    email: 'e.rostova@evergreen.co.uk',
    phone: '020-555-0102',
    status: 'Active',
    photo: 'ER',
    activeCasesCount: 1
  },
  {
    id: 'staff-3',
    name: 'David Martinez',
    position: 'Lead Embalmer',
    role: 'Funeral Director',
    email: 'd.martinez@evergreen.co.uk',
    phone: '020-555-0103',
    status: 'Active',
    photo: 'DM',
    activeCasesCount: 1
  },
  {
    id: 'staff-4',
    name: 'Sarah Thompson',
    position: 'Family Support Specialist',
    role: 'Office Staff',
    email: 's.thompson@evergreen.co.uk',
    phone: '020-555-0104',
    status: 'Active',
    photo: 'ST',
    activeCasesCount: 0
  },
  {
    id: 'staff-5',
    name: 'Lisa Brown',
    position: 'Office Administrator',
    role: 'Office Staff',
    email: 'l.brown@evergreen.co.uk',
    phone: '020-555-0105',
    status: 'Active',
    photo: 'LB',
    activeCasesCount: 0
  },
  {
    id: 'staff-6',
    name: 'James Wilson',
    position: 'Lead Hearse Driver',
    role: 'Driver',
    email: 'j.wilson@evergreen.co.uk',
    phone: '020-555-0106',
    status: 'Active',
    photo: 'JW',
    activeCasesCount: 0
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'New Funeral Case Initiated',
    message: 'Case #FHC-2026-9192 created for Devendra Patel',
    timestamp: 'Today, 11:00 AM',
    read: false,
    type: 'success',
    linkModule: 'Cases',
    linkId: 'case-105'
  },
  {
    id: 'notif-2',
    title: 'WhatsApp Message Received',
    message: 'New message from Clara Montgomery (Montgomery Family)',
    timestamp: 'Today, 09:15 AM',
    read: false,
    type: 'info',
    linkModule: 'Communications',
    linkId: 'conv-103'
  },
  {
    id: 'notif-3',
    title: 'Invoice Overdue Surcharge',
    message: 'Invoice INV-2026-106 is overdue by 10 days.',
    timestamp: 'Yesterday',
    read: false,
    type: 'warning',
    linkModule: 'Financials',
    linkId: 'inv-106'
  }
];

const INITIAL_SETTINGS: CompanySettings = {
  companyName: 'Evergreen Funeral Directors & Mortuary',
  tagline: 'Dignified & Compassionate Care Since 1994',
  logoText: 'EVERGREEN',
  address: '1200 Grand View Boulevard, London, SW1',
  phone: '020-555-0100',
  email: 'care@evergreen.co.uk',
  website: 'https://evergreen.co.uk',
  taxId: 'TAX-99482-UK',
  currency: 'GBP (£)',
  timeZone: 'Europe/London (BST)',
  primaryColor: '#7A9073',
  taxRate: 20.0
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

  // WhatsApp & AI Assistant State
  const [whatsAppSettings, setWhatsAppSettings] = useState<WhatsAppSettings>(INITIAL_WHATSAPP_SETTINGS);

  // Conversations & Messages State
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-101');

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

  const updateWhatsAppSettings = (newSettings: Partial<WhatsAppSettings>) => {
    setWhatsAppSettings(prev => ({ ...prev, ...newSettings }));
    addToast('WhatsApp Business Cloud API settings saved!');
  };

  // SIMULATE INCOMING WHATSAPP MESSAGE & AI RESPONSE
  const receiveWhatsAppMessage = (familyPhone: string, content: string) => {
    // 1. Find or create conversation for this phone number
    let targetConv = conversations.find(c => c.familyPhone.replace(/\D/g, '') === familyPhone.replace(/\D/g, ''));
    
    if (!targetConv) {
      const newConvId = `conv-${Date.now()}`;
      targetConv = {
        id: newConvId,
        familyId: `fam-${Date.now()}`,
        familyName: `WhatsApp Contact (${familyPhone})`,
        familyPhone,
        familyEmail: 'contact@whatsapp.family',
        assignedStaffName: 'Marcus Vance',
        status: 'Open',
        isPinned: false,
        unreadCount: 1,
        lastMessage: content,
        lastMessageTime: 'Just now',
        preferredChannel: 'WhatsApp',
        isAiEnabled: true
      };
      setConversations(prev => [targetConv!, ...prev]);
    } else {
      setConversations(prev => prev.map(c => c.id === targetConv!.id ? { ...c, lastMessage: content, lastMessageTime: 'Just now', unreadCount: c.unreadCount + 1 } : c));
    }

    // 2. Add incoming message
    const familyMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: targetConv.id,
      senderName: targetConv.familyName.split('(')[0]?.trim() || 'Family Contact',
      senderRole: 'family',
      avatar: 'WA',
      channel: 'WhatsApp',
      content,
      timestamp: 'Just now',
      read: false,
      deliveryStatus: 'delivered'
    };

    setChatMessages(prev => [...prev, familyMsg]);
    addToast(`Incoming WhatsApp message from ${familyPhone}`);
    addNotification('WhatsApp Message Received', `${content.slice(0, 50)}...`, 'info', 'Conversations', targetConv.id);

    // 3. AI Assistant Reasoning & Auto-Responder
    if (whatsAppSettings.isAutoResponderEnabled && targetConv.isAiEnabled !== false) {
      setTimeout(() => {
        const aiResponse = generateAiFuneralResponse(content, targetConv!, whatsAppSettings);

        const aiMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          conversationId: targetConv!.id,
          senderName: `Evergreen AI Care Assistant (${whatsAppSettings.aiModel})`,
          senderRole: 'ai',
          avatar: '🤖',
          channel: 'WhatsApp',
          content: aiResponse.messageText,
          timestamp: 'Just now',
          read: true,
          deliveryStatus: 'sent',
          aiAssisted: true
        };

        setChatMessages(prev => [...prev, aiMsg]);
        setConversations(prev => prev.map(c => c.id === targetConv!.id ? { ...c, lastMessage: aiResponse.messageText, lastMessageTime: 'Just now' } : c));
        addToast(`AI Funeral Care Assistant responded on WhatsApp`);

        // If First Call data was extracted, auto-create draft case file in CRM
        if (aiResponse.extractedCaseData && whatsAppSettings.autoCreateDraftCases) {
          const newCaseNum = `FHC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const newCase: Case = {
            id: `case-${Date.now()}`,
            caseNumber: newCaseNum,
            deceasedName: aiResponse.extractedCaseData.deceasedName,
            dateOfBirth: '1950-01-01',
            dateOfDeath: new Date().toISOString().split('T')[0],
            placeOfDeath: aiResponse.extractedCaseData.placeOfDeath,
            primaryContactId: targetConv!.familyId,
            primaryContactName: aiResponse.extractedCaseData.contactName,
            relationship: aiResponse.extractedCaseData.relationship,
            phone: familyPhone,
            email: targetConv!.familyEmail,
            serviceType: aiResponse.extractedCaseData.suggestedServiceType,
            funeralDate: '2026-07-28',
            funeralTime: '10:00 AM',
            location: 'Main Chapel - Grace Memorial',
            assignedStaffId: 'staff-1',
            assignedStaffName: 'Marcus Vance',
            status: 'Draft',
            estimatedCost: 6500,
            paidAmount: 0,
            notesCount: 1,
            docsCount: 0,
            createdAt: new Date().toISOString().split('T')[0]
          };

          setCases(prev => [newCase, ...prev]);
          linkOrCreateFamilyForCase(newCase, newCaseNum);
          setConversations(prev => prev.map(c => c.id === targetConv!.id ? { ...c, caseId: newCase.id, caseNumber: newCaseNum, deceasedName: newCase.deceasedName } : c));
          addToast(`🤖 AI Auto-Intake: Created Draft Funeral Case #${newCaseNum}!`, 'success');
          addNotification('AI Case Auto-Intake', `Draft case #${newCaseNum} created for ${newCase.deceasedName} from WhatsApp intake`, 'success', 'Cases', newCase.id);
        }

        // If human handover requested
        if (aiResponse.requiresHumanHandover) {
          updateConversationStatus(targetConv!.id, 'Waiting for Staff');
          addToast(`🔔 Handover Request: Conversation assigned to Marcus Vance`, 'warning');
          addNotification('Human Director Needed', `Family requested human director in WhatsApp chat`, 'warning', 'Conversations', targetConv!.id);
        }
      }, 1000);
    }
  };

  const generateAiReplyForThread = (conversationId: string) => {
    const targetConv = conversations.find(c => c.id === conversationId);
    if (!targetConv) return;
    const threadMsgs = chatMessages.filter(m => m.conversationId === conversationId);
    const lastUserMsg = [...threadMsgs].reverse().find(m => m.senderRole === 'family')?.content || 'Can you help us with arrangements?';

    const aiResponse = generateAiFuneralResponse(lastUserMsg, targetConv, whatsAppSettings);

    const aiMsg: ChatMessage = {
      id: `msg-ai-${Date.now()}`,
      conversationId,
      senderName: `Evergreen AI Care Assistant (${whatsAppSettings.aiModel})`,
      senderRole: 'ai',
      avatar: '🤖',
      channel: targetConv.preferredChannel,
      content: aiResponse.messageText,
      timestamp: 'Just now',
      read: true,
      deliveryStatus: 'sent',
      aiAssisted: true
    };

    setChatMessages(prev => [...prev, aiMsg]);
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, lastMessage: aiResponse.messageText, lastMessageTime: 'Just now' } : c));
    addToast('AI Draft Response Generated & Sent!');
  };

  // CONVERSATIONS CRUD
  const sendChatMessage = (conversationId: string, content: string, channel: CommunicationChannel, attachments?: ChatAttachment[]) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderName: 'Marcus Vance',
      senderRole: 'staff',
      avatar: 'MV',
      channel,
      content,
      attachments,
      timestamp: 'Just now',
      read: true,
      deliveryStatus: 'sent'
    };

    setChatMessages(prev => [...prev, newMsg]);

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: content,
          lastMessageTime: 'Just now',
          preferredChannel: channel
        };
      }
      return c;
    }));

    const targetConv = conversations.find(c => c.id === conversationId);
    if (targetConv && targetConv.caseId) {
      const tlEvent: CaseTimelineEvent = {
        id: `tl-${Date.now()}`,
        caseId: targetConv.caseId,
        title: `${channel} Communication Sent`,
        description: `Director Marcus Vance sent a ${channel} message: "${content.slice(0, 60)}${content.length > 60 ? '...' : ''}"`,
        timestamp: new Date().toLocaleString(),
        author: 'Marcus Vance',
        type: 'status_changed'
      };
      setTimelineEvents(prev => [tlEvent, ...prev]);
    }

    addToast(`Message dispatched via ${channel}`);
  };

  const updateConversationStatus = (id: string, status: ConversationStatus) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    addToast(`Conversation status updated to ${status}`);
  };

  const togglePinConversation = (id: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, isPinned: !c.isPinned } : c));
    addToast('Conversation pin updated');
  };

  const archiveConversation = (id: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, status: 'Archived' } : c));
    addToast('Conversation archived', 'info');
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    setChatMessages(prev => prev.filter(m => m.conversationId !== id));
    if (activeConversationId === id) setActiveConversationId(null);
    addToast('Conversation thread deleted', 'warning');
  };

  const assignConversationStaff = (id: string, staffName: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, assignedStaffName: staffName } : c));
    addToast(`Assigned conversation to ${staffName}`);
  };

  const linkOrCreateFamilyForCase = (newCase: Case, caseNumber: string) => {
    const contactName = newCase.primaryContactName;
    const contactEmail = newCase.email;
    const contactPhone = newCase.phone;
    const contactRel = newCase.relationship;

    if (contactName) {
      setFamilies(prev => {
        const existingFamilyIndex = prev.findIndex(f => 
          (contactEmail && f.email && f.email === contactEmail) || 
          (contactPhone && f.phone && f.phone === contactPhone)
        );

        if (existingFamilyIndex !== -1) {
          const updated = [...prev];
          const fam = { ...updated[existingFamilyIndex] };
          const alreadyLinked = fam.linkedCases.some(lc => lc.caseId === newCase.id);
          if (!alreadyLinked) {
            fam.linkedCases = [...fam.linkedCases, { caseId: newCase.id, deceasedName: newCase.deceasedName, caseNumber }];
          }
          fam.lastActivity = `${newCase.createdAt} (Case Created)`;
          if (!fam.phone && contactPhone) fam.phone = contactPhone;
          if (!fam.email && contactEmail) fam.email = contactEmail;
          updated[existingFamilyIndex] = fam;
          return updated;
        } else {
          const newFamily: Family = {
            id: newCase.primaryContactId || `fam-${Date.now()}`,
            name: contactName,
            relationship: contactRel,
            phone: contactPhone || '',
            email: contactEmail || '',
            address: newCase.location || '',
            linkedCases: [{ caseId: newCase.id, deceasedName: newCase.deceasedName, caseNumber }],
            lastActivity: `${newCase.createdAt} (Case Created)`,
            notes: `Primary contact for case of ${newCase.deceasedName}.`
          };
          return [newFamily, ...prev];
        }
      });
    }
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

    // Automatically link or create Family profile
    linkOrCreateFamilyForCase(newCase, caseNumber);

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
    linkOrCreateFamilyForCase(copy, newNum);
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
        whatsAppSettings,
        updateWhatsAppSettings,
        receiveWhatsAppMessage,
        generateAiReplyForThread,
        conversations,
        chatMessages,
        activeConversationId,
        setActiveConversationId,
        sendChatMessage,
        updateConversationStatus,
        togglePinConversation,
        archiveConversation,
        deleteConversation,
        assignConversationStaff,
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
