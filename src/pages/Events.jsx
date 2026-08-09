import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { fetchEvents } from '../services/events';
import { fetchCommunities } from '../services/communities';
import { EventCard } from '../components/EventCard';
import { PageHeader } from '../components/PageHeader';

export function Events() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [query, setQuery] = useState(initialSearch);
  const [communityFilter, setCommunityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const { data: communities = [] } = useQuery({ queryKey: ['communities'], queryFn: fetchCommunities });

  const filteredEvents = events.filter((e) => {
    if (query && !e.title.toLowerCase().includes(query.toLowerCase()) && !e.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))) {
      return false;
    }
    if (communityFilter !== 'all' && e.communityId !== communityFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    return true;
  });

  const statuses = ['Open', 'Filling Fast', 'Closed'];

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Department Events" subtitle="Discover, filter, and register for technical bootcamps, hackathons, and challenges." />

      {/* Filter Toolbar */}
      <div className="bg-surface rounded-2xl border border-border/70 p-4 shadow-soft">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-surface-muted flex-1 border border-border/50">
            <Search className="h-4 w-4 text-fg-faint flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, topics, or tags..."
              className="bg-transparent outline-none text-sm flex-1 text-fg placeholder:text-fg-faint"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={communityFilter}
              onChange={(e) => setCommunityFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-surface-muted text-sm text-fg border border-border/50 outline-none cursor-pointer font-medium"
            >
              <option value="all">All Communities</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-surface-muted text-sm text-fg border border-border/50 outline-none cursor-pointer font-medium"
            >
              <option value="all">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-fg-faint px-1 font-medium">
        <span className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Showing {filteredEvents.length} event{filteredEvents.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Events Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="bg-surface rounded-2xl border border-border/70 p-12 text-center text-fg-faint text-sm">
          No events found matching your search parameters.
        </div>
      )}
    </div>
  );
}

export default Events;
