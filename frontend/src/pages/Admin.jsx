import { useState, useEffect } from 'react'
import {
  getClients, createClient, updateClient, deleteClient,
  getUsers, createUser, updateUser, deleteUser,
  getProjects, createProject, updateProject, deleteProject,
  createVersion, getVersions
} from '../services/api'

const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }
const modalBox = { background: '#13131a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }
const inp = { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 14 }
const label = { color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'block', marginBottom: 4 }

const STATUS_OPTIONS = [
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'pendente_aprovacao', label: 'Pendente Aprovação' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'bloqueado', label: 'Bloqueado' },
]

function ClientModal({ client, onClose, onSave }) {
  const [form, setForm] = useState(client || { name: '', slug: '', accent_color: '#8B5CF6' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSave = async () => {
    if (client) await updateClient(client.id, form)
    else await createClient(form)
    onSave()
  }
  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <h3 style={{ color: '#fff', margin: '0 0 24px', fontSize: 18 }}>{client ? 'Editar cliente' : 'Novo cliente'}</h3>
        <label style={label}>Nome</label>
        <input style={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nome do cliente" />
        <label style={label}>Slug</label>
        <input style={inp} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="slug-do-cliente" />
        <label style={label}>Cor de destaque</label>
        <input style={{ ...inp, marginBottom: 24 }} type="color" value={form.accent_color} onChange={e => set('accent_color', e.target.value)} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={s.btnCancel}>Cancelar</button>
          <button onClick={handleSave} style={s.btnSave}>Salvar</button>
        </div>
      </div>
    </div>
  )
}

function UserModal({ user, clients, onClose, onSave }) {
  const [form, setForm] = useState(user || { name: '', email: '', password: '', role: 'cliente', client_id: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSave = async () => {
    const payload = { ...form, client_id: form.client_id ? parseInt(form.client_id) : null }
    if (user) await updateUser(user.id, payload)
    else await createUser(payload)
    onSave()
  }
  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <h3 style={{ color: '#fff', margin: '0 0 24px', fontSize: 18 }}>{user ? 'Editar usuário' : 'Novo usuário'}</h3>
        <label style={label}>Nome</label>
        <input style={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nome completo" />
        <label style={label}>Email</label>
        <input style={inp} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@exemplo.com" />
        <label style={label}>Senha {user && '(vazio = não alterar)'}</label>
        <input style={inp} type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" />
        <label style={label}>Role</label>
        <select style={inp} value={form.role} onChange={e => set('role', e.target.value)}>
          <option value="admin">Admin</option>
          <option value="cliente">Cliente</option>
        </select>
        {form.role === 'cliente' && (
          <>
            <label style={label}>Cliente vinculado</label>
            <select style={{ ...inp, marginBottom: 24 }} value={form.client_id} onChange={e => set('client_id', e.target.value)}>
              <option value="">Selecione...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
          <button onClick={onClose} style={s.btnCancel}>Cancelar</button>
          <button onClick={handleSave} style={s.btnSave}>Salvar</button>
        </div>
      </div>
    </div>
  )
}

function ProjectModal({ project, clients, onClose, onSave }) {
  const [form, setForm] = useState(project || { title: '', description: '', client_id: '', status: 'em_andamento', thumbnail_url: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSave = async () => {
    const payload = { ...form, client_id: parseInt(form.client_id) }
    if (project) await updateProject(project.id, payload)
    else await createProject(payload)
    onSave()
  }
  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <h3 style={{ color: '#fff', margin: '0 0 24px', fontSize: 18 }}>{project ? 'Editar projeto' : 'Novo projeto'}</h3>
        <label style={label}>Título</label>
        <input style={inp} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Campanha Verão 2026" />
        <label style={label}>Descrição</label>
        <input style={inp} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Descrição do projeto" />
        <label style={label}>Cliente</label>
        <select style={inp} value={form.client_id} onChange={e => set('client_id', e.target.value)}>
          <option value="">Selecione...</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label style={label}>Status</label>
        <select style={inp} value={form.status} onChange={e => set('status', e.target.value)}>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <label style={label}>URL do Thumbnail (opcional)</label>
        <input style={{ ...inp, marginBottom: 24 }} value={form.thumbnail_url} onChange={e => set('thumbnail_url', e.target.value)} placeholder="https://..." />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={s.btnCancel}>Cancelar</button>
          <button onClick={handleSave} style={s.btnSave}>Salvar</button>
        </div>
      </div>
    </div>
  )
}

function VersionModal({ projectId, onClose, onSave }) {
  const [form, setForm] = useState({ label: '', video_url: '', vimeo_id: '', status: 'pendente' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleVimeoUrl = (url) => {
    set('video_url', url)
    const match = url.match(/vimeo\.com\/(\d+)/)
    if (match) set('vimeo_id', match[1])
  }

  const handleSave = async () => {
    await createVersion({ ...form, project_id: projectId })
    onSave()
  }

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        <h3 style={{ color: '#fff', margin: '0 0 24px', fontSize: 18 }}>Nova versão</h3>
        <label style={label}>Nome da versão</label>
        <input style={inp} value={form.label} onChange={e => set('label', e.target.value)} placeholder="Ex: Corte 01, V2 Final..." />
        <label style={label}>URL do Vimeo</label>
        <input style={inp} value={form.video_url} onChange={e => handleVimeoUrl(e.target.value)} placeholder="https://vimeo.com/123456789" />
        {form.vimeo_id && <p style={{ color: '#10B981', fontSize: 12, marginBottom: 14 }}>✓ Vimeo ID detectado: {form.vimeo_id}</p>}
        <label style={label}>Status</label>
        <select style={{ ...inp, marginBottom: 24 }} value={form.status} onChange={e => set('status', e.target.value)}>
          <option value="pendente">Pendente</option>
          <option value="aprovado">Aprovado</option>
          <option value="reprovado">Reprovado</option>
        </select>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={s.btnCancel}>Cancelar</button>
          <button onClick={handleSave} style={s.btnSave}>Salvar</button>
        </div>
      </div>
    </div>
  )
}

const STATUS_LABEL = { em_andamento: { label: 'Em Andamento', color: '#3B82F6' }, pendente_aprovacao: { label: 'Pendente', color: '#8B5CF6' }, aprovado: { label: 'Aprovado', color: '#10B981' }, bloqueado: { label: 'Bloqueado', color: '#EF4444' } }

export default function Admin() {
  const [tab, setTab] = useState('projects')
  const [clients, setClients] = useState([])
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [versions, setVersions] = useState({})
  const [clientModal, setClientModal] = useState(null)
  const [userModal, setUserModal] = useState(null)
  const [projectModal, setProjectModal] = useState(null)
  const [versionModal, setVersionModal] = useState(null) // projectId

  const load = async () => {
    const [c, u, p] = await Promise.all([getClients(), getUsers(), getProjects()])
    setClients(Array.isArray(c) ? c : [])
    setUsers(Array.isArray(u) ? u : [])
    setProjects(Array.isArray(p) ? p : [])
  }

  useEffect(() => { load() }, [])

  const loadVersions = async (projectId) => {
    const v = await getVersions(projectId)
    setVersions(prev => ({ ...prev, [projectId]: Array.isArray(v) ? v : [] }))
  }

  const toggleVersions = (projectId) => {
    if (versions[projectId]) {
      setVersions(prev => { const n = { ...prev }; delete n[projectId]; return n })
    } else {
      loadVersions(projectId)
    }
  }

  return (
    <div style={s.page}>
      <h1 style={s.title}>Administração</h1>
      <p style={s.sub}>Gerencie projetos, clientes e usuários</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div style={s.tabs}>
          {['projects', 'clients', 'users'].map(t => (
            <button key={t} style={s.tab(tab === t)} onClick={() => setTab(t)}>
              {t === 'projects' ? 'Projetos' : t === 'clients' ? 'Clientes' : 'Usuários'}
            </button>
          ))}
        </div>
        <button style={s.addBtn} onClick={() => {
          if (tab === 'clients') setClientModal('new')
          else if (tab === 'users') setUserModal('new')
          else setProjectModal('new')
        }}>
          + {tab === 'projects' ? 'Novo projeto' : tab === 'clients' ? 'Novo cliente' : 'Novo usuário'}
        </button>
      </div>

      {/* PROJETOS */}
      {tab === 'projects' && (
        <div>
          {projects.length === 0 && <p style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: 32 }}>Nenhum projeto ainda</p>}
          {projects.map(p => {
            const st = STATUS_LABEL[p.status] || STATUS_LABEL.em_andamento
            const clientName = clients.find(c => c.id === p.client_id)?.name || '—'
            const open = !!versions[p.id]
            return (
              <div key={p.id} style={s.projectRow}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{p.title}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginLeft: 12 }}>{clientName}</span>
                    <span style={{ ...s.badge, background: st.color + '33', color: st.color, marginLeft: 10 }}>{st.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={s.editBtn} onClick={() => toggleVersions(p.id)}>{open ? '▲ Versões' : '▼ Versões'}</button>
                    <button style={s.editBtn} onClick={() => setVersionModal(p.id)}>+ Versão</button>
                    <button style={s.editBtn} onClick={() => setProjectModal(p)}>Editar</button>
                    <button style={s.delBtn} onClick={async () => { if (confirm('Deletar projeto?')) { await deleteProject(p.id); load() } }}>Excluir</button>
                  </div>
                </div>
                {open && (
                  <div style={{ marginTop: 12, paddingLeft: 16, borderLeft: '2px solid rgba(255,255,255,0.06)' }}>
                    {(versions[p.id] || []).length === 0 && <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Nenhuma versão</p>}
                    {(versions[p.id] || []).map(v => (
                      <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{v.label}</span>
                        {v.vimeo_id && <span style={{ color: '#10B981', fontSize: 12 }}>Vimeo: {v.vimeo_id}</span>}
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{v.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* CLIENTES */}
      {tab === 'clients' && (
        <table style={s.table}>
          <thead><tr>
            <th style={s.th}>Nome</th><th style={s.th}>Slug</th><th style={s.th}>Cor</th><th style={s.th}>Ações</th>
          </tr></thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td style={s.td}>{c.name}</td>
                <td style={{ ...s.td, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{c.slug}</td>
                <td style={s.td}><div style={{ width: 20, height: 20, borderRadius: 4, background: c.accent_color, display: 'inline-block' }} /></td>
                <td style={s.td}>
                  <button style={s.editBtn} onClick={() => setClientModal(c)}>Editar</button>
                  <button style={s.delBtn} onClick={async () => { if (confirm('Deletar cliente?')) { await deleteClient(c.id); load() } }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* USUÁRIOS */}
      {tab === 'users' && (
        <table style={s.table}>
          <thead><tr>
            <th style={s.th}>Nome</th><th style={s.th}>Email</th><th style={s.th}>Role</th><th style={s.th}>Cliente</th><th style={s.th}>Ações</th>
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={s.td}>{u.name}</td>
                <td style={{ ...s.td, color: 'rgba(255,255,255,0.5)' }}>{u.email}</td>
                <td style={s.td}><span style={{ ...s.badge, background: u.role === 'admin' ? 'rgba(139,92,246,0.2)' : 'rgba(16,185,129,0.15)', color: u.role === 'admin' ? '#a78bfa' : '#34d399' }}>{u.role}</span></td>
                <td style={{ ...s.td, color: 'rgba(255,255,255,0.4)' }}>{u.client_id ? (clients.find(c => c.id === u.client_id)?.name || u.client_id) : '—'}</td>
                <td style={s.td}>
                  <button style={s.editBtn} onClick={() => setUserModal(u)}>Editar</button>
                  <button style={s.delBtn} onClick={async () => { if (confirm('Deletar usuário?')) { await deleteUser(u.id); load() } }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {clientModal && <ClientModal client={clientModal === 'new' ? null : clientModal} onClose={() => setClientModal(null)} onSave={() => { setClientModal(null); load() }} />}
      {userModal && <UserModal user={userModal === 'new' ? null : userModal} clients={clients} onClose={() => setUserModal(null)} onSave={() => { setUserModal(null); load() }} />}
      {projectModal && <ProjectModal project={projectModal === 'new' ? null : projectModal} clients={clients} onClose={() => setProjectModal(null)} onSave={() => { setProjectModal(null); load() }} />}
      {versionModal && <VersionModal projectId={versionModal} onClose={() => setVersionModal(null)} onSave={() => { loadVersions(versionModal); setVersionModal(null) }} />}
    </div>
  )
}

const s = {
  page: { padding: '40px 48px', maxWidth: 1000 },
  title: { color: '#fff', fontSize: 26, fontWeight: 700, margin: '0 0 8px' },
  sub: { color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 32px' },
  tabs: { display: 'flex', gap: 8 },
  tab: (active) => ({ padding: '8px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: active ? '#8B5CF6' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 14, fontWeight: active ? 600 : 400 }),
  addBtn: { padding: '10px 20px', borderRadius: 8, border: 'none', background: '#8B5CF6', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontSize: 12, padding: '0 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  td: { padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14, borderBottom: '1px solid rgba(255,255,255,0.04)' },
  badge: { display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  editBtn: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '5px 12px', color: '#fff', cursor: 'pointer', fontSize: 12 },
  delBtn: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '5px 12px', color: '#f87171', cursor: 'pointer', fontSize: 12, marginLeft: 6 },
  btnCancel: { padding: '10px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', cursor: 'pointer' },
  btnSave: { padding: '10px 20px', borderRadius: 8, border: 'none', background: '#8B5CF6', color: '#fff', cursor: 'pointer', fontWeight: 600 },
  projectRow: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '16px 20px', marginBottom: 12 },
}
