import React from 'react';
import { ArrowLeft, Crown, Star, FileText, Wallet, Code, Palette, BookOpen, Megaphone, GraduationCap } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCommunityById } from '../services/communities';
import { getCommunity } from '../data/mock';
import { Avatar } from '../components/Avatar';
import { PageHeader } from '../components/PageHeader';

const roleIcon = {
  'Faculty Mentor': GraduationCap,
  Chairperson: Crown,
  'Vice Chairperson': Star,
  Secretary: FileText,
  Treasurer: Wallet,
  'Technical Head': Code,
  'Creative Head': Palette,
  'Documentation Head': BookOpen,
  'PR Head': Megaphone,
};

export function TeamManagement() {
  const { communityId = 'asac' } = useParams();
  const navigate = useNavigate();

  const { data: community = getCommunity(communityId) } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => fetchCommunityById(communityId),
  });

  if (!community) return null;

  const leadership = [
    { ...(community.facultyMentor || { name: 'Dr. Anjali Mehra' }), role: 'Faculty Mentor', tier: 'mentor' },
    { ...(community.chairperson || { name: 'Aditya Sharma' }), role: 'Chairperson', tier: 'lead' },
    { ...(community.viceChairperson || { name: 'Priya Iyengar' }), role: 'Vice Chairperson', tier: 'lead' },
    { ...(community.secretary || { name: 'Rohan Verma' }), role: 'Secretary', tier: 'lead' },
  ];

  const committeeList = community.committee || [];
  const heads = committeeList.filter((m) => m.role && m.role.endsWith('Head'));
  const volunteers = committeeList.filter((m) => m.role === 'Volunteer' || m.role === 'Treasurer');

  return (
    <div className="animate-fade-in space-y-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink-500 hover:text-ink-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-ink-200/70 shadow-soft">
        <div
          className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${
            community.gradient || 'from-royal-500 to-royal-700'
          } flex items-center justify-center text-white font-extrabold text-xl shadow-xs`}
        >
          {community.code}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink-900 font-display">Team Hierarchy & Roles</h1>
          <p className="text-ink-500 text-sm">{community.name} · {community.members || 248} members</p>
        </div>
      </div>

      {/* Leadership */}
      <div className="bg-white rounded-2xl border border-ink-200/70 p-6 shadow-soft space-y-4">
        <h2 className="font-bold text-ink-900 text-lg font-display">Executive Leadership</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leadership.map((p) => {
            const Icon = roleIcon[p.role] || Star;
            return (
              <div
                key={p.role}
                className={`p-5 rounded-2xl text-center shadow-xs border ${
                  p.tier === 'mentor' ? 'bg-ink-950 text-white border-ink-900' : 'bg-ink-50 border-ink-100 text-ink-900'
                }`}
              >
                <div className="flex justify-center mb-3">
                  <Avatar name={p.name} color={p.tier === 'mentor' ? 'ink' : community.color || 'royal'} size="lg" />
                </div>
                <p className={`font-bold text-sm ${p.tier === 'mentor' ? 'text-white' : 'text-ink-900'}`}>{p.name}</p>
                <p className={`text-xs mt-1 flex items-center justify-center gap-1 font-medium ${p.tier === 'mentor' ? 'text-white/70' : 'text-ink-500'}`}>
                  <Icon className="h-3.5 w-3.5 text-royal-500" /> {p.role}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Committee Heads */}
      <div className="bg-white rounded-2xl border border-ink-200/70 p-6 shadow-soft space-y-4">
        <h2 className="font-bold text-ink-900 text-lg font-display">Domain Heads & Leads</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {heads.map((m) => {
            const Icon = roleIcon[m.role] || Star;
            return (
              <div key={m.name} className="flex items-center gap-3 p-4 rounded-xl border border-ink-200/60 bg-white hover:bg-ink-50 transition-colors">
                <Avatar name={m.name} color={m.avatarColor || 'royal'} size="md" />
                <div className="min-w-0">
                  <p className="font-semibold text-ink-900 text-sm">{m.name}</p>
                  <p className="text-xs text-ink-500 flex items-center gap-1 mt-0.5 font-medium">
                    <Icon className="h-3.5 w-3.5 text-royal-600" /> {m.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Volunteers */}
      <div className="bg-white rounded-2xl border border-ink-200/70 p-6 shadow-soft space-y-4">
        <h2 className="font-bold text-ink-900 text-lg font-display">Active Volunteers</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {volunteers.map((m) => (
            <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl bg-ink-50 border border-ink-100/50">
              <Avatar name={m.name} color={m.avatarColor || 'royal'} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink-900 truncate">{m.name}</p>
                <p className="text-xs text-ink-400">{m.role || 'Volunteer'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamManagement;
