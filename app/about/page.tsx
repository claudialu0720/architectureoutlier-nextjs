import type { Metadata } from 'next';
import { ArchitectureOutlierAbout } from '@/components/home/ArchitectureOutlierSite';

export const metadata: Metadata = {
  title: 'Architecture Outlier | About',
  description:
    'About Architecture Outlier, a platform for architects exploring alternate career paths.',
};

export default function AboutPage() {
  return <ArchitectureOutlierAbout />;
}
