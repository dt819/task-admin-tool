# 開発環境セットアップ

## 前提条件

- **Node.js** 18+ (現在: v16.13.1 - 動作OK、警告あり)
- **Python** 3.9+
- **Git**
- **PostgreSQL** サーバー (開発環境用) または Supabase

## 初期セットアップ

### 1. プロジェクトクローン
```bash
git clone <repository-url>
cd task_admin_tool
```

### 2. フロントエンド セットアップ
```bash
# Vite + React + TypeScript プロジェクト作成
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# 追加パッケージインストール
npm install @hello-pangea/dnd zustand @tanstack/react-query
npm install -D tailwindcss postcss autoprefixer @types/node
npm install axios

# Tailwind CSS セットアップ
npx tailwindcss init -p
```

### 3. バックエンド セットアップ
```bash
cd ../backend

# 仮想環境作成
python -m venv venv

# 仮想環境アクティベート
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 依存関係インストール
pip install -r requirements.txt

# または個別インストール
pip install fastapi==0.104.1 uvicorn[standard]==0.24.0 sqlalchemy==2.0.23 pymysql==1.1.0 pydantic==2.5.0 python-multipart==0.0.6 python-dotenv==1.0.0 cryptography==41.0.7
```

## 開発サーバー起動

### 並行起動（推奨）
```bash
# ルートディレクトリで
npm install concurrently --save-dev

# package.json に追加
{
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
  }
}

# 開発サーバー起動
npm run dev
```

### 個別起動
```bash
# フロントエンド (ターミナル1)
cd frontend
npm run dev
# → http://localhost:5173

# バックエンド (ターミナル2) 
cd backend
uvicorn main:app --reload
# → http://localhost:8000
```

## 設定ファイル

### `frontend/vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

### `frontend/tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### `backend/.env`
```env
# 開発環境（ローカルPostgreSQL）
DATABASE_URL=postgresql://postgres:password@localhost:5432/task_db

# 本番環境（Supabase）
# DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
# SUPABASE_URL=https://[project-ref].supabase.co
# SUPABASE_KEY=your-anon-key

CORS_ORIGINS=http://localhost:5173,https://your-app.vercel.app
DEBUG=True
```

## 開発用データベース

### PostgreSQL初期化（ローカル開発）
```bash
# PostgreSQLサーバー起動（Docker推奨）
docker run --name postgres-dev -e POSTGRES_PASSWORD=password -e POSTGRES_DB=task_db -p 5432:5432 -d postgres:15

# テーブル作成
cd backend
python -c "
from app.database.connection import engine
from app.models import task
task.Base.metadata.create_all(bind=engine)
"
```

### Supabase使用（推奨）
```bash
1. https://supabase.com でプロジェクト作成
2. SQL Editor で backend/create_tables_supabase.sql を実行
3. .env にSupabase接続情報を設定
```

## 開発フロー

1. **フロントエンド開発**
   - `http://localhost:5173` でUI確認
   - ホットリロード対応

2. **バックエンド開発**  
   - `http://localhost:8000/docs` でAPI仕様確認
   - 自動リロード対応

3. **API連携テスト**
   - ブラウザのDevToolsでネットワーク確認
   - FastAPIの自動ドキュメントでAPI テスト

## 便利なコマンド

```bash
# 型チェック
cd frontend && npm run type-check

# リント
cd frontend && npm run lint

# ビルド（本番用）
cd frontend && npm run build

# バックエンドテスト
cd backend && python -m pytest

# 依存関係更新
cd frontend && npm update
cd backend && pip list --outdated
```
