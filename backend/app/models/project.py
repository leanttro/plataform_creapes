from app import db
from datetime import datetime

class Project(db.Model):
    __tablename__ = 'cp_projects'

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('cp_clients.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    thumbnail_url = db.Column(db.String(500))
    status = db.Column(db.String(50), default='em_andamento')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    versions = db.relationship('Version', backref='project', lazy=True)
    assets = db.relationship('Asset', backref='project', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'client_id': self.client_id,
            'title': self.title,
            'description': self.description,
            'thumbnail_url': self.thumbnail_url,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
