import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@db:5432/creapes')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CLOUDINARY_URL = os.environ.get('CLOUDINARY_URL', '')
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100MB upload limit
