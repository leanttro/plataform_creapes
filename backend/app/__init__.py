from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    from app.routes.auth import bp as auth_bp
    from app.routes.users import bp as users_bp
    from app.routes.clients import bp as clients_bp
    from app.routes.projects import bp as projects_bp
    from app.routes.versions import bp as versions_bp
    from app.routes.comments import bp as comments_bp
    from app.routes.assets import bp as assets_bp
    from app.routes.approvals import bp as approvals_bp
    from app.routes.stats import bp as stats_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(clients_bp, url_prefix='/api/clients')
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    app.register_blueprint(versions_bp, url_prefix='/api/versions')
    app.register_blueprint(comments_bp, url_prefix='/api/comments')
    app.register_blueprint(assets_bp, url_prefix='/api/assets')
    app.register_blueprint(approvals_bp, url_prefix='/api/approvals')
    app.register_blueprint(stats_bp, url_prefix='/api/stats')

    return app
