import React, { createContext, useContext, useEffect, useState } from 'react';
import { competenciesByRole } from '../data/competencies';

const STORAGE_KEY = 'career_app_v1';

const AppContext = createContext();
export function useApp(){ return useContext(AppContext) }

export function AppProvider({children}){
  const [teams, setTeams] = useState(()=> {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY))?.teams || [] } catch { return [] }
  });

  useEffect(()=> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ teams }));
  }, [teams]);

  const addTeam = (team) => {
    const t = { id: Date.now(), ...team, members: [] };
    setTeams(prev=>[...prev,t]);
    return t;
  };

  const addMember = (teamId, member) => {
    setTeams(prev=> prev.map(t=> t.id===teamId ? {...t, members:[...t.members, {...member, id: Date.now(), evaluations:{Q1:{},Q2:{},Q3:{},Q4:{}}, evidence:{Q1:{},Q2:{},Q3:{},Q4:{}}}]} : t));
  };

  const updateMember = (teamId, memberId, patch) => {
    setTeams(prev=> prev.map(t=> {
      if(t.id!==teamId) return t;
      return {...t, members: t.members.map(m=> m.id===memberId ? {...m, ...patch} : m)};
    }))
  };

  const deleteTeam = (teamId) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  const deleteMember = (teamId, memberId) => {
    setTeams(prev=> prev.map(t=> {
      if(t.id!==teamId) return t;
      return {...t, members: t.members.filter(m=> m.id!==memberId)};
    }))
  };

  const getCompetencies = (role) => competenciesByRole[role] || competenciesByRole['developer'];

  return <AppContext.Provider value={{ teams, addTeam, addMember, updateMember, deleteTeam, deleteMember, getCompetencies }}>{children}</AppContext.Provider>
}
