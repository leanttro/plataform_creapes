from flask import Blueprint, request, jsonify
from app import db
from app.models.asset import Asset

bp = Blueprint('assets', __name__)

@bp.route('/', methods=['GET'])
def list_assets():
    project_id = request.args.get('project_id')
    query = Asset.query
    if project_id:
        query = query.filter_by(project_id=project_id)
    assets = query.order_by(Asset.created_at.desc()).all()
    return jsonify([a.to_dict() for a in assets])

@bp.route('/', methods=['POST'])
def create_asset():
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
def delete_asset(asset_id):
    asset = Asset.query.get_or_404(asset_id)
    db.session.delete(asset)
    db.session.commit()
    return jsonify({'message': 'deleted'})
