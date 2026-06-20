from flask import Blueprint, jsonify
from app.models.client import Client
from app.models.project import Project
from app.models.version import Version
from app.models.comment import Comment
from app.auth import admin_required

bp = Blueprint('stats', __name__)

@bp.route('/', methods=['GET'])
@admin_required
def get_stats(current_user):
    return jsonify({
        'clients': Client.query.count(),
        'projects': Project.query.count(),
        'versions': Version.query.count(),
        'comments': Comment.query.count(),
        'pending_approvals': Version.query.filter_by(status='pendente').count(),
        'approved': Version.query.filter_by(status='aprovado').count(),
        'projects_by_status': {
            'em_andamento': Project.query.filter_by(status='em_andamento').count(),
            'pendente_aprovacao': Project.query.filter_by(status='pendente_aprovacao').count(),
            'aprovado': Project.query.filter_by(status='aprovado').count(),
            'bloqueado': Project.query.filter_by(status='bloqueado').count(),
        }
    })
