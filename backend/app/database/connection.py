from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# データベースURL (SQLite for development, PostgreSQL/Supabase for production)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tasks.db")

# SQLAlchemy エンジン作成
engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("DEBUG", "False").lower() == "true",  # デバッグ時はSQL出力
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True  # 接続プールの健全性チェック
)

# セッション設定
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ベースクラス
Base = declarative_base()

# データベースセッション取得用
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Supabaseクライアント（オプション - 直接SQL使用の場合）
def get_supabase_client():
    from supabase import create_client
    
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    if supabase_url and supabase_key:
        return create_client(supabase_url, supabase_key)
    return None
