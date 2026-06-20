from flask import Blueprint, request, jsonify
from app import db
from app.models.asset import Asset
from app.auth import token_required, admin_required
import cloudinary
import cloudinary.uploader

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

@bp.route('/upload', methods=['POST'])
@token_required
def upload_asset(current_user):
    file = request.files.get('file')
    project_id = request.form.get('project_id')
    if not file or not project_id:
        return jsonify({'error': 'file e project_id são obrigatórios'}), 400

    mimetype = file.mimetype or ''
    if mimetype.startswith('image'):
        file_type = 'image'
    elif mimetype.startswith('video'):
        file_type = 'video'
    elif mimetype == 'application/pdf' or file.filename.lower().endswith('.pdf'):
        file_type = 'pdf'
    elif file.filename.lower().endswith(('.zip', '.rar')):
        file_type = 'zip'
    else:
        file_type = 'file'

    resource_type = 'video' if file_type == 'video' else ('image' if file_type == 'image' else 'raw')

    try:
        result = cloudinary.uploader.upload(
            file,
            resource_type=resource_type,
            folder=f'creapes/{project_id}'
        )
    except Exception as e:
        return jsonify({'error': f'Falha no upload: {str(e)}'}), 500

    asset = Asset(
        project_id=project_id,
        name=file.filename,
        file_url=result.get('secure_url'),
        file_type=file_type,
        size_bytes=result.get('bytes')
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
