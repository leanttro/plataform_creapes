from flask import Blueprint, request, jsonify
from app import db
from app.models.comment import Comment

bp = Blueprint('comments', __name__)

@bp.route('/', methods=['GET'])
def list_comments():
    version_id = request.args.get('version_id')
    query = Comment.query
    if version_id:
        query = query.filter_by(version_id=version_id)
    comments = query.order_by(Comment.timecode.asc()).all()
    return jsonify([c.to_dict() for c in comments])

@bp.route('/', methods=['POST'])
def create_comment():
    data = request.get_json()
    comment = Comment(
        version_id=data['version_id'],
        author_name=data['author_name'],
        author_avatar=data.get('author_avatar'),
        text=data['text'],
        timecode=data.get('timecode')
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.to_dict()), 201

@bp.route('/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    db.session.delete(comment)
    db.session.commit()
    return jsonify({'message': 'deleted'})
