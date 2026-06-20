import jwt
import datetime
from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.user import User
from app.auth import token_required

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Email ou senha inválidos'}), 401
    token = jwt.encode({
        'user_id': user.id,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'token': token, 'user': user.to_dict()})

@bp.route('/me', methods=['GET'])
@token_required
def me(current_user):
    return jsonify(current_user.to_dict())
