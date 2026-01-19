const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

async function request(path, { method = 'GET', body, cookie } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  return { response, data };
}

async function run() {
  const email = `test-${Date.now()}@example.com`;
  const password = 'password123';

  const register = await request('/api/auth/register', {
    method: 'POST',
    body: { name: 'Test User', email, password },
  });

  if (!register.response.ok) {
    throw new Error(`Register failed: ${register.response.status} ${JSON.stringify(register.data)}`);
  }

  const login = await request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  if (!login.response.ok) {
    throw new Error(`Login failed: ${login.response.status} ${JSON.stringify(login.data)}`);
  }

  const cookie = login.response.headers.get('set-cookie');
  if (!cookie) {
    throw new Error('Login did not return a session cookie.');
  }

  const projectCreate = await request('/api/projects', {
    method: 'POST',
    cookie,
    body: { name: 'Test Project', clientName: 'Client', hourlyRate: 120, color: '#111827', isActive: true },
  });

  if (!projectCreate.response.ok) {
    throw new Error(`Project create failed: ${projectCreate.response.status} ${JSON.stringify(projectCreate.data)}`);
  }

  const projectId = projectCreate.data.project?.id;
  if (!projectId) {
    throw new Error('Project create response missing id.');
  }

  const projectList = await request('/api/projects', { cookie });
  if (!projectList.response.ok) {
    throw new Error(`Project list failed: ${projectList.response.status} ${JSON.stringify(projectList.data)}`);
  }

  const projectUpdate = await request(`/api/projects/${projectId}`, {
    method: 'PATCH',
    cookie,
    body: { name: 'Updated Project', isActive: false },
  });
  if (!projectUpdate.response.ok) {
    throw new Error(`Project update failed: ${projectUpdate.response.status} ${JSON.stringify(projectUpdate.data)}`);
  }

  const projectGet = await request(`/api/projects/${projectId}`, { cookie });
  if (!projectGet.response.ok) {
    throw new Error(`Project get failed: ${projectGet.response.status} ${JSON.stringify(projectGet.data)}`);
  }

  const entryCreate = await request('/api/time-entries', {
    method: 'POST',
    cookie,
    body: {
      projectId,
      description: 'Test entry',
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      durationSec: 1800,
      billable: true,
    },
  });
  if (!entryCreate.response.ok) {
    throw new Error(`Entry create failed: ${entryCreate.response.status} ${JSON.stringify(entryCreate.data)}`);
  }

  const entryId = entryCreate.data.entry?.id;
  if (!entryId) {
    throw new Error('Entry create response missing id.');
  }

  const entryList = await request('/api/time-entries', { cookie });
  if (!entryList.response.ok) {
    throw new Error(`Entry list failed: ${entryList.response.status} ${JSON.stringify(entryList.data)}`);
  }

  const entryUpdate = await request(`/api/time-entries/${entryId}`, {
    method: 'PATCH',
    cookie,
    body: { description: 'Updated entry', durationSec: 3600, billable: false },
  });
  if (!entryUpdate.response.ok) {
    throw new Error(`Entry update failed: ${entryUpdate.response.status} ${JSON.stringify(entryUpdate.data)}`);
  }

  const entryGet = await request(`/api/time-entries/${entryId}`, { cookie });
  if (!entryGet.response.ok) {
    throw new Error(`Entry get failed: ${entryGet.response.status} ${JSON.stringify(entryGet.data)}`);
  }

  const entryDelete = await request(`/api/time-entries/${entryId}`, {
    method: 'DELETE',
    cookie,
  });
  if (!entryDelete.response.ok) {
    throw new Error(`Entry delete failed: ${entryDelete.response.status} ${JSON.stringify(entryDelete.data)}`);
  }

  const projectDelete = await request(`/api/projects/${projectId}`, {
    method: 'DELETE',
    cookie,
  });
  if (!projectDelete.response.ok) {
    throw new Error(`Project delete failed: ${projectDelete.response.status} ${JSON.stringify(projectDelete.data)}`);
  }

  console.log('API smoke test passed.');
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
