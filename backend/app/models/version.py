from app import db
from datetime import datetime

class Version(db.Model):
    __tablename__ = 'versions'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    label = db.Column(db.String(50), nullable=False)  # ex: "Corte 01", "V-Final"
    video_url = db.Column(db.String(500), nullable=False)
    vimeo_id = db.Column(db.String(50))
    status = db.Column(db.String(50), default='pendente')
    # status options: pendente, aprovado, reprovado, aprovado_com_ressalva
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    comments = db.relationship('Comment', backref='version', lazy=True)
    approvals = db.relationship('Approval', backref='version', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'label': self.label,
            'video_url': self.video_url,
            'vimeo_id': self.vimeo_id,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
