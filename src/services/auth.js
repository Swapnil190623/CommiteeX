import { supabase } from '../lib/supabase';
import { currentUser } from '../data/mock';

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return currentUser;
    }
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    return profile || {
      ...currentUser,
      email: user.email,
    };
  } catch (err) {
    return currentUser;
  }
}

export async function signIn({ email, password }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase auth fallback active:', err.message);
    return { user: currentUser };
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Sign out error:', err.message);
  }
}
