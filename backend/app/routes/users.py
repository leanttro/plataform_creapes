from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from app.auth import admin_required

bp = Blueprint('users', __name__)

@bp.route('/', methods=['GET'])
@admin_required
def list_users(current_user):
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([u.to_dict() for u in users])

@bp.route('/', methods=['POST'])
@admin_required
def create_user(current_user):
    data = request.get_json()
    if User.query.filter_by(email=data['email'].lower()).first():
        return jsonify({'error': 'Email já cadastrado'}), 400
    user = User(
        name=data['name'],
        email=data['email'].strip().lower(),
        role=data.get('role', 'cliente'),
        client_id=data.get('client_id')
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@bp.route('/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(current_user, user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    for field in ['name', 'role', 'client_id']:
        if field in data:
            setattr(user, field, data[field])
    if 'password' in data and data['password']:
        user.set_password(data['password'])
    db.session.commit()
    return jsonify(user.to_dict())

@bp.route('/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(current_user, user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'deleted'})
