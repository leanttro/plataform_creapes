import { useState, useEffect } from 'react'
import { getClients, createClient, updateClient, deleteClient, getUsers, createUser, updateUser, deleteUser } from '../services/api'

const modal = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' },
  box: { background: '#13131a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 480 }
}

const input = {
  width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 14
}

function ClientModal({ client, clients, onClose, onSave }) {
  const [form, setForm] = useState(client || { name: '', slug: '', accent_color: '#8B5CF6' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSave = async () => {
    if (client) await updateClient(client.id, form)
    else await createClient(form)
    onSave()
  }
  return (
    <div style={modal.overlay}>
      <div style={modal.box}>
        <h3 style={{ color: '#fff', margin: '0 0 24px', fontSize: 18 }}>{client ? 'Editar cliente' : 'Novo cliente'}</h3>
        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'block', marginBottom: 4 }}>Nome</label>
        <input style={input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nome do cliente" />
        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'block', marginBottom: 4 }}>Slug</label>
        <input style={input} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="slug-do-cliente" />
        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'block', marginBottom: 4 }}>Cor de destaque</label>
        <input style={{ ...input, marginBottom: 24 }} type="color" value={form.accent_color} onChange={e => set('accent_color', e.target.value)} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={handleSave} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#8B5CF6', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Salvar</button>
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
    <div style={modal.overlay}>
      <div style={modal.box}>
        <h3 style={{ color: '#fff', margin: '0 0 24px', fontSize: 18 }}>{user ? 'Editar usuário' : 'Novo usuário'}</h3>
        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'block', marginBottom: 4 }}>Nome</label>
        <input style={input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nome completo" />
        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'block', marginBottom: 4 }}>Email</label>
        <input style={input} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@exemplo.com" />
        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'block', marginBottom: 4 }}>Senha {user && '(deixe vazio pra não alterar)'}</label>
        <input style={input} type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" />
        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'block', marginBottom: 4 }}>Role</label>
        <select style={{ ...input }} value={form.role} onChange={e => set('role', e.target.value)}>
          <option value="admin">Admin</option>
          <option value="cliente">Cliente</option>
        </select>
        {form.role === 'cliente' && (
          <>
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, display: 'block', marginBottom: 4 }}>Cliente vinculado</label>
            <select style={{ ...input, marginBottom: 24 }} value={form.client_id} onChange={e => set('client_id', e.target.value)}>
              <option value="">Selecione...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={handleSave} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#8B5CF6', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Salvar</button>
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  const [tab, setTab] = useState('clients')
  const [clients, setClients] = useState([])
  const [users, setUsers] = useState([])
  const [clientModal, setClientModal] = useState(null) // null | 'new' | client obj
  const [userModal, setUserModal] = useState(null)

  const load = async () => {
    const [c, u] = await Promise.all([getClients(), getUsers()])
    setClients(c)
    setUsers(u)
  }

  useEffect(() => { load() }, [])

  const handleDeleteClient = async (id) => {
    if (!confirm('Deletar este cliente e todos os dados vinculados?')) return
    await deleteClient(id)
    load()
  }

  const handleDeleteUser = async (id) => {
    if (!confirm('Deletar este usuário?')) return
    await deleteUser(id)
    load()
  }

  const s = {
    page: { padding: '40px 48px', maxWidth: 1000 },
    title: { color: '#fff', fontSize: 26, fontWeight: 700, margin: '0 0 8px' },
    sub: { color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 32px' },
    tabs: { display: 'flex', gap: 8, marginBottom: 28 },
    tab: (active) => ({
      padding: '8px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
      background: active ? '#8B5CF6' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.5)',
      cursor: 'pointer', fontSize: 14, fontWeight: active ? 600 : 400
    }),
    addBtn: { padding: '10px 20px', borderRadius: 8, border: 'none', background: '#8B5CF6', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontSize: 12, padding: '0 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    td: { padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14, borderBottom: '1px solid rgba(255,255,255,0.04)' },
    badge: (r) => ({
      display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: r === 'admin' ? 'rgba(139,92,246,0.2)' : 'rgba(16,185,129,0.15)',
      color: r === 'admin' ? '#a78bfa' : '#34d399'
    }),
    editBtn: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '5px 12px', color: '#fff', cursor: 'pointer', fontSize: 12 },
    delBtn: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '5px 12px', color: '#f87171', cursor: 'pointer', fontSize: 12, marginLeft: 6 },
  }

  return (
    <div style={s.page}>
      <h1 style={s.title}>Administração</h1>
      <p style={s.sub}>Gerencie clientes e usuários da plataforma</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div style={s.tabs}>
          <button style={s.tab(tab === 'clients')} onClick={() => setTab('clients')}>Clientes</button>
          <button style={s.tab(tab === 'users')} onClick={() => setTab('users')}>Usuários</button>
        </div>
        <button style={s.addBtn} onClick={() => tab === 'clients' ? setClientModal('new') : setUserModal('new')}>
          + {tab === 'clients' ? 'Novo cliente' : 'Novo usuário'}
        </button>
      </div>

      {tab === 'clients' && (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Nome</th>
              <th style={s.th}>Slug</th>
              <th style={s.th}>Cor</th>
              <th style={s.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td style={s.td}>{c.name}</td>
                <td style={{ ...s.td, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{c.slug}</td>
                <td style={s.td}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: c.accent_color, display: 'inline-block' }} />
                </td>
                <td style={s.td}>
                  <button style={s.editBtn} onClick={() => setClientModal(c)}>Editar</button>
                  <button style={s.delBtn} onClick={() => handleDeleteClient(c.id)}>Excluir</button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr><td colSpan={4} style={{ ...s.td, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: 32 }}>Nenhum cliente cadastrado</td></tr>
            )}
          </tbody>
        </table>
      )}

      {tab === 'users' && (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Nome</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Role</th>
              <th style={s.th}>Cliente</th>
              <th style={s.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={s.td}>{u.name}</td>
                <td style={{ ...s.td, color: 'rgba(255,255,255,0.5)' }}>{u.email}</td>
                <td style={s.td}><span style={s.badge(u.role)}>{u.role}</span></td>
                <td style={{ ...s.td, color: 'rgba(255,255,255,0.4)' }}>
                  {u.client_id ? (clients.find(c => c.id === u.client_id)?.name || u.client_id) : '—'}
                </td>
                <td style={s.td}>
                  <button style={s.editBtn} onClick={() => setUserModal(u)}>Editar</button>
                  <button style={s.delBtn} onClick={() => handleDeleteUser(u.id)}>Excluir</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} style={{ ...s.td, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: 32 }}>Nenhum usuário cadastrado</td></tr>
            )}
          </tbody>
        </table>
      )}

      {clientModal && (
        <ClientModal
          client={clientModal === 'new' ? null : clientModal}
          clients={clients}
          onClose={() => setClientModal(null)}
          onSave={() => { setClientModal(null); load() }}
        />
      )}
      {userModal && (
        <UserModal
          user={userModal === 'new' ? null : userModal}
          clients={clients}
          onClose={() => setUserModal(null)}
          onSave={() => { setUserModal(null); load() }}
        />
      )}
    </div>
  )
}
