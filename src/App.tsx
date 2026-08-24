import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/common/Toast';

import { Login } from './components/pages/Login';
import { Dashboard } from './components/pages/Dashboard';
import { AIWorkbench } from './components/pages/AIWorkbench';
import { Documents } from './components/pages/Documents';
import { ImageAnalysis } from './components/pages/ImageAnalysis';
import { Investigations } from './components/pages/Investigations';
import { Approvals } from './components/pages/Approvals';
import { PolicyEngine } from './components/pages/PolicyEngine';
import { ModelGovernance } from './components/pages/ModelGovernance';
import { AuditLogs } from './components/pages/AuditLogs';
import { SecurityCenter } from './components/pages/SecurityCenter';
import { ArchitectureVis } from './components/pages/ArchitectureVis';
import { PromptInjectionDemo } from './components/pages/PromptInjectionDemo';
import { SensorData } from './components/pages/SensorData';
import { Reports } from './components/pages/Reports';
import { GenericAdminPage } from './components/pages/GenericAdminPage';
import { Users, Network, Bot, Wrench, Database } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, activePage, isInternetSimulatedOffline } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentUser) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'workbench':
        return <AIWorkbench />;
      case 'documents':
        return <Documents />;
      case 'image-analysis':
        return <ImageAnalysis />;
      case 'investigations':
        return <Investigations />;
      case 'sensor-data':
        return <SensorData />;
      case 'approvals':
        return <Approvals />;
      case 'reports':
        return <Reports />;
      case 'policies':
        return <PolicyEngine />;
      case 'models':
        return <ModelGovernance />;
      case 'audit-logs':
        return <AuditLogs />;
      case 'security':
        return <SecurityCenter />;
      case 'architecture':
        return <ArchitectureVis />;
      case 'prompt-injection':
        return <PromptInjectionDemo />;
      case 'users':
        return (
          <GenericAdminPage 
            pageId="users" 
            title="User Management & RBAC Identities" 
            subtitle="Configure active user accounts, MFA parameters, and department assignments." 
            icon={<Users className="w-4 h-4" />} 
          />
        );
      case 'roles-departments':
        return (
          <GenericAdminPage 
            pageId="roles-departments" 
            title="Roles & Departments Governance" 
            subtitle="Define permissions matrices for Engineer, Manager, Maintenance, and Admin roles." 
            icon={<Network className="w-4 h-4" />} 
          />
        );
      case 'agents':
        return (
          <GenericAdminPage 
            pageId="agents" 
            title="Autonomous Agents Registry" 
            subtitle="Register retrieval, inspection, and verification agent nodes." 
            icon={<Bot className="w-4 h-4" />} 
          />
        );
      case 'tools':
        return (
          <GenericAdminPage 
            pageId="tools" 
            title="Agent Tool Authorization" 
            subtitle="Grant or revoke tool access to vector search, vision inference, and sensor logs." 
            icon={<Wrench className="w-4 h-4" />} 
          />
        );
      case 'knowledge-base':
        return (
          <GenericAdminPage 
            pageId="knowledge-base" 
            title="RAG Knowledge Vector Index" 
            subtitle="Inspect vector index chunking, dense embeddings, and document graph." 
            icon={<Database className="w-4 h-4" />} 
          />
        );
      default:
        return <AIWorkbench />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Offline Mode Alert Banner */}
      {isInternetSimulatedOffline && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 text-center text-xs font-mono font-bold text-amber-300 flex items-center justify-center gap-2">
          <span>🟠 AIR-GAPPED OFFLINE MODE:</span>
          <span className="font-normal">Core SovereignForge workflows remain available without internet connectivity.</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar 
          isMobileOpen={isMobileMenuOpen} 
          onCloseMobile={() => setIsMobileMenuOpen(false)} 
        />

        {/* Main Content Body */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-16 lg:pb-0">
          <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          
          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>

      <Toast />
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
