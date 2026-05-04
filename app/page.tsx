import type { Metadata } from 'next';
import { ArchitectureOutlierHome } from '@/components/home/ArchitectureOutlierSite';

export const metadata: Metadata = {
  title: 'Architecture Outlier',
  description:
    'Discover alternate career paths taken by architects, from art to tech, food to fashion.',
};

export default function HomePage() {
  return <ArchitectureOutlierHome />;
}
