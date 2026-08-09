import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCommunities } from '../services/communities';
import { CommunityCard } from '../components/CommunityCard';
import { PageHeader } from '../components/PageHeader';

export function Communities() {
  const { data: communities = [] } = useQuery({ queryKey: ['communities'], queryFn: fetchCommunities });

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Department Technical Communities"
        subtitle="Explore flagship associations, research labs, student chapters, and leadership teams."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((c) => (
          <CommunityCard key={c.id} community={c} />
        ))}
      </div>
    </div>
  );
}

export default Communities;
