from app import db
from datetime import datetime

class Asset(db.Model):
    __tablename__ = 'cp_assets'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('cp_projects.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    file_url = db.Column(db.String(500), nullable=False)
    file_type = db.Column(db.String(50))
    size_bytes = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'name': self.name,
            'file_url': self.file_url,
            'file_type': self.file_type,
            'size_bytes': self.size_bytes,
            'created_at': self.created_at.isoformat()
        }
