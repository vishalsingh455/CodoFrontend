const { spawn } = require('child_process');
const axios = require('axios');

(async ()=>{
  try{
    // Start backend server detached
    const server = spawn('node', ['server.js'], { cwd: 'D:/Study/Codo/backend', detached: true, stdio: 'ignore' });
    server.unref();
    console.log('Started backend server (detached). Waiting 1.5s...');
    await new Promise(r=>setTimeout(r,1500));

    const client = axios.create({ baseURL: 'http://localhost:3000', validateStatus: ()=>true });

    // Helper to manage cookie header
    const makeReq = async (opts, cookie) => {
      const headers = {};
      if(cookie) headers['Cookie'] = cookie;
      const res = await client.request({ ...opts, headers });
      return res;
    }

    // 1. Register organizer
    console.log('Registering organizer...');
    let res = await makeReq({ url: '/api/auth/register', method: 'post', data: { name: 'OrgUser', email: 'org@example.com', password: 'pass123' } });
    console.log('register org status', res.status);

    // 2. Login organizer
    console.log('Logging in organizer...');
    res = await makeReq({ url: '/api/auth/login', method: 'post', data: { email:'org@example.com', password:'pass123' } });
    console.log('login org status', res.status, 'data', res.data.message || res.data);
    const cookieOrg = res.headers['set-cookie'] ? res.headers['set-cookie'].map(s=>s.split(';')[0]).join('; ') : '';
    console.log('org cookie:', cookieOrg);

    // 3. Create competition
    console.log('Creating competition...');
    res = await makeReq({ url: '/api/competitions/create', method: 'post', data: { title: 'E2E Test Comp', description: 'Test comp' } }, cookieOrg);
    console.log('create comp status', res.status);
    const comp = res.data.competition || {};
    const compId = comp._id;
    const room = comp.roomCode;
    console.log('compId, room', compId, room);

    // 4. Add problem
    console.log('Adding problem...');
    res = await makeReq({ url: `/api/competitions/${compId}/problems`, method: 'post', data: { title: 'Sum Two', statement: 'Sum two ints', inputFormat: 'a b', outputFormat: 'sum', difficulty: 'easy' } }, cookieOrg);
    console.log('add problem status', res.status, res.data.message || '');
    const prob = res.data.problem || {};
    const probId = prob._id;
    console.log('probId', probId);

    // 5. Add test case
    console.log('Adding testcase...');
    res = await makeReq({ url: `/api/problems/${probId}/testcases`, method: 'post', data: { input: '1 2', expectedOutput: '3', isHidden: false } }, cookieOrg);
    console.log('add testcase status', res.status, res.data.message || '');

    // 6. Register participant
    console.log('Registering participant...');
    res = await makeReq({ url: '/api/auth/register', method: 'post', data: { name: 'PartUser', email: 'part@example.com', password: 'pass123' } });
    console.log('register part status', res.status);

    // 7. Login participant
    console.log('Logging in participant...');
    res = await makeReq({ url: '/api/auth/login', method: 'post', data: { email: 'part@example.com', password: 'pass123' } });
    const cookiePart = res.headers['set-cookie'] ? res.headers['set-cookie'].map(s=>s.split(';')[0]).join('; ') : '';
    console.log('login part status', res.status, 'cookie', cookiePart);

    // 8. Participant join competition
    console.log('Participant joining competition...');
    res = await makeReq({ url: '/api/competitions/join', method: 'post', data: { roomCode: room } }, cookiePart);
    console.log('join status', res.status, res.data.message || res.data);

    // 9. Participant submit code
    console.log('Submitting code...');
    const code = "a=list(map(int,input().split()));print(a[0]+a[1])";
    res = await makeReq({ url: `/api/problems/${probId}/submit`, method: 'post', data: { code, language: 'python' } }, cookiePart);
    console.log('submit status', res.status, res.data.message || res.data);
    const submissionId = res.data.submissionId || null;
    console.log('submissionId', submissionId);

    // 10. Poll my-submissions a few times
    console.log('Polling for submission result (5 attempts)...');
    for(let i=0;i<5;i++){
      await new Promise(r=>setTimeout(r,2000));
      res = await makeReq({ url: '/api/my-submissions', method: 'get' }, cookiePart);
      console.log('my-submissions status', res.status, 'count', (res.data.submissions||[]).length);
      const s = (res.data.submissions||[]).find(x=> x._id === submissionId);
      if(s){
        console.log('found submission', { id: s._id, status: s.status, score: s.score });
        if(s.status !== 'pending') break;
      }
    }

    console.log('E2E script completed');
    process.exit(0);
  }catch(err){
    console.error('E2E error', err && err.response ? { status: err.response.status, data: err.response.data } : err);
    process.exit(1);
  }
})();
