from app import create_app, db
from app.models import User, Client, Project, Version, Comment, Asset, Approval

app = create_app()

@app.cli.command('init-db')
def init_db():
    db.create_all()
    if not User.query.filter_by(email='admin@creapes.com').first():
        admin = User(name='Admin', email='admin@creapes.com', role='admin')
        admin.set_password('creapes@2026')
        db.session.add(admin)
        db.session.commit()
        print('Admin criado: admin@creapes.com / creapes@2026')
    print('Banco iniciado.')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
