import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext()
export function useAuth(){ return useContext(AuthContext) }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile data from database
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name')
        .eq('id', userId)
        .single()

      if (error) {
        // Si el usuario no existe en la base de datos, cerrar sesión
        if (error.code === 'PGRST116' || error.message?.includes('No rows found')) {
          console.warn('User profile not found in database, logging out')
          await supabase.auth.signOut()
          setUser(null)
          setUserProfile(null)
        }
        throw error
      }
      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUserProfile(null)
    }
  }

  useEffect(() => {
    // obtiene sesión inicial
    supabase.auth.getSession().then(({ data }) => {
      const authUser = data?.session?.user ?? null
      setUser(authUser)
      if (authUser?.id) {
        fetchUserProfile(authUser.id)
      }
      setLoading(false)
    })

    // escucha cambios en auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user ?? null
      setUser(authUser)
      if (authUser?.id) {
        fetchUserProfile(authUser.id)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) throw error
    return true
  }

  const signIn = async (email, password) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) throw error
    setUser(data.user)
    return data.user
  }

  const signOut = async () => {
    // Mark user offline before signing out
    if (user?.id) {
      try {
        await supabase
          .from('online_users')
          .delete()
          .eq('id', user.id)
      } catch (error) {
        console.error('Error marking user offline:', error)
      }
    }

    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
