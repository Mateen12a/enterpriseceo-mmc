/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApplyModalProvider } from './context/ApplyModalContext';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { 
  BackgroundRationale, 
  ProgrammeObjectives, 
  TargetAudience, 
  ProgrammeStructure
} from './components/Sections';
import { Curriculum } from './components/Curriculum';
import { 
  LogisticsParticipation, 
  Sponsorship, 
  Conclusion 
} from './components/Sections2';

export default function App() {
  return (
    <ApplyModalProvider>
      <Layout>
        <Hero />
        <BackgroundRationale />
        <ProgrammeObjectives />
        <TargetAudience />
        <ProgrammeStructure />
        <Curriculum />
        <LogisticsParticipation />
        <Sponsorship />
        <Conclusion />
      </Layout>
    </ApplyModalProvider>
  );
}

