const fs = require('fs');
(async function(){
  try{
    const env = fs.readFileSync('.env','utf8');
    const get = k => { const re = new RegExp('^'+k+'=(.*)$','m'); const m = env.match(re); return m?m[1].replace(/^"|"$/g,''):null };
    const SUPABASE_URL = get('SUPABASE_URL');
    const KEY = get('SUPABASE_ANON_KEY');
    if(!SUPABASE_URL || !KEY) return console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
    const fetchFn = global.fetch || (await import('node-fetch')).default;
    async function count(table){
      const url = `${SUPABASE_URL.replace(/\/+$/,'')}/rest/v1/${table}?select=id`;
      const res = await fetchFn(url, { headers: { apikey: KEY, Authorization: 'Bearer '+KEY, Prefer: 'count=exact' } });
      const cr = res.headers.get('content-range') || res.headers.get('Content-Range');
      if(cr){ const m = cr.match(/\/(\d+)$/); if(m) return Number(m[1]); }
      const data = await res.json(); return Array.isArray(data)?data.length:0;
    }
    const users = await count('users');
    const levels = await count('levels');
    const records = await count('records');
    console.log(`counts: users=${users}, levels=${levels}, records=${records}`);
  }catch(e){
    console.error('error', e && (e.stack||e.message) || e);
    process.exit(1);
  }
})();