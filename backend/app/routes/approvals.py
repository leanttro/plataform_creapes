from flask import Blueprint, request, jsonify
from app import db
from app.models.approval import Approval
from app.auth import token_required

bp = Blueprint('approvals', __name__)

@bp.route('/', methods=['GET'])
@token_required
def list_approvals(current_user):
    version_id = request.args.get('version_id')
    query = Approval.query
    if version_id:
        query = query.filter_by(version_id=version_id)
    return jsonify([a.to_dict() for a in query.order_by(Approval.created_at.desc()).all()])

@bp.route('/', methods=['POST'])
@token_required
def create_approval(current_user):
    data = request.get_json()
    approval = Approval(
        version_id=data['version_id'],
        author_name=data.get('author_name', current_user.name),
        decision=data['decision'],
        note=data.get('note')
    )
    db.session.add(approval)
    db.session.commit()
    return jsonify(approval.to_dict()), 201
