from flask import Blueprint, request, jsonify
from app import db
from app.models.project import Project

bp = Blueprint('projects', __name__)

@bp.route('/', methods=['GET'])
def list_projects():
    client_id = request.args.get('client_id')
    query = Project.query
    if client_id:
        query = query.filter_by(client_id=client_id)
    projects = query.order_by(Project.updated_at.desc()).all()
    return jsonify([p.to_dict() for p in projects])

@bp.route('/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    data = project.to_dict()
    data['versions'] = [v.to_dict() for v in project.versions]
    return jsonify(data)

@bp.route('/', methods=['POST'])
def create_project():
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
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    data = request.get_json()
    for field in ['title', 'description', 'thumbnail_url', 'status']:
        if field in data:
            setattr(project, field, data[field])
    db.session.commit()
    return jsonify(project.to_dict())

@bp.route('/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()
    return jsonify({'message': 'deleted'})
