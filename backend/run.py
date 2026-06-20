import os
from app import create_app, db
from app.models import User, Client, Project, Version, Comment, Asset, Approval

app = create_app()

@app.cli.command('init-db')
def init_db():
    db.create_all()
    admin_email = os.environ.get('ADMIN_EMAIL', 'admin@creapes.com')
    admin_password = os.environ.get('ADMIN_PASSWORD')
    if not admin_password:
        print('ERRO: defina ADMIN_PASSWORD no ENV antes de rodar init-db')
        return
    if not User.query.filter_by(email=admin_email).first():
        admin = User(name='Admin', email=admin_email, role='admin')
        admin.set_password(admin_password)
        db.session.add(admin)
        db.session.commit()
        print(f'Admin criado: {admin_email}')
    print('Banco iniciado.')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
