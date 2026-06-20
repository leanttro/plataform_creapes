const BASE_URL = 'https://apicreapes2.leanttro.com/api'

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// Clients
export const getClients = () => request('/clients')
export const getClient = (id) => request(`/clients/${id}`)
export const createClient = (data) => request('/clients', { method: 'POST', body: JSON.stringify(data) })
export const updateClient = (id, data) => request(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) })

// Projects
export const getProjects = (clientId) => request(`/projects?client_id=${clientId}`)
export const getProject = (id) => request(`/projects/${id}`)
export const createProject = (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) })
export const updateProject = (id, data) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) })

// Versions
export const getVersions = (projectId) => request(`/versions?project_id=${projectId}`)
export const getVersion = (id) => request(`/versions/${id}`)
export const createVersion = (data) => request('/versions', { method: 'POST', body: JSON.stringify(data) })
export const updateVersion = (id, data) => request(`/versions/${id}`, { method: 'PUT', body: JSON.stringify(data) })

// Comments
export const getComments = (versionId) => request(`/comments?version_id=${versionId}`)
export const createComment = (data) => request('/comments', { method: 'POST', body: JSON.stringify(data) })

// Assets
export const getAssets = (projectId) => request(`/assets?project_id=${projectId}`)
export const createAsset = (data) => request('/assets', { method: 'POST', body: JSON.stringify(data) })
export const deleteAsset = (id) => request(`/assets/${id}`, { method: 'DELETE' })

// Approvals
export const getApprovals = (versionId) => request(`/approvals?version_id=${versionId}`)
export const createApproval = (data) => request('/approvals', { method: 'POST', body: JSON.stringify(data) })
