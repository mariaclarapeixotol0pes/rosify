// ============================================================
//  auth.js — Rosify
//  PASSO 1: Substitua as duas linhas abaixo pelas suas chaves
//  Encontre em: Supabase → Settings → API
// ============================================================

const SUPABASE_URL  = 'https://oeofgbvwqvykrjotjuot.supabase.co';
const SUPABASE_ANON = 'sb_publishable_uLIQ68wSL9tkJx0Afqqp3g_0IdVpOkN';

(function () {
  if (typeof window.supabase === 'undefined') {
    console.error('[Rosify] SDK Supabase não encontrado!');
    return;
  }

  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

  window.rosifyAuth = {
    client: db,

    async loginWithEmail(email, password) {
      const { data, error } = await db.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },

    async signUpWithEmail(email, password) {
      const { data, error } = await db.auth.signUp({ email, password });
      if (error) throw error;
      return data;
    },

    async loginWithGoogle() {
      const { error } = await db.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${location.origin}/dashboard.html` },
      });
      if (error) throw error;
    },

    async sendPasswordReset(email) {
      const { error } = await db.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/reset-password.html`,
      });
      if (error) throw error;
    },

    async updatePassword(newPassword) {
      const { error } = await db.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },

    async logout() {
      await db.auth.signOut();
      location.href = 'index.html';
    },

    async getSession() {
      const { data } = await db.auth.getSession();
      return data.session;
    },

    async requireAuth() {
      const session = await this.getSession();
      if (!session) { location.href = 'index.html'; return null; }
      return session;
    },

    async redirectIfLoggedIn() {
      const session = await this.getSession();
      if (session) location.href = 'dashboard.html';
    },
  };
})();