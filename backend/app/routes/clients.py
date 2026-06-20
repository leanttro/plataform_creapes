from flask import Blueprint, request, jsonify
from app import db
from app.models.client import Client

bp = Blueprint('clients', __name__)

@bp.route('/', methods=['GET'])
def list_clients():
    clients = Client.query.all()
    return jsonify([c.to_dict() for c in clients])

@bp.route('/<int:client_id>', methods=['GET'])
def get_client(client_id):
    client = Client.query.get_or_404(client_id)
    return jsonify(client.to_dict())

@bp.route('/slug/<slug>', methods=['GET'])
def get_client_by_slug(slug):
    client = Client.query.filter_by(slug=slug).first_or_404()
    return jsonify(client.to_dict())

@bp.route('/', methods=['POST'])
def create_client():
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
def update_client(client_id):
    client = Client.query.get_or_404(client_id)
    data = request.get_json()
    for field in ['name', 'logo_url', 'accent_color', 'slug']:
        if field in data:
            setattr(client, field, data[field])
    db.session.commit()
    return jsonify(client.to_dict())

@bp.route('/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    client = Client.query.get_or_404(client_id)
    db.session.delete(client)
    db.session.commit()
    return jsonify({'message': 'deleted'})
