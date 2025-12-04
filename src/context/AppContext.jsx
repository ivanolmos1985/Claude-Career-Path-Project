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
              // Evitar duplicados: verifica si el equipo ya existe
              const teamExists = prev.some(t => t.id === payload.new.id);
              if (teamExists) return prev;
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
                // Evitar duplicados: verifica si el miembro ya existe
                const memberExists = team.members.some(m => m.id === payload.new.id);
                if (memberExists) return team;

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
      setTeams(prev => [...prev, { ...newTeam, members: [] }]);
      return newTeam;
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const updateTeam = async (teamId, patch) => {
    try {
      const { error } = await supabase
        .from('teams')
        .update(patch)
        .eq('id', teamId);

      if (error) throw error;

      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, ...patch } : t));
    } catch (error) {
      console.error('Error updating team:', error);
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
      setTeams(prev => prev.map(t =>
        t.id === teamId
          ? {...t, members: [...(t.members || []), {...newMember, evaluations:{Q1:{},Q2:{},Q3:{},Q4:{}}, evidence:{Q1:{},Q2:{},Q3:{},Q4:{}}}]}
          : t
      ));
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

      setTeams(prev=> prev.map(t=> {
        if(t.id!==teamId) return t;
        return {...t, members: t.members.map(m=> m.id===memberId ? {...m, ...patch} : m)};
      }))
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

      setTeams(prev=> prev.map(t=> {
        if(t.id!==teamId) return t;
        return {...t, members: t.members.filter(m=> m.id!==memberId)};
      }))
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

  // ============================================================================
  // COMPETENCY MANAGEMENT FUNCTIONS
  // ============================================================================

  const addCompetency = async (teamId, competencyData) => {
    try {
      const { name, description, weight } = competencyData;

      // Generate competency ID from name
      const competencyId = `team_${teamId}_${name.toLowerCase().replace(/\s+/g, '_')}`;

      const { error } = await supabase
        .from('competencies')
        .insert({
          id: competencyId,
          name,
          role: 'custom', // Mark as custom competency
          weight,
          team_id: teamId,
          is_deleted: false
        });

      if (error) throw error;

      // Update teams state
      setTeams(prev => prev.map(t => {
        if (t.id !== teamId) return t;
        return {
          ...t,
          competencies: [...(t.competencies || []), {
            id: competencyId,
            name,
            weight,
            team_id: teamId,
            role: 'custom'
          }]
        };
      }));
    } catch (error) {
      console.error('Error adding competency:', error);
      throw error;
    }
  };

  const updateCompetency = async (competencyId, patch) => {
    try {
      const { error } = await supabase
        .from('competencies')
        .update(patch)
        .eq('id', competencyId);

      if (error) throw error;

      // Update teams state
      setTeams(prev => prev.map(t => ({
        ...t,
        competencies: (t.competencies || []).map(c =>
          c.id === competencyId ? { ...c, ...patch } : c
        )
      })));
    } catch (error) {
      console.error('Error updating competency:', error);
      throw error;
    }
  };

  const deleteCompetency = async (competencyId) => {
    try {
      // Soft delete: mark as deleted instead of hard delete
      const { error } = await supabase
        .from('competencies')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          deleted_by: user.id
        })
        .eq('id', competencyId);

      if (error) throw error;

      // Update teams state
      setTeams(prev => prev.map(t => ({
        ...t,
        competencies: (t.competencies || []).filter(c => c.id !== competencyId)
      })));
    } catch (error) {
      console.error('Error deleting competency:', error);
      throw error;
    }
  };

  // ============================================================================
  // TASK MANAGEMENT FUNCTIONS
  // ============================================================================

  const addTask = async (competencyId, taskData) => {
    try {
      const { name, description, teamId } = taskData;

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          competency_id: competencyId,
          team_id: teamId || null,
          name,
          description: description || null,
          display_order: 0,
          is_active: true
        })
        .select();

      if (error) throw error;

      return data[0];
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId, patch) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(patch)
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const getTasksForCompetency = async (competencyId) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('competency_id', competencyId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  };

  // ============================================================================
  // TASK EVALUATION FUNCTIONS
  // ============================================================================

  const setTaskRating = async (memberId, taskId, quarter, rating) => {
    try {
      const { error } = await supabase
        .from('task_evaluations')
        .upsert({
          member_id: memberId,
          task_id: taskId,
          quarter,
          rating
        }, { onConflict: 'member_id,task_id,quarter' });

      if (error) throw error;
    } catch (error) {
      console.error('Error setting task rating:', error);
      throw error;
    }
  };

  const getTaskEvaluations = async (memberId, quarter) => {
    try {
      const { data, error } = await supabase
        .from('task_evaluations')
        .select('*')
        .eq('member_id', memberId)
        .eq('quarter', quarter);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching task evaluations:', error);
      return [];
    }
  };

  // ============================================================================
  // FILE UPLOAD FUNCTIONS
  // ============================================================================

  const uploadEvidenceFile = async (file, metadata) => {
    try {
      const { memberId, quarter, taskId } = metadata;

      if (!file) throw new Error('No file provided');

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                           'image/jpeg', 'image/png', 'image/gif'];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not allowed. Use PDF, DOCX, XLSX, JPG, PNG, or GIF');
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds 10MB limit');
      }

      // Generate file path
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = `${user.id}/${memberId}/${quarter}/${taskId}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('evaluation-evidence')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('evaluation-evidence')
        .getPublicUrl(filePath);

      const fileUrl = urlData.publicUrl;

      // Save file reference to database
      const { error: dbError } = await supabase
        .from('evidence_files')
        .insert({
          task_id: taskId,
          file_url: fileUrl,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: user.id
        });

      if (dbError) throw dbError;

      return {
        url: fileUrl,
        name: file.name,
        type: file.type,
        size: file.size
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const deleteEvidenceFile = async (fileUrl, evidenceFileId) => {
    try {
      // Delete from storage
      const pathMatch = fileUrl.match(/evaluation-evidence\/(.+)$/);
      if (pathMatch) {
        await supabase.storage
          .from('evaluation-evidence')
          .remove([pathMatch[1]]);
      }

      // Delete from database
      const { error } = await supabase
        .from('evidence_files')
        .delete()
        .eq('id', evidenceFileId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  const getEvidenceFiles = async (taskId) => {
    try {
      const { data, error } = await supabase
        .from('evidence_files')
        .select('*')
        .eq('task_id', taskId);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching evidence files:', error);
      return [];
    }
  };

  // ============================================================================
  // WEIGHT MANAGEMENT FUNCTIONS
  // ============================================================================

  const getTeamWeights = async (teamId) => {
    try {
      const { data, error } = await supabase
        .from('team_competency_weights')
        .select('*')
        .eq('team_id', teamId);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching team weights:', error);
      return [];
    }
  };

  const updateTeamWeights = async (teamId, competencyId, weight) => {
    try {
      const { error } = await supabase
        .from('team_competency_weights')
        .upsert({
          team_id: teamId,
          competency_id: competencyId,
          weight
        }, { onConflict: 'team_id,competency_id' });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating team weights:', error);
      throw error;
    }
  };

  return <AppContext.Provider value={{
    teams,
    addTeam,
    updateTeam,
    addMember,
    updateMember,
    deleteTeam,
    deleteMember,
    getCompetencies,
    isAdminUser,
    selectedUserId,
    setSelectedUserId,
    allUsers,
    allUsersForAdmin,
    markUserOnline,
    updateUserActivity,
    markUserOffline,
    addCompetency,
    updateCompetency,
    deleteCompetency,
    addTask,
    updateTask,
    deleteTask,
    getTasksForCompetency,
    setTaskRating,
    getTaskEvaluations,
    uploadEvidenceFile,
    deleteEvidenceFile,
    getEvidenceFiles,
    getTeamWeights,
    updateTeamWeights
  }}>{children}</AppContext.Provider>
}
