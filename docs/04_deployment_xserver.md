# Xserverデプロイメント

## 前提条件

- **Xserverアカウント** - スタンダードプラン以上推奨
- **MySQL データベース** - Xserver管理画面で作成済み
- **Python対応** - CGI/WSGIサポート確認

## デプロイ手順

### 1. MySQLデータベース準備

#### Xserver管理画面での作業
```
1. MySQL設定 → データベース作成
   - データベース名: task_db_xxxxx
   - 文字コード: utf8mb4_general_ci

2. MySQLユーザー作成
   - ユーザー名: task_user_xxxxx
   - パスワード: (強力なパスワード)

3. 権限設定
   - 作成したデータベースに全権限付与
```

#### 接続情報メモ
```
ホスト: mysql○○○.xserver.jp
データベース名: (作成したDB名)
ユーザー名: (作成したユーザー名)
パスワード: (設定したパスワード)
ポート: 3306
```

### 2. フロントエンドデプロイ

#### ローカルでビルド
```bash
cd frontend
npm run build
```

#### ファイルアップロード
```
Xserver public_html/ 配下に以下をアップロード:

public_html/
├── index.html              # dist/index.html
├── assets/                 # dist/assets/ フォルダ
│   ├── index-xxxxx.js
│   └── index-xxxxx.css
└── .htaccess              # SPA用設定
```

#### .htaccess設定
```apache
# public_html/.htaccess
RewriteEngine On

# API リクエストをPython に転送
RewriteRule ^api/(.*)$ /cgi-bin/python/main.py/$1 [L,QSA]

# SPAルーティング対応
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/cgi-bin/
RewriteRule . /index.html [L]

# 静的ファイルキャッシュ
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/* "access plus 1 month"
</IfModule>
```

### 3. バックエンドデプロイ

#### ディレクトリ構成
```
public_html/
└── cgi-bin/
    └── python/
        ├── main.py                 # FastAPI WSGIラッパー
        ├── app/                    # アプリケーションコード
        │   ├── __init__.py
        │   ├── api/
        │   ├── models/
        │   ├── schemas/
        │   └── database/
        ├── requirements.txt
        └── .env
```

#### main.py（WSGI対応）
```python
#!/usr/bin/env python3
import sys
import os
from pathlib import Path

# パスを追加
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI
from fastapi.middleware.wsgi import WSGIMiddleware
from app.api.tasks import router as tasks_router

app = FastAPI(title="Task Admin API")
app.include_router(tasks_router, prefix="/api")

# WSGI アプリケーション
def application(environ, start_response):
    return app(environ, start_response)

if __name__ == "__main__":
    # CGI実行
    from wsgiref.handlers import CGIHandler
    CGIHandler().run(app)
```

#### .env（本番用）
```env
DATABASE_URL=mysql+pymysql://task_user_xxxxx:password@mysql○○○.xserver.jp:3306/task_db_xxxxx
CORS_ORIGINS=https://yourdomain.xsrv.jp
DEBUG=False
SECRET_KEY=your-secret-key-here
```

#### ファイル権限設定
```bash
# FTPクライアントまたはSSHで
chmod 755 cgi-bin/python/main.py
chmod 644 cgi-bin/python/.env
chmod -R 644 cgi-bin/python/app/
```

### 4. データベーステーブル作成

#### テーブル初期化スクリプト
```python
# create_tables.py（ローカルで実行）
import os
from sqlalchemy import create_engine
from app.models.task import Base

# 本番DB接続
DATABASE_URL = "mysql+pymysql://task_user_xxxxx:password@mysql○○○.xserver.jp:3306/task_db_xxxxx"
engine = create_engine(DATABASE_URL)

# テーブル作成
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
```

### 5. 動作確認

#### フロントエンド確認
```
https://yourdomain.xsrv.jp/
→ React アプリが表示される
```

#### API確認
```
https://yourdomain.xsrv.jp/api/tasks
→ JSON レスポンス確認
```

#### データベース確認
```sql
-- Xserver MySQL管理画面 または phpMyAdmin
SELECT * FROM tasks;
```

## トラブルシューティング

### よくある問題

#### 1. API が 500 エラー
```bash
# エラーログ確認
tail -f /home/username/log/error_log
```

#### 2. データベース接続エラー  
```python
# 接続テスト
python -c "
import pymysql
conn = pymysql.connect(
    host='mysql○○○.xserver.jp',
    user='task_user_xxxxx', 
    password='password',
    database='task_db_xxxxx'
)
print('Connection successful!')
"
```

#### 3. CORS エラー
```python
# FastAPI CORS設定確認
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.xsrv.jp"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## パフォーマンス最適化

### 1. 静的ファイル圧縮
```apache
# .htaccess に追加
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>
```

### 2. データベース最適化
```sql
-- インデックス作成
CREATE INDEX idx_task_status ON tasks(status);
CREATE INDEX idx_task_created_at ON tasks(created_at);
```

### 3. キャッシュ設定
```python
# FastAPI レスポンスキャッシュ
from fastapi import Header

@app.get("/api/tasks")
async def get_tasks(cache_control: str = Header("max-age=300")):
    # キャッシュ対応レスポンス
    pass
```
