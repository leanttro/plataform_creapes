from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    CORS(app)

    from app.routes.clients import bp as clients_bp
    from app.routes.projects import bp as projects_bp
    from app.routes.versions import bp as versions_bp
    from app.routes.comments import bp as comments_bp
    from app.routes.assets import bp as assets_bp
    from app.routes.approvals import bp as approvals_bp

    app.register_blueprint(clients_bp, url_prefix='/api/clients')
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    app.register_blueprint(versions_bp, url_prefix='/api/versions')
    app.register_blueprint(comments_bp, url_prefix='/api/comments')
    app.register_blueprint(assets_bp, url_prefix='/api/assets')
    app.register_blueprint(approvals_bp, url_prefix='/api/approvals')

    return app
