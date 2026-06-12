import { useState, useEffect } from "react";
import { s as supabase } from "./client-DcL2yrVT.js";
function useAuth() {
  const [state, setState] = useState({
    session: null,
    user: null,
    loading: true
  });
  useEffect(() => {
    let mounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setState({ session, user: session?.user ?? null, loading: false });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setState({ session: data.session, user: data.session?.user ?? null, loading: false });
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  return state;
}
export {
  useAuth as u
};
