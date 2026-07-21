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
  webhookSecret: 'elysium_wh_sec_9948120',
  isAutoResponderEnabled: true,
  aiModel: 'GPT-4o Funeral Care',
  aiTone: 'Empathetic & Dignified',
  autoCreateDraftCases: true
};

// INITIAL MOCK CONVERSATIONS & CHAT MESSAGES
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-101',
    familyId: 'fam-1',
    familyName: 'Sterling Family (Arthur Sterling)',
    familyPhone: '(206) 555-0192',
    familyEmail: 'arthur.sterling@example.com',
    caseId: 'case-101',
    caseNumber: 'FHC-2026-0841',
    deceasedName: 'Eleanor Vance Sterling',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Marcus Vance',
    status: 'Waiting for Family',
    isPinned: true,
    unreadCount: 1,
    lastMessage: 'We have approved the obituary text for the Seattle Times. Please proceed with publication.',
    lastMessageTime: '10:42 AM',
    preferredChannel: 'WhatsApp',
    isAiEnabled: true
  },
  {
    id: 'conv-102',
    familyId: 'fam-2',
    familyName: 'Harrison Family (Margaret Harrison)',
    familyPhone: '(425) 555-0144',
    familyEmail: 'm.harrison@example.com',
    caseId: 'case-102',
    caseNumber: 'FHC-2026-0842',
    deceasedName: 'Robert James Harrison',
    assignedStaffId: 'staff-2',
    assignedStaffName: 'Elena Rostova',
    status: 'Open',
    isPinned: false,
    unreadCount: 0,
    lastMessage: 'Thank you Director Rostova. The cremation authorization form has been signed digitally.',
    lastMessageTime: 'Yesterday',
    preferredChannel: 'Email',
    isAiEnabled: true
  },
  {
    id: 'conv-103',
    familyId: 'fam-3',
    familyName: 'Montgomery Family (Clara Montgomery)',
    familyPhone: '(206) 555-0873',
    familyEmail: 'clara.m@example.com',
    caseId: 'case-103',
    caseNumber: 'FHC-2026-0843',
    deceasedName: 'Harold Montgomery',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Marcus Vance',
    status: 'Waiting for Staff',
    isPinned: false,
    unreadCount: 2,
    lastMessage: 'Could we schedule the outdoor pavilion setup at 10 AM instead of 11 AM?',
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
    content: 'We have approved the obituary text for the Seattle Times. Please proceed with publication.',
    timestamp: 'Today 10:42 AM',
    read: false,
    deliveryStatus: 'delivered'
  }
];

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
  }
];

const INITIAL_TIMELINE: CaseTimelineEvent[] = [];
const INITIAL_TASKS: CaseTask[] = [];
const INITIAL_DOCS: CaseDocument[] = [];
const INITIAL_NOTES: CaseNote[] = [];
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
  }
];

const INITIAL_CALENDAR: CalendarEvent[] = [];
const INITIAL_INVOICES: Invoice[] = [];
const INITIAL_VEHICLES: Vehicle[] = [];
const INITIAL_INVENTORY: InventoryItem[] = [];
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
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [];

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
          senderName: `Elysium AI Care Assistant (${whatsAppSettings.aiModel})`,
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
      senderName: `Elysium AI Care Assistant (${whatsAppSettings.aiModel})`,
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
