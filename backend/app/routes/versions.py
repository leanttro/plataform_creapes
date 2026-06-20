from flask import Blueprint, request, jsonify
from app import db
from app.models.version import Version
from app.auth import admin_required, token_required

bp = Blueprint('versions', __name__)

@bp.route('/', methods=['GET'])
@token_required
def list_versions(current_user):
    project_id = request.args.get('project_id')
    query = Version.query
    if project_id:
        query = query.filter_by(project_id=project_id)
    return jsonify([v.to_dict() for v in query.order_by(Version.created_at.desc()).all()])

@bp.route('/<int:version_id>', methods=['GET'])
@token_required
def get_version(current_user, version_id):
    return jsonify(Version.query.get_or_404(version_id).to_dict())

@bp.route('/', methods=['POST'])
@admin_required
def create_version(current_user):
    data = request.get_json()
    version = Version(
        project_id=data['project_id'],
        label=data['label'],
        video_url=data['video_url'],
        vimeo_id=data.get('vimeo_id'),
        status=data.get('status', 'pendente')
    )
    db.session.add(version)
    db.session.commit()
    return jsonify(version.to_dict()), 201

@bp.route('/<int:version_id>', methods=['PUT'])
@admin_required
def update_version(current_user, version_id):
    version = Version.query.get_or_404(version_id)
    data = request.get_json()
    for field in ['label', 'video_url', 'vimeo_id', 'status']:
        if field in data:
            setattr(version, field, data[field])
    db.session.commit()
    return jsonify(version.to_dict())
