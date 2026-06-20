from flask import Blueprint, request, jsonify
from app import db
from app.models.asset import Asset
from app.auth import token_required, admin_required

bp = Blueprint('assets', __name__)

@bp.route('/', methods=['GET'])
@token_required
def list_assets(current_user):
    project_id = request.args.get('project_id')
    query = Asset.query
    if project_id:
        query = query.filter_by(project_id=project_id)
    return jsonify([a.to_dict() for a in query.order_by(Asset.created_at.desc()).all()])

@bp.route('/', methods=['POST'])
@admin_required
def create_asset(current_user):
    data = request.get_json()
    asset = Asset(
        project_id=data['project_id'],
        name=data['name'],
        file_url=data['file_url'],
        file_type=data.get('file_type'),
        size_bytes=data.get('size_bytes')
    )
    db.session.add(asset)
    db.session.commit()
    return jsonify(asset.to_dict()), 201

@bp.route('/<int:asset_id>', methods=['DELETE'])
@admin_required
def delete_asset(current_user, asset_id):
    asset = Asset.query.get_or_404(asset_id)
    db.session.delete(asset)
    db.session.commit()
    return jsonify({'message': 'deleted'})
