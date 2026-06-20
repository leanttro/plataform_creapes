from flask import Blueprint, request, jsonify
from app import db
from app.models.project import Project
from app.auth import admin_required, token_required

bp = Blueprint('projects', __name__)

@bp.route('/', methods=['GET'])
@token_required
def list_projects(current_user):
    query = Project.query
    if current_user.role != 'admin':
        query = query.filter_by(client_id=current_user.client_id)
    elif request.args.get('client_id'):
        query = query.filter_by(client_id=request.args.get('client_id'))
    return jsonify([p.to_dict() for p in query.order_by(Project.updated_at.desc()).all()])

@bp.route('/<int:project_id>', methods=['GET'])
@token_required
def get_project(current_user, project_id):
    project = Project.query.get_or_404(project_id)
    if current_user.role != 'admin' and project.client_id != current_user.client_id:
        return jsonify({'error': 'Acesso negado'}), 403
    data = project.to_dict()
    data['versions'] = [v.to_dict() for v in project.versions]
    return jsonify(data)

@bp.route('/', methods=['POST'])
@admin_required
def create_project(current_user):
    data = request.get_json()
    project = Project(
        client_id=data['client_id'],
        title=data['title'],
        description=data.get('description'),
        thumbnail_url=data.get('thumbnail_url'),
        status=data.get('status', 'em_andamento')
    )
    db.session.add(project)
    db.session.commit()
    return jsonify(project.to_dict()), 201

@bp.route('/<int:project_id>', methods=['PUT'])
@admin_required
def update_project(current_user, project_id):
    project = Project.query.get_or_404(project_id)
    data = request.get_json()
    for field in ['title', 'description', 'thumbnail_url', 'status']:
        if field in data:
            setattr(project, field, data[field])
    db.session.commit()
    return jsonify(project.to_dict())

@bp.route('/<int:project_id>', methods=['DELETE'])
@admin_required
def delete_project(current_user, project_id):
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()
    return jsonify({'message': 'deleted'})
