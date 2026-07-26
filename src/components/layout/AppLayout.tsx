import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DetailDrawer } from './DetailDrawer';
import { CreateCaseModal } from '../modals/CreateCaseModal';
import { ToastContainer } from '../common/ToastContainer';
import { ConfirmDialog } from '../common/ConfirmDialog';

import { DashboardView } from '../dashboard/DashboardView';
import { CasesView } from '../cases/CasesView';
import { FamiliesView } from '../families/FamiliesView';
import { ConversationsView } from '../conversations/ConversationsView';
import { AIAssistantView } from '../ai/AIAssistantView';
import { CalendarView } from '../calendar/CalendarView';
import { TasksView } from '../tasks/TasksView';
import { DocumentsView } from '../documents/DocumentsView';
import { InvoicesView } from '../invoices/InvoicesView';
import { StaffView } from '../staff/StaffView';
import { ReportsView } from '../reports/ReportsView';
import { SettingsView } from '../settings/SettingsView';

export const AppLayout: React.FC = () => {
  const { currentModule } = useCRM();

  const renderModuleView = () => {
    switch (currentModule) {
      case 'Dashboard':
        return <DashboardView />;
      case 'Cases':
        return <CasesView />;
      case 'Families':
        return <FamiliesView />;
      case 'Communications':
        return <ConversationsView />;
      case 'AI Assistant':
        return <AIAssistantView />;
      case 'Calendar':
        return <CalendarView />;
      case 'Tasks':
        return <TasksView />;
      case 'Documents':
        return <DocumentsView />;
      case 'Financials':
        return <InvoicesView />;
      case 'Staff & Resources':
        return <StaffView />;
      case 'Reports':
        return <ReportsView />;
      case 'Settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <Header />
        <main className="main-content">
          {renderModuleView()}
        </main>
      </div>

      <DetailDrawer />
      <CreateCaseModal />
      <ToastContainer />
      <ConfirmDialog />
    </div>
  );
};
