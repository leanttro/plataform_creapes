from flask import Blueprint, request, jsonify
from app import db
from app.models.version import Version

bp = Blueprint('versions', __name__)

@bp.route('/', methods=['GET'])
def list_versions():
    project_id = request.args.get('project_id')
    query = Version.query
    if project_id:
        query = query.filter_by(project_id=project_id)
    versions = query.order_by(Version.created_at.desc()).all()
    return jsonify([v.to_dict() for v in versions])

@bp.route('/<int:version_id>', methods=['GET'])
def get_version(version_id):
    version = Version.query.get_or_404(version_id)
    data = version.to_dict()
    data['comments'] = [c.to_dict() for c in version.comments]
    data['approvals'] = [a.to_dict() for a in version.approvals]
    return jsonify(data)

@bp.route('/', methods=['POST'])
def create_version():
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
def update_version(version_id):
    version = Version.query.get_or_404(version_id)
    data = request.get_json()
    for field in ['label', 'video_url', 'vimeo_id', 'status']:
        if field in data:
            setattr(version, field, data[field])
    db.session.commit()
    return jsonify(version.to_dict())
