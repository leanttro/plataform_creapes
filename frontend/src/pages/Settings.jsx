import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { updateClient } from '../services/api'

export default function Settings() {
  const { client, setClient } = useApp()
  const [form, setForm] = useState({
    name: client?.name || '',
    logo_url: client?.logo_url || '',
    accent_color: client?.accent_color || '#8B5CF6'
  })
  const [saved, setSaved] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    if (!client?.id) {
      // Aplica localmente sem salvar no banco se não há cliente
      document.documentElement.style.setProperty('--accent-color', form.accent_color)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      return
    }
    try {
      const res = await updateClient(client.id, form)
      setClient(res)
      document.documentElement.style.setProperty('--accent-color', form.accent_color)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Configurações</h1>
        <p style={styles.subtitle}>Personalize a plataforma para o seu cliente</p>
      </div>

      <div style={styles.card}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nome do Cliente</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ex: Mitsubishi Motors"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>URL do Logo</label>
          <input
            name="logo_url"
            value={form.logo_url}
            onChange={handleChange}
            placeholder="https://..."
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Cor de Destaque</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              name="accent_color"
              type="color"
              value={form.accent_color}
              onChange={handleChange}
              style={styles.colorInput}
            />
            <span style={{ color: '#A0A0A5', fontSize: '0.875rem' }}>{form.accent_color}</span>
          </div>
        </div>

        <button style={{ ...styles.saveBtn, backgroundColor: form.accent_color }} onClick={handleSave}>
          {saved ? <><i className="ph-bold ph-check" /> Salvo!</> : <><i className="ph ph-floppy-disk" /> Salvar Configurações</>}
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: 64, position: 'relative', zIndex: 1 },
  header: { marginBottom: 40 },
  title: { fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #fff 0%, #A0A0A5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: '#A0A0A5', fontSize: '1.1rem', marginTop: 8 },
  card: {
    maxWidth: 600, backgroundColor: '#161618', borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.05)', padding: 40,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  formGroup: { marginBottom: 28 },
  label: { display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#A0A0A5', marginBottom: 10 },
  input: {
    width: '100%', backgroundColor: '#0F0F11', border: '1px solid #2D2D30',
    borderRadius: 8, padding: '14px 16px', color: '#EDEDED',
    fontSize: '1rem', transition: 'border-color 0.2s'
  },
  colorInput: {
    width: 60, height: 40, border: 'none', cursor: 'pointer',
    backgroundColor: 'transparent', padding: 0
  },
  saveBtn: {
    color: '#fff', padding: '14px 28px', borderRadius: 8,
    fontWeight: 600, fontSize: '1rem', width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
  }
}
