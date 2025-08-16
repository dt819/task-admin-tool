# Supabase + Vercel デプロイメント

完全無料でのタスク管理ツールデプロイ手順

## 🚀 概要

**構成:**
```
フロントエンド: Vercel (無料)
バックエンド: Vercel Serverless Functions (無料)
データベース: Supabase PostgreSQL (無料)
```

**料金:** 完全無料（制限内）

## 📋 事前準備

### 必要なアカウント
1. [GitHub](https://github.com) アカウント
2. [Vercel](https://vercel.com) アカウント
3. [Supabase](https://supabase.com) アカウント

## 🗄️ Step 1: Supabaseデータベース設定

### 1.1 プロジェクト作成
```bash
1. https://supabase.com にアクセス
2. "Start your project" をクリック
3. プロジェクト名: task-admin-tool
4. データベースパスワード設定（強力なもの）
5. リージョン: Northeast Asia (Tokyo) 推奨
```

### 1.2 テーブル作成
```sql
-- Supabase SQL Editor で実行
-- backend/create_tables_supabase.sql の内容をコピー&ペースト
```

### 1.3 接続情報取得
```bash
Settings → Database → Connection string
例: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

Settings → API → Project URL & anon key
URL: https://[project-ref].supabase.co
Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🌐 Step 2: Vercelフロントエンドデプロイ

### 2.1 GitHubリポジトリ準備
```bash
# プロジェクトをGitHubにプッシュ
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/task-admin-tool.git
git push -u origin main
```

### 2.2 Vercelデプロイ
```bash
1. https://vercel.com でGitHubと連携
2. "Import Project" → GitHubリポジトリ選択
3. Framework Preset: Vite
4. Root Directory: frontend
5. Build Settings:
   - Build Command: npm run build
   - Output Directory: dist
   - Install Command: npm install
```

### 2.3 環境変数設定
```bash
Vercel Dashboard → Settings → Environment Variables

VITE_API_URL: https://your-app.vercel.app/api
VITE_SUPABASE_URL: https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ⚡ Step 3: Vercel Serverless Functions (API)

### 3.1 APIディレクトリ作成
```bash
mkdir -p frontend/api
```

### 3.2 Serverless Function作成
```python
# frontend/api/tasks.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import os

# FastAPIアプリ
app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ここに backend/app/api/tasks.py の内容を移植

# Vercel用ハンドラー
handler = Mangum(app)
```

### 3.3 依存関係設定
```txt
# frontend/requirements.txt
fastapi==0.104.1
mangum==0.17.0
supabase==2.3.4
psycopg2-binary==2.9.9
pydantic==2.5.0
```

### 3.4 Vercel設定
```json
# frontend/vercel.json
{
  "functions": {
    "api/*.py": {
      "runtime": "python3.9"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/tasks"
    }
  ]
}
```

## 🔧 Step 4: フロントエンド設定更新

### 4.1 環境変数対応
```typescript
// frontend/src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

### 4.2 Supabaseクライアント追加
```bash
cd frontend
npm install @supabase/supabase-js
```

```typescript
// frontend/src/services/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 🚀 Step 5: デプロイ実行

### 5.1 本番デプロイ
```bash
# 変更をコミット&プッシュ
git add .
git commit -m "Add Supabase + Vercel configuration"
git push

# Vercelで自動デプロイが開始
```

### 5.2 動作確認
```bash
1. https://your-app.vercel.app にアクセス
2. タスクの作成・編集・削除をテスト
3. カンバンボードのドラッグ&ドロップをテスト
```

## 🔍 トラブルシューティング

### よくある問題

#### 1. データベース接続エラー
```bash
# Supabase接続文字列の確認
Settings → Database → Connection string
パスワードが正しく設定されているか確認
```

#### 2. CORS エラー
```python
# Vercel Functions のCORS設定
allow_origins=["https://your-app.vercel.app"]
```

#### 3. 環境変数が読み込まれない
```bash
# Vercel Dashboard で環境変数を再確認
# プレビューとプロダクション両方に設定
```

#### 4. ビルドエラー
```bash
# Vercel ビルドログを確認
# package.json のスクリプトを確認
```

## 📊 無料プラン制限管理

### Supabase制限
```
データベース: 500MB
API リクエスト: 50,000/月
ストレージ: 1GB
```

### Vercel制限
```
ビルド時間: 6,000分/月
Serverless Function: 100GB-時/月
帯域幅: 100GB/月
```

### 制限対策
```typescript
// ページネーション実装
const ITEMS_PER_PAGE = 20;

// キャッシュ活用
const { data } = useQuery(['tasks'], fetchTasks, {
  staleTime: 5 * 60 * 1000, // 5分キャッシュ
});

// 不要なAPI呼び出し削減
const debouncedSave = useDebouncedCallback(saveTask, 500);
```

## ✅ デプロイ完了チェックリスト

- [ ] Supabaseプロジェクト作成
- [ ] テーブル・サンプルデータ作成
- [ ] GitHubリポジトリ作成
- [ ] Vercelプロジェクト設定
- [ ] 環境変数設定
- [ ] フロントエンドデプロイ確認
- [ ] API動作確認
- [ ] ドメイン設定（オプション）

## 🎉 完了！

これで完全無料のタスク管理ツールが本番稼働します！
- 高速なCDN配信
- 自動スケーリング
- データベースバックアップ
- SSL証明書自動更新

Xserverよりも高機能で無料という素晴らしい環境の完成です！
