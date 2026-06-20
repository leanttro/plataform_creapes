from app import db
from datetime import datetime

class Client(db.Model):
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    logo_url = db.Column(db.String(500))
    accent_color = db.Column(db.String(20), default='#8B5CF6')
    slug = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    projects = db.relationship('Project', backref='client', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'logo_url': self.logo_url,
            'accent_color': self.accent_color,
            'slug': self.slug,
            'created_at': self.created_at.isoformat()
        }
