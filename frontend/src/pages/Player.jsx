import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getVersion, getComments, createComment, createApproval } from '../services/api'

export default function Player() {
  const { versionId } = useParams()
  const navigate = useNavigate()
  const [version, setVersion] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [activeTab, setActiveTab] = useState('comments')
  const [approvalNote, setApprovalNote] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const iframeRef = useRef(null)
  const commentListRef = useRef(null)

  useEffect(() => {
    getVersion(versionId).then(res => setVersion(res.data)).catch(console.error)
    loadComments()
  }, [versionId])

  function loadComments() {
    getComments(versionId).then(res => setComments(res.data)).catch(console.error)
  }

  function formatTime(seconds) {
    if (!seconds && seconds !== 0) return ''
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  async function sendComment() {
    if (!commentText.trim()) return
    try {
      await createComment({
        version_id: parseInt(versionId),
        author_name: 'Cliente',
        text: commentText,
        timecode: currentTime || null
      })
      setCommentText('')
      loadComments()
    } catch (e) {
      console.error(e)
    }
  }

  async function sendApproval(decision) {
    try {
      await createApproval({
        version_id: parseInt(versionId),
        author_name: 'Cliente',
        decision,
        note: approvalNote
      })
      setVersion(prev => ({ ...prev, status: decision }))
      setApprovalNote('')
      alert(decision === 'aprovado' ? 'Versão aprovada!' : decision === 'reprovado' ? 'Solicitação de alteração enviada.' : 'Aprovado com ressalva!')
    } catch (e) {
      console.error(e)
    }
  }

  if (!version) return <div style={{ padding: 64, color: '#A0A0A5' }}>Carregando...</div>

  const vimeoId = version.vimeo_id || version.video_url?.split('/').pop()

  return (
    <div style={styles.page}>

      {/* ÁREA PRINCIPAL */}
      <div style={styles.main}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button style={styles.btnBack} onClick={() => navigate('/projects')}>
              <i className="ph ph-arrow-left" />
            </button>
            <div>
              <h1 style={styles.projectTitle}>{version.project_id ? `Projeto #${version.project_id}` : 'Projeto'}</h1>
              <span style={styles.versionBadge}>{version.label}</span>
            </div>
          </div>
          <div style={styles.statusBadge(version.status)}>
            {version.status === 'aprovado' && <><i className="ph-bold ph-check" /> Aprovado</>}
            {version.status === 'reprovado' && <><i className="ph-bold ph-x" /> Reprovado</>}
            {version.status === 'pendente' && <><i className="ph-bold ph-clock" /> Pendente</>}
            {version.status === 'aprovado_com_ressalva' && <><i className="ph-bold ph-warning" /> Aprovado c/ Ressalva</>}
          </div>
        </div>

        {/* PLAYER VIMEO */}
        <div style={styles.playerWrapper}>
          <iframe
            ref={iframeRef}
            src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`}
            style={styles.iframe}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={version.label}
          />
        </div>

        {/* INPUT DE TIMECODE MANUAL */}
        <div style={styles.timecodeRow}>
          <i className="ph ph-timer" style={{ color: '#A0A0A5' }} />
          <span style={{ color: '#A0A0A5', fontSize: '0.85rem' }}>Timecode do comentário:</span>
          <input
            type="number"
            placeholder="segundos (ex: 42)"
            value={currentTime || ''}
            onChange={e => setCurrentTime(parseFloat(e.target.value) || 0)}
            style={styles.timecodeInput}
          />
          {currentTime > 0 && <span style={{ color: '#8B5CF6', fontSize: '0.85rem' }}>[{formatTime(currentTime)}]</span>}
        </div>
      </div>

      {/* PAINEL LATERAL */}
      <div style={styles.sidebar}>

        {/* TABS */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(activeTab === 'comments' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('comments')}
          >
            <i className="ph ph-chat-text" /> Comentários
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'approval' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('approval')}
          >
            <i className="ph ph-check-circle" /> Aprovação
          </button>
        </div>

        {/* ABA COMENTÁRIOS */}
        {activeTab === 'comments' && (
          <>
            <div ref={commentListRef} style={styles.commentList}>
              {comments.length === 0 && (
                <div style={styles.emptyComments}>Nenhum comentário ainda.</div>
              )}
              {comments.map(c => (
                <div key={c.id} style={styles.comment}>
                  <div style={styles.commentAvatar} />
                  <div style={styles.commentBody}>
                    <div style={styles.commentHeader}>
                      <span style={styles.commentName}>{c.author_name}</span>
                      {c.timecode != null && (
                        <span style={styles.timeTag}>[{formatTime(c.timecode)}]</span>
                      )}
                    </div>
                    <p style={styles.commentText}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.commentInputArea}>
              <textarea
                placeholder="Escreva um comentário..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendComment() } }}
                style={styles.textarea}
                rows={3}
              />
              <button style={styles.sendBtn} onClick={sendComment}>
                <i className="ph-bold ph-paper-plane-tilt" />
              </button>
            </div>
          </>
        )}

        {/* ABA APROVAÇÃO */}
        {activeTab === 'approval' && (
          <div style={styles.approvalArea}>
            <p style={styles.approvalDesc}>
              Revise o vídeo e registre sua decisão. Você pode aprovar, pedir alteração ou aprovar com ressalva.
            </p>
            <textarea
              placeholder="Observação (opcional)..."
              value={approvalNote}
              onChange={e => setApprovalNote(e.target.value)}
              style={{ ...styles.textarea, minHeight: 80, marginBottom: 16 }}
              rows={3}
            />
            <button style={styles.btnApprove} onClick={() => sendApproval('aprovado')}>
              <i className="ph-bold ph-check" /> Aprovar
            </button>
            <button style={styles.btnApproveNote} onClick={() => sendApproval('aprovado_com_ressalva')}>
              <i className="ph-bold ph-warning" /> Aprovar com Ressalva
            </button>
            <button style={styles.btnReject} onClick={() => sendApproval('reprovado')}>
              <i className="ph-bold ph-x" /> Solicitar Alteração
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

const statusColors = {
  aprovado: '#10B981',
  reprovado: '#EF4444',
  pendente: '#8B5CF6',
  aprovado_com_ressalva: '#EAB308'
}

const styles = {
  page: {
    display: 'grid', gridTemplateColumns: '1fr 360px',
    height: '100vh', overflow: 'hidden', backgroundColor: '#0F0F11'
  },
  main: {
    display: 'flex', flexDirection: 'column',
    padding: '32px 48px', gap: 16, overflowY: 'auto'
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 20 },
  btnBack: {
    width: 44, height: 44, borderRadius: '50%', backgroundColor: '#161618',
    border: '1px solid #2D2D30', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '1.2rem'
  },
  projectTitle: { fontSize: '1.25rem', fontWeight: 600, marginBottom: 4 },
  versionBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    color: '#A0A0A5', fontSize: '0.875rem', backgroundColor: '#161618',
    padding: '4px 10px', borderRadius: 6, border: '1px solid #2D2D30'
  },
  statusBadge: (status) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 14px', borderRadius: 6, fontSize: '0.85rem', fontWeight: 600,
    backgroundColor: `${statusColors[status] || '#A0A0A5'}22`,
    color: statusColors[status] || '#A0A0A5',
    border: `1px solid ${statusColors[status] || '#A0A0A5'}44`
  }),
  playerWrapper: { position: 'relative', paddingTop: '56.25%', borderRadius: 12, overflow: 'hidden', backgroundColor: '#000' },
  iframe: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' },
  timecodeRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 16px', backgroundColor: '#161618',
    borderRadius: 8, border: '1px solid #2D2D30'
  },
  timecodeInput: {
    width: 120, padding: '4px 8px', backgroundColor: '#0F0F11',
    border: '1px solid #2D2D30', borderRadius: 4, color: '#EDEDED', fontSize: '0.85rem'
  },
  sidebar: {
    borderLeft: '1px solid #2D2D30', display: 'flex',
    flexDirection: 'column', height: '100vh', overflow: 'hidden'
  },
  tabs: { display: 'flex', borderBottom: '1px solid #2D2D30' },
  tab: {
    flex: 1, padding: '16px 12px', fontSize: '0.875rem', fontWeight: 500,
    color: '#A0A0A5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderBottom: '2px solid transparent', transition: 'all 0.2s'
  },
  tabActive: { color: '#EDEDED', borderBottomColor: '#8B5CF6' },
  commentList: { flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 },
  emptyComments: { color: '#A0A0A5', fontSize: '0.875rem', textAlign: 'center', marginTop: 40 },
  comment: { display: 'flex', gap: 12 },
  commentAvatar: {
    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
    backgroundImage: 'url(https://i.pravatar.cc/150?img=11)', backgroundSize: 'cover',
    border: '2px solid #2D2D30'
  },
  commentBody: { flex: 1 },
  commentHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 },
  commentName: { fontWeight: 600, fontSize: '0.875rem' },
  timeTag: {
    fontSize: '0.75rem', color: '#8B5CF6', backgroundColor: 'rgba(139,92,246,0.15)',
    padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace'
  },
  commentText: { fontSize: '0.875rem', color: '#A0A0A5', lineHeight: 1.5 },
  commentInputArea: {
    padding: 16, borderTop: '1px solid #2D2D30',
    display: 'flex', gap: 10, alignItems: 'flex-end'
  },
  textarea: {
    flex: 1, backgroundColor: '#0F0F11', border: '1px solid #2D2D30',
    borderRadius: 8, padding: '12px 14px', color: '#EDEDED',
    fontSize: '0.875rem', resize: 'none', lineHeight: 1.5
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 8, backgroundColor: '#8B5CF6',
    color: '#fff', fontSize: '1.2rem', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  approvalArea: { padding: 20, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' },
  approvalDesc: { color: '#A0A0A5', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 4 },
  btnApprove: {
    padding: '14px', borderRadius: 8, backgroundColor: '#10B981',
    color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
  },
  btnApproveNote: {
    padding: '14px', borderRadius: 8, backgroundColor: 'rgba(234,179,8,0.15)',
    color: '#EAB308', border: '1px solid rgba(234,179,8,0.3)',
    fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
  },
  btnReject: {
    padding: '14px', borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.1)',
    color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)',
    fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
  }
}
