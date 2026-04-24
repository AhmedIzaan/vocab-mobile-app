import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const GUEST_KEY = 'vocab:guestMode';

export function useAuth() {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const pendingUsername = useRef(null);

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data;
  }, []);

  useEffect(() => {
    (async () => {
      // Restore guest mode
      const guestStored = await AsyncStorage.getItem(GUEST_KEY);
      if (guestStored === 'true') setIsGuest(true);

      // Restore existing session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        setUser(session.user);
        setProfile(p);
        await AsyncStorage.removeItem(GUEST_KEY);
        setIsGuest(false);
      }
      setLoading(false);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') return;

        if (!session?.user) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setLoading(true);

        let p = await fetchProfile(session.user.id);

        if (pendingUsername.current && p) {
          await supabase
            .from('profiles')
            .update({ username: pendingUsername.current })
            .eq('id', session.user.id);
          pendingUsername.current = null;
          p = await fetchProfile(session.user.id);
        }

        setUser(session.user);
        setProfile(p);
        await AsyncStorage.removeItem(GUEST_KEY);
        setIsGuest(false);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = useCallback(async (email, password, username) => {
    pendingUsername.current = username || null;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) pendingUsername.current = null;
    return { error };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem(GUEST_KEY);
    setIsGuest(false);
  }, []);

  const continueAsGuest = useCallback(async () => {
    await AsyncStorage.setItem(GUEST_KEY, 'true');
    setIsGuest(true);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return { error: new Error('No user') };
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (!error) setProfile(data);
    return { data, error };
  }, [user]);

  return { user, profile, loading, isGuest, signUp, signIn, signOut, continueAsGuest, updateProfile };
}
