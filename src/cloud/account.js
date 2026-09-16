export async function mountAccount({ onSession = async () => {} } = {}) {
  const host = document.getElementById('cloud-account');
  if (!globalThis.GARGOTTEX_CONFIG?.neonUrl) return;
  const { createCloudClient } = await import('./client.js');
  const client = createCloudClient(globalThis.GARGOTTEX_CONFIG.neonUrl);
  if (!host || !client) return;
  host.innerHTML = '<details><summary>Compte et sauvegarde distante — <span id="cloud-status">Connexion en cours…</span></summary><form id="cloud-login"><label>Email <input name="email" type="email" autocomplete="username" required></label><label>Mot de passe <input name="password" type="password" autocomplete="current-password" required></label><button>Se connecter</button></form><button id="cloud-logout" hidden>Se déconnecter</button><p id="cloud-message" role="status"></p></details>';
  const status = host.querySelector('#cloud-status');
  const message = host.querySelector('#cloud-message');
  const form = host.querySelector('form');
  const logout = host.querySelector('#cloud-logout');
  async function refresh() {
    const { data, error } = await client.auth.getSession();
    if (error) throw new Error(error.message);
    const user = data?.user || null;
    form.hidden = !!user;
    logout.hidden = !user;
    status.textContent = user ? 'Connecté' : 'Mode local';
    await onSession(client, user, text => { status.textContent = text; });
  }
  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const fields = new FormData(form);
    form.querySelector('button').disabled = true;
    try {
      const { error } = await client.auth.signIn.email({ email: fields.get('email'), password: fields.get('password') });
      form.elements.password.value = '';
      if (error) throw new Error(error.message);
      message.textContent = '';
      await refresh();
    } catch (e) { message.textContent = e.message; }
    finally { form.querySelector('button').disabled = false; }
  });
  logout.addEventListener('click', async () => {
    try {
      const { error } = await client.auth.signOut();
      if (error) throw new Error(error.message);
      await refresh();
    } catch(e) { message.textContent = e.message; }
  });
  try { await refresh(); }
  catch(e) { status.textContent = 'Mode local — connexion indisponible'; message.textContent = e.message; }
  // An offline cold start must recover the session when the network returns.
  window.addEventListener('online', () => {
    refresh().catch(e => {status.textContent='Mode local — connexion indisponible';message.textContent=e.message;});
  });
}
