import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/common/Toast';
import { SourceViewerDrawer } from './components/common/SourceViewerDrawer';
import { SovereigntyMonitorModal } from './components/common/SovereigntyMonitorModal';
import { JudgeDemoTour } from './components/common/JudgeDemoTour';

// Pages
import { AIWorkbench } from './components/pages/AIWorkbench';
import { Tasks } from './components/pages/Tasks';
import { Documents } from './components/pages/Documents';
import { KnowledgeBase } from './components/pages/KnowledgeBase';
import { Approvals } from './components/pages/Approvals';
import { Reviews } from './components/pages/Reviews';
import { CodeSandbox } from './components/pages/CodeSandbox';
import { AuditLogs } from './components/pages/AuditLogs';
import { Overview } from './components/pages/Overview';
import { RolePermissionMatrix } from './components/pages/RolePermissionMatrix';
import { AICapabilityFirewall } from './components/pages/AICapabilityFirewall';
import { ModelRegistry } from './components/pages/ModelRegistry';
import { Policies } from './components/pages/Policies';
import { SecurityCenter } from './components/pages/SecurityCenter';
import { NetworkPage } from './components/pages/NetworkPage';
import { Login } from './components/pages/Login';

const MainLayout: React.FC = () => {
  const { activePage, currentUser, canViewPage } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentUser) {
    return <Login />;
  }

  const renderContent = () => {
    // If the active page is unauthorized for the current user, fallback to authorized workbench
    if (!canViewPage(activePage)) {
      return <AIWorkbench />;
    }

    switch (activePage) {
      case 'workbench':
        return <AIWorkbench />;
      case 'tasks':
        return <Tasks />;
      case 'documents':
        return <Documents />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'approvals':
        return <Approvals />;
      case 'reviews':
        return <Reviews />;
      case 'code-sandbox':
        return <CodeSandbox />;
      case 'audit-history':
        return <AuditLogs />;
      case 'admin-overview':
        return <Overview />;
      case 'admin-roles':
        return <RolePermissionMatrix />;
      case 'admin-firewall':
        return <AICapabilityFirewall />;
      case 'admin-models':
        return <ModelRegistry />;
      case 'admin-policies':
        return <Policies />;
      case 'admin-security':
        return <SecurityCenter />;
      case 'admin-network':
        return <NetworkPage />;
      case 'admin-audit':
        return <AuditLogs />;
      default:
        return <AIWorkbench />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Header */}
      <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      {/* Main App Body with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dynamic RBAC-Filtered Sidebar */}
        <Sidebar 
          isMobileOpen={isMobileMenuOpen} 
          onCloseMobile={() => setIsMobileMenuOpen(false)} 
        />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-[#F8FAFC]">
          {renderContent()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <Toast />
      <SourceViewerDrawer />
      <SovereigntyMonitorModal />
      <JudgeDemoTour />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
