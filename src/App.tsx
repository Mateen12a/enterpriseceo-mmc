/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ApplyModalProvider } from './context/ApplyModalContext';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { EventFlier } from './components/EventFlier';
import { 
  BackgroundRationale, 
  ProgrammeObjectives, 
  TargetAudience, 
  ProgrammeStructure
} from './components/Sections';
import { Curriculum } from './components/Curriculum';
import { Faculty } from './components/Faculty';
import { 
  LogisticsParticipation, 
  Sponsorship, 
  Conclusion 
} from './components/Sections2';
import { AdminDashboard } from './admin/AdminDashboard';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    return (
      window.location.pathname === '/admin' ||
      window.location.hash === '#admin' ||
      window.location.search.includes('admin=true')
    );
  });

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminView(
        window.location.pathname === '/admin' ||
        window.location.hash === '#admin' ||
        window.location.search.includes('admin=true')
      );
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenAdmin = () => {
    setIsAdminView(true);
    window.history.pushState({}, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPublic = () => {
    setIsAdminView(false);
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAdminView) {
    return <AdminDashboard onBackToPublic={handleBackToPublic} />;
  }

  return (
    <ApplyModalProvider>
      <Layout onOpenAdmin={handleOpenAdmin}>
        <Hero />
        <EventFlier />
        <BackgroundRationale />
        <ProgrammeObjectives />
        <TargetAudience />
        <ProgrammeStructure />
        <Curriculum />
        <Faculty />
        <LogisticsParticipation />
        <Sponsorship />
        <Conclusion />
      </Layout>
    </ApplyModalProvider>
  );
}
