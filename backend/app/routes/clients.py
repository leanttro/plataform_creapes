from flask import Blueprint, request, jsonify
from app import db
from app.models.client import Client
from app.auth import admin_required, token_required

bp = Blueprint('clients', __name__)

@bp.route('/', methods=['GET'])
@token_required
def list_clients(current_user):
    if current_user.role == 'admin':
        clients = Client.query.all()
    else:
        clients = Client.query.filter_by(id=current_user.client_id).all()
    return jsonify([c.to_dict() for c in clients])

@bp.route('/<int:client_id>', methods=['GET'])
@token_required
def get_client(current_user, client_id):
    client = Client.query.get_or_404(client_id)
    if current_user.role != 'admin' and current_user.client_id != client_id:
        return jsonify({'error': 'Acesso negado'}), 403
    return jsonify(client.to_dict())

@bp.route('/', methods=['POST'])
@admin_required
def create_client(current_user):
    data = request.get_json()
    client = Client(
        name=data['name'],
        slug=data['slug'],
        logo_url=data.get('logo_url'),
        accent_color=data.get('accent_color', '#8B5CF6')
    )
    db.session.add(client)
    db.session.commit()
    return jsonify(client.to_dict()), 201

@bp.route('/<int:client_id>', methods=['PUT'])
@admin_required
def update_client(current_user, client_id):
    client = Client.query.get_or_404(client_id)
    data = request.get_json()
    for field in ['name', 'logo_url', 'accent_color', 'slug']:
        if field in data:
            setattr(client, field, data[field])
    db.session.commit()
    return jsonify(client.to_dict())

@bp.route('/<int:client_id>', methods=['DELETE'])
@admin_required
def delete_client(current_user, client_id):
    client = Client.query.get_or_404(client_id)
    db.session.delete(client)
    db.session.commit()
    return jsonify({'message': 'deleted'})
