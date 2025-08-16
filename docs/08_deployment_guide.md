# 本番環境デプロイガイド

## 📋 概要

このガイドでは、タスク管理アプリをSupabase（データベース）+ Vercel（フロントエンド）+ Railway（バックエンド）構成で本番環境にデプロイする手順を説明します。

## 🎯 デプロイ構成

```
フロントエンド (React + Vite) → Vercel
バックエンド (FastAPI)        → Railway/Render
データベース (PostgreSQL)     → Supabase
```

## 🚀 ステップ1: Supabaseプロジェクト作成

### 1.1 Supabaseアカウント作成
1. [Supabase](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインイン

### 1.2 新規プロジェクト作成
1. 「New Project」をクリック
2. **プロジェクト名**: `task-admin-tool`
3. **データベースパスワード**: 強力なパスワードを設定（保存しておく）
NeFMcu-bPeK2p5p
4. **リージョン**: `Northeast Asia (Tokyo)` を選択
5. 「Create new project」をクリック

### 1.3 データベース設定情報取得
プロジェクト作成後、以下の情報を控えておく：
- **Project URL**: `https://[PROJECT-REF].supabase.co`
- **Anon Key**: `Settings > API` から取得
- **Database URL**: `Settings > Database` から取得

### 1.4 データベーステーブル作成
1. Supabaseダッシュボードで「SQL Editor」を開く
2. 以下のSQLを実行:

\`\`\`sql
-- tasksテーブル作成
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(11) CHECK (status IN ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE')) DEFAULT 'TODO',
    priority VARCHAR(6) CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')) DEFAULT 'MEDIUM',
    assignee VARCHAR(100),
    due_date TIMESTAMP,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- サンプルデータ挿入
INSERT INTO tasks (title, description, status, priority, assignee, due_date, position) VALUES
('プロジェクト計画書作成', 'Q1のプロジェクト計画書を作成し、ステークホルダーと共有する。', 'TODO', 'HIGH', '田中太郎', NOW() + INTERVAL '3 days', 1),
('新機能の要件定義', 'ユーザーからの要望を整理し、新機能の詳細仕様を策定する。', 'TODO', 'MEDIUM', '佐藤花子', NOW() + INTERVAL '1 week', 2),
('APIエンドポイント実装', 'タスク管理機能のRESTful APIを実装中。', 'IN_PROGRESS', 'HIGH', '鈴木一郎', NOW() + INTERVAL '2 days', 1),
('セキュリティ監査', 'アプリケーションの脆弱性チェックと対策の実装。', 'REVIEW', 'URGENT', '渡辺健太', NOW() + INTERVAL '1 day', 1),
('プロジェクト環境構築', '開発環境のDocker化とCI/CDパイプラインの構築が完了。', 'DONE', 'HIGH', '中村裕子', NOW() - INTERVAL '2 days', 1);
\`\`\`

## 🚀 ステップ2: バックエンドデプロイ (Railway推奨)

### 2.1 Railwayアカウント作成
1. [Railway](https://railway.app) にアクセス
2. GitHubアカウントでサインイン

### 2.2 新規プロジェクトデプロイ
1. 「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. タスク管理アプリのリポジトリを選択
4. 「Deploy Now」をクリック

### 2.3 環境変数設定
Railwayダッシュボードで「Variables」タブを開き、以下を設定：

\`\`\`
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_KEY=[ANON-KEY]
DEBUG=False
ALLOWED_ORIGINS=https://[VERCEL-DOMAIN].vercel.app
\`\`\`

### 2.4 デプロイ設定
1. 「Settings」で**Root Directory**を `backend` に設定
2. **Start Command**を `uvicorn main:app --host 0.0.0.0 --port $PORT` に設定
3. 「Deploy」をクリック

## 🚀 ステップ3: フロントエンドデプロイ (Vercel)

### 3.1 Vercelアカウント作成
1. [Vercel](https://vercel.com) にアクセス
2. GitHubアカウントでサインイン

### 3.2 新規プロジェクトデプロイ
1. 「New Project」をクリック
2. GitHubリポジトリを選択
3. **Framework Preset**: Vite
4. **Root Directory**: `frontend`
5. 「Deploy」をクリック

### 3.3 環境変数設定
Vercelダッシュボードで「Settings > Environment Variables」を開き：

\`\`\`
VITE_API_URL=https://[RAILWAY-DOMAIN].railway.app
\`\`\`

### 3.4 再デプロイ
環境変数設定後、「Deployments」タブで再デプロイを実行

## ✅ ステップ4: 動作確認

### 4.1 基本機能テスト
1. Vercelの本番URLにアクセス
2. ダッシュボードでタスク統計が表示されること
3. 新規タスクが作成できること
4. カンバンボードでドラッグ&ドロップが動作すること
5. タスク一覧で編集・削除ができること

### 4.2 API動作確認
- `https://[RAILWAY-DOMAIN].railway.app/docs` でFastAPI docsが表示される
- 各エンドポイントが正常に応答する

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. CORS エラー
**症状**: フロントエンドからAPIへのリクエストが失敗
**解決方法**: バックエンドの環境変数 `ALLOWED_ORIGINS` にVercelのドメインを正しく設定

#### 2. データベース接続エラー
**症状**: 500 Internal Server Error
**解決方法**: Supabaseの接続情報（DATABASE_URL）を確認

#### 3. 環境変数が反映されない
**症状**: デフォルト値が使用される
**解決方法**: デプロイサービスで環境変数設定後、再デプロイを実行

## 📊 本番環境監視

### 推奨監視項目
- [ ] フロントエンドの応答速度
- [ ] APIエンドポイントの応答時間
- [ ] データベース接続数
- [ ] エラー率
- [ ] ユーザー行動ログ

## 🔄 CI/CD設定（オプション）

GitHub ActionsでのCI/CDパイプライン設定は、別途 `docs/09_cicd_setup.md` を参照してください。

## 📞 サポート

問題が発生した場合は、各サービスのドキュメントを参照：
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)  
- [Railway Docs](https://docs.railway.app)
