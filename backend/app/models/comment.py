from app import db
from datetime import datetime

class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    version_id = db.Column(db.Integer, db.ForeignKey('versions.id'), nullable=False)
    author_name = db.Column(db.String(100), nullable=False)
    author_avatar = db.Column(db.String(500))
    text = db.Column(db.Text, nullable=False)
    timecode = db.Column(db.Float)  # segundos no vídeo
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'version_id': self.version_id,
            'author_name': self.author_name,
            'author_avatar': self.author_avatar,
            'text': self.text,
            'timecode': self.timecode,
            'created_at': self.created_at.isoformat()
        }
