from app import db
from datetime import datetime

class Approval(db.Model):
    __tablename__ = 'cp_approvals'

    id = db.Column(db.Integer, primary_key=True)
    version_id = db.Column(db.Integer, db.ForeignKey('cp_versions.id'), nullable=False)
    author_name = db.Column(db.String(100), nullable=False)
    decision = db.Column(db.String(50), nullable=False)
    note = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'version_id': self.version_id,
            'author_name': self.author_name,
            'decision': self.decision,
            'note': self.note,
            'created_at': self.created_at.isoformat()
        }
