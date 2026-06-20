from app import create_app, db
from app.models import User, Client, Project, Version, Comment, Asset, Approval

app = create_app()

@app.cli.command('init-db')
def init_db():
    db.create_all()
    print('Banco iniciado.')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
