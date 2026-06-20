from app import create_app, db
from app.models import Client, Project, Version, Comment, Asset, Approval

app = create_app()

@app.cli.command('init-db')
def init_db():
    db.create_all()
    print('Banco criado.')

@app.cli.command('seed-db')
def seed_db():
    # Cliente demo
    client = Client(name='Creapes Demo', slug='creapes-demo', accent_color='#8B5CF6')
    db.session.add(client)
    db.session.flush()

    project = Project(
        client_id=client.id,
        title='Campanha Mitsubishi 2026',
        description='Campanha institucional para lançamento do novo modelo.',
        status='pendente_aprovacao'
    )
    db.session.add(project)
    db.session.flush()

    version = Version(
        project_id=project.id,
        label='Corte 02',
        video_url='https://vimeo.com/1148242730',
        vimeo_id='1148242730',
        status='pendente'
    )
    db.session.add(version)
    db.session.commit()
    print('Seed concluído.')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
