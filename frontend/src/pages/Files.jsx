import { useEffect, useState } from 'react'
import { getAssets, createAsset, deleteAsset } from '../services/api'

export default function Files() {
  const [assets, setAssets] = useState([])
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    loadAssets()
  }, [])

  function loadAssets() {
    getAssets().then(res => setAssets(Array.isArray(res) ? res : [])).catch(console.error)
  }

  function getFileType(file) {
    if (file.type.includes('image')) return 'image'
    if (file.type.includes('pdf') || file.name.endsWith('.pdf')) return 'pdf'
    if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) return 'zip'
    if (file.type.includes('video')) return 'video'
    return 'file'
  }

  async function processFiles(files) {
    for (const file of Array.from(files)) {
      const type = getFileType(file)
      const url = type === 'image' ? URL.createObjectURL(file) : '#'
      try {
        await createAsset({
          project_id: 1, // TODO: pegar do contexto
          name: file.name,
          file_url: url,
          file_type: type,
          size_bytes: file.size
        })
      } catch (e) {
        console.error(e)
      }
    }
    loadAssets()
  }

  function formatBytes(bytes) {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function fileIcon(type) {
    const icons = { pdf: 'ph-file-pdf', zip: 'ph-file-archive', image: 'ph-image', video: 'ph-file-video', file: 'ph-file' }
    return icons[type] || 'ph-file'
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Arquivos</h1>
        <p style={styles.subtitle}>Assets, referências e materiais do projeto</p>
      </div>

      {/* UPLOAD ZONE */}
      <div
        style={{ ...styles.uploadZone, ...(dragging ? styles.uploadZoneDrag : {}) }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files) }}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input" type="file" multiple hidden
          onChange={e => processFiles(e.target.files)}
        />
        <i className="ph ph-upload-simple" style={{ fontSize: '2.5rem', color: '#A0A0A5', marginBottom: 12 }} />
        <p style={{ color: '#EDEDED', fontWeight: 500, marginBottom: 4 }}>Arraste arquivos aqui ou clique para selecionar</p>
        <p style={{ color: '#A0A0A5', fontSize: '0.875rem' }}>PDF, imagens, ZIP, vídeos</p>
      </div>

      {/* GALERIA */}
      {assets.length > 0 && (
        <div style={styles.gallery}>
          {assets.map(asset => (
            <div key={asset.id} style={styles.galleryItem}>
              {asset.file_type === 'image' && asset.file_url !== '#'
                ? <img src={asset.file_url} alt={asset.name} style={styles.galleryImg} />
                : <div style={styles.galleryIcon}><i className={`ph ${fileIcon(asset.file_type)}`} /></div>
              }
              <div style={styles.galleryInfo}>
                <span style={styles.galleryName} title={asset.name}>{asset.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {asset.size_bytes && <span style={{ fontSize: '0.75rem', color: '#A0A0A5' }}>{formatBytes(asset.size_bytes)}</span>}
                  <button
                    style={styles.btnDownload}
                    onClick={() => window.open(asset.file_url, '_blank')}
                    title="Baixar"
                  >
                    <i className="ph ph-download-simple" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {assets.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: 40, color: '#A0A0A5' }}>
          Nenhum arquivo ainda. Faça upload acima.
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { padding: 64, position: 'relative', zIndex: 1 },
  header: { marginBottom: 40 },
  title: { fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #fff 0%, #A0A0A5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: '#A0A0A5', fontSize: '1.1rem', marginTop: 8 },
  uploadZone: {
    border: '2px dashed rgba(255,255,255,0.2)', borderRadius: 12,
    padding: 48, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.2)',
    cursor: 'pointer', marginBottom: 48, transition: 'all 0.3s ease'
  },
  uploadZoneDrag: {
    borderColor: '#8B5CF6', backgroundColor: 'rgba(139,92,246,0.05)'
  },
  gallery: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 },
  galleryItem: {
    backgroundColor: '#161618', borderRadius: 12,
    overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)',
    display: 'flex', flexDirection: 'column'
  },
  galleryImg: { width: '100%', height: 140, objectFit: 'cover' },
  galleryIcon: {
    width: '100%', height: 140, display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '3rem', color: '#A0A0A5', backgroundColor: '#0F0F11'
  },
  galleryInfo: {
    padding: '12px 16px', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)'
  },
  galleryName: {
    fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap',
    overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%'
  },
  btnDownload: {
    width: 32, height: 32, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
  }
}
