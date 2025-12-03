import React, { createContext, useContext, useEffect, useState } from 'react';
import { competenciesByRole } from '../data/competencies';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './AuthContext';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AppContext = createContext();
export function useApp(){ return useContext(AppContext) }

export function AppProvider({children}){
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [allUsers, setAllUsers] = useState([]); // Solo usuarios online (para avatar card)
  const [allUsersForAdmin, setAllUsersForAdmin] = useState([]); // Todos los usuarios (para selector admin)

  // Verificar si el usuario actual es admin
  useEffect(() => {
    if (!user) {
      setIsAdminUser(false);
      return;
    }

    const checkIfAdmin = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', user.id)
          .single();

        setIsAdminUser(!error && data !== null);
      } catch (error) {
        setIsAdminUser(false);
      }
    };

    checkIfAdmin();
  }, [user]);

  // Cargar lista de usuarios conectados (online_users table) - Para avatar card con Realtime
  useEffect(() => {
    const loadOnlineUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('online_users')
          .select('id, email, full_name')
          .order('full_name, email');

        if (error) throw error;
        setAllUsers(data || []);
      } catch (error) {
        console.error('Error loading online users:', error);
        setAllUsers([]);
      }
    };

    loadOnlineUsers();

    // Suscribirse a cambios en tiempo real en la tabla online_users
    const onlineUsersSubscription = supabase
      .channel('online_users:all')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'online_users'
        },
        (payload) => {
          setAllUsers(prev => {
            if (payload.eventType === 'INSERT') {
              return [...prev, payload.new].sort((a, b) =>
                (a.full_name || a.email).localeCompare(b.full_name || b.email)
              );
            } else if (payload.eventType === 'UPDATE') {
              return prev.map(u => u.id === payload.new.id ? payload.new : u);
            } else if (payload.eventType === 'DELETE') {
              return prev.filter(u => u.id !== payload.old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(onlineUsersSubscription);
    };
  }, []);

  // Cargar lista de TODOS los usuarios (from users table) - Para selector admin con Realtime
  useEffect(() => {
    if (!isAdminUser) {
      setAllUsersForAdmin([]);
      return;
    }

    const loadAllUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, full_name')
          .order('full_name, email');

        if (error) throw error;
        setAllUsersForAdmin(data || []);
      } catch (error) {
        console.error('Error loading all users:', error);
        setAllUsersForAdmin([]);
      }
    };

    loadAllUsers();

    // Suscribirse a cambios en tiempo real en la tabla users
    const usersSubscription = supabase
      .channel('users:all')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users'
        },
        (payload) => {
          setAllUsersForAdmin(prev => {
            if (payload.eventType === 'INSERT') {
              return [...prev, payload.new].sort((a, b) =>
                (a.full_name || a.email).localeCompare(b.full_name || b.email)
              );
            } else if (payload.eventType === 'UPDATE') {
              return prev.map(u => u.id === payload.new.id ? payload.new : u);
            } else if (payload.eventType === 'DELETE') {
              return prev.filter(u => u.id !== payload.old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usersSubscription);
    };
  }, [isAdminUser]);

  // Cargar teams de Supabase cuando el usuario está autenticado y configurar Realtime
  useEffect(()=> {
    if (!user) {
      setTeams([]);
      setLoading(false);
      return;
    }

    const loadTeams = async () => {
      try {
        setLoading(true);

        // Si es admin y tiene usuario seleccionado, traer datos de ese usuario
        const userIdToLoad = isAdminUser && selectedUserId ? selectedUserId : user.id;

        const { data, error } = await supabase
          .from('teams')
          .select('*, members(*)')
          .eq('user_id', userIdToLoad);

        if (error) throw error;

        // Transformar datos de Supabase al formato de la app
        const formattedTeams = (data || []).map(team => ({
          ...team,
          members: (team.members || []).map(member => ({
            ...member,
            evaluations: { Q1: {}, Q2: {}, Q3: {}, Q4: {} },
            evidence: { Q1: {}, Q2: {}, Q3: {}, Q4: {} }
          }))
        }));

        setTeams(formattedTeams);
      } catch (error) {
        console.error('Error loading teams:', error);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    loadTeams();

    // Configurar Realtime subscriptions para cambios en tiempo real
    const userIdToLoad = isAdminUser && selectedUserId ? selectedUserId : user.id;

    // Suscribirse a cambios en la tabla teams
    const teamsSubscription = supabase
      .channel(`teams:user_id=eq.${userIdToLoad}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teams',
          filter: `user_id=eq.${userIdToLoad}`
        },
        (payload) => {
          setTeams(prev => {
            if (payload.eventType === 'INSERT') {
              return [...prev, { ...payload.new, members: [] }];
            } else if (payload.eventType === 'UPDATE') {
              return prev.map(t => t.id === payload.new.id ? { ...t, ...payload.new } : t);
            } else if (payload.eventType === 'DELETE') {
              return prev.filter(t => t.id !== payload.old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    // Suscribirse a cambios en la tabla members
    const membersSubscription = supabase
      .channel('members:all')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members'
        },
        (payload) => {
          setTeams(prev => {
            return prev.map(team => {
              if (payload.eventType === 'INSERT' && payload.new.team_id === team.id) {
                return {
                  ...team,
                  members: [...(team.members || []), {
                    ...payload.new,
                    evaluations: { Q1: {}, Q2: {}, Q3: {}, Q4: {} },
                    evidence: { Q1: {}, Q2: {}, Q3: {}, Q4: {} }
                  }]
                };
              } else if (payload.eventType === 'UPDATE') {
                return {
                  ...team,
                  members: team.members.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m)
                };
              } else if (payload.eventType === 'DELETE') {
                return {
                  ...team,
                  members: team.members.filter(m => m.id !== payload.old.id)
                };
              }
              return team;
            });
          });
        }
      )
      .subscribe();

    // Limpiar subscriptions cuando se desmonta o cambian dependencias
    return () => {
      supabase.removeChannel(teamsSubscription);
      supabase.removeChannel(membersSubscription);
    };
  }, [user, isAdminUser, selectedUserId]);

  const addTeam = async (team) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{ ...team, user_id: user.id }])
        .select();

      if (error) throw error;

      const newTeam = data[0];
      // Don't update state here - let Realtime subscription handle it
      // This prevents duplication since Realtime also fires on INSERT
      return newTeam;
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const addMember = async (teamId, member) => {
    try {
      // Convertir camelCase a snake_case para Supabase
      const memberData = {
        name: member.name,
        email: member.email,
        role: member.role,
        level: member.level,
        level_target: member.levelTarget,
        team_id: teamId
      };

      const { data, error } = await supabase
        .from('members')
        .insert([memberData])
        .select();

      if (error) {
        console.error('Supabase error adding member:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.error('No data returned from insert');
        throw new Error('No se guardó el miembro');
      }

      const newMember = data[0];
      // Don't update state here - let Realtime subscription handle it
      // This prevents duplication since Realtime also fires on INSERT
      return newMember;
    } catch (error) {
      console.error('Error adding member:', error);
      alert(`Error al agregar miembro: ${error.message || 'Error desconocido'}`);
      throw error;
    }
  };

  const updateMember = async (teamId, memberId, patch) => {
    try {
      const { error } = await supabase
        .from('members')
        .update(patch)
        .eq('id', memberId);

      if (error) throw error;

      // Don't update state here - let Realtime subscription handle it
      // This prevents unnecessary state updates and potential conflicts
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const deleteTeam = async (teamId) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;

      setTeams(prev => prev.filter(t => t.id !== teamId));
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const deleteMember = async (teamId, memberId) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      // Don't update state here - let Realtime subscription handle it
      // This prevents race conditions and duplicate deletions
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const getCompetencies = (role) => competenciesByRole[role] || competenciesByRole['developer'];

  // Mark user as online when they log in
  const markUserOnline = async (userId, email) => {
    try {
      // Fetch user data from users table to get full_name
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, full_name')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const { error } = await supabase
        .from('online_users')
        .upsert({
          id: userId,
          email: userData.email,
          full_name: userData.full_name,
          last_activity: new Date(),
          updated_at: new Date()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error marking user online:', error);
    }
  };

  // Update user's last activity
  const updateUserActivity = async (userId) => {
    try {
      const { error } = await supabase
        .from('online_users')
        .update({ last_activity: new Date(), updated_at: new Date() })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user activity:', error);
    }
  };

  // Mark user as offline when they log out
  const markUserOffline = async (userId) => {
    try {
      const { error } = await supabase
        .from('online_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking user offline:', error);
    }
  };

  return <AppContext.Provider value={{
    teams,
    addTeam,
    addMember,
    updateMember,
    deleteTeam,
    deleteMember,
    getCompetencies,
    isAdminUser,
    selectedUserId,
    setSelectedUserId,
    allUsers, // Solo usuarios online (para avatar card)
    allUsersForAdmin, // Todos los usuarios (para selector admin)
    markUserOnline,
    updateUserActivity,
    markUserOffline
  }}>{children}</AppContext.Provider>
}
