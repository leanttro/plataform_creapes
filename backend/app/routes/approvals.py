from flask import Blueprint, request, jsonify
from app import db
from app.models.approval import Approval
from app.models.version import Version

bp = Blueprint('approvals', __name__)

@bp.route('/', methods=['GET'])
def list_approvals():
    version_id = request.args.get('version_id')
    query = Approval.query
    if version_id:
        query = query.filter_by(version_id=version_id)
    approvals = query.order_by(Approval.created_at.desc()).all()
    return jsonify([a.to_dict() for a in approvals])

@bp.route('/', methods=['POST'])
def create_approval():
    data = request.get_json()
    approval = Approval(
        version_id=data['version_id'],
        author_name=data['author_name'],
        decision=data['decision'],
        note=data.get('note')
    )
    db.session.add(approval)

    # Atualiza status da version automaticamente
    version = Version.query.get(data['version_id'])
    if version:
        version.status = data['decision']

    db.session.commit()
    return jsonify(approval.to_dict()), 201
