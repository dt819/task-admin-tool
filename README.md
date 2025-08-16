# Task Admin Tool

シンプルなタスク管理ツール - カンバンボード機能付き

## 技術スタック

### フロントエンド
- React 19.1.1 + TypeScript 5.8.3 + Vite 7.1.2
- Tailwind CSS 4.1.12
- @hello-pangea/dnd 18.0.1 (ドラッグ&ドロップ)
- Zustand 5.0.7 (状態管理)
- React Query 5.85.3 (サーバー状態管理)
- Axios 1.11.0 (HTTP通信)

### バックエンド
- FastAPI 0.104.1 (Python)
- SQLAlchemy 2.0.23 + PostgreSQL
- psycopg2-binary 2.9.9 (PostgreSQLドライバー)
- Pydantic 2.5.0 (データ検証)
- Supabase 2.3.4 (BaaS クライアント)

## セットアップ

### 前提条件
- Node.js 18+ (現在: v16.13.1 - 動作OK、警告あり)
- Python 3.9+
- PostgreSQL サーバー または Supabase

### 現在の環境
- Node.js: v16.13.1
- npm: 8.1.2
- 全パッケージ正常インストール済み ✅

### インストール
```bash
# 依存関係インストール
npm install
npm run setup

# .envファイル作成
cp backend/env_example.txt backend/.env
# backend/.env を編集してデータベース接続情報を設定
```

### データベース初期化
```bash
# MySQLサーバー起動後
cd backend
python -c "
from app.database.connection import engine
from app.models.task import Base
Base.metadata.create_all(bind=engine)
"
```

### 開発サーバー起動
```bash
# フロントエンド + バックエンド同時起動
npm run dev

# 個別起動
npm run dev:frontend  # http://localhost:5173
npm run dev:backend   # http://localhost:8000
```

## API仕様

- API ドキュメント: http://localhost:8000/docs
- 詳細仕様: [docs/05_api_specification.md](docs/05_api_specification.md)

## デプロイメント

- **🚀 Supabase + Vercel (無料)**: [docs/07_supabase_deployment.md](docs/07_supabase_deployment.md)
- Xserver デプロイ手順: [docs/04_deployment_xserver.md](docs/04_deployment_xserver.md)

## ドキュメント

- [パッケージバージョン情報](docs/00_package_versions.md)
- [システム構成](docs/01_architecture.md)
- [ディレクトリ構造](docs/02_directory_structure.md)
- [開発環境セットアップ](docs/03_development_setup.md)
- [Xserverデプロイメント](docs/04_deployment_xserver.md)
- [API仕様書](docs/05_api_specification.md)
- [代替ホスティング](docs/06_alternative_hosting.md)
- [🚀 Supabase + Vercel デプロイ](docs/07_supabase_deployment.md) ← **推奨構成**

## 機能

- ✅ タスクのCRUD操作
- ✅ カンバンボード（TODO/進行中/レビュー/完了）
- ✅ ドラッグ&ドロップによるタスク移動
- ✅ タスクの優先度設定
- ✅ 担当者設定
- ✅ 期限設定

## 今後の拡張予定

- 認証・認可機能
- ファイル添付機能
- コメント機能
- 通知システム
- AI連携（タスク自動分類、優先度推定）
