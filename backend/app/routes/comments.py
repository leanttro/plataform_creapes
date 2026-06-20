from flask import Blueprint, request, jsonify
from app import db
from app.models.comment import Comment
from app.auth import token_required

bp = Blueprint('comments', __name__)

@bp.route('/', methods=['GET'])
@token_required
def list_comments(current_user):
    version_id = request.args.get('version_id')
    query = Comment.query
    if version_id:
        query = query.filter_by(version_id=version_id)
    return jsonify([c.to_dict() for c in query.order_by(Comment.created_at).all()])

@bp.route('/', methods=['POST'])
@token_required
def create_comment(current_user):
    data = request.get_json()
    comment = Comment(
        version_id=data['version_id'],
        author_name=data.get('author_name', current_user.name),
        author_avatar=data.get('author_avatar'),
        text=data['text'],
        timecode=data.get('timecode')
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.to_dict()), 201
