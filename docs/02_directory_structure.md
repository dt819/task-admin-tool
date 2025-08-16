# ディレクトリ構造

## プロジェクト全体

```
task_admin_tool/
├── docs/                           # ドキュメント
│   ├── 00_package_versions.md      # パッケージバージョン情報
│   ├── 01_architecture.md
│   ├── 02_directory_structure.md
│   ├── 03_development_setup.md
│   ├── 04_deployment_xserver.md
│   ├── 05_api_specification.md
│   ├── 06_alternative_hosting.md
│   └── 07_supabase_deployment.md   # Supabase + Vercel デプロイ手順
├── frontend/                       # React アプリケーション
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── kanban/
│   │   │   │   ├── KanbanBoard.tsx
│   │   │   │   ├── KanbanColumn.tsx
│   │   │   │   └── TaskCard.tsx
│   │   │   ├── tasks/
│   │   │   │   ├── TaskList.tsx
│   │   │   │   ├── TaskForm.tsx
│   │   │   │   └── TaskModal.tsx
│   │   │   └── common/
│   │   │       ├── Header.tsx
│   │   │       ├── Navigation.tsx
│   │   │       └── Loading.tsx
│   │   ├── hooks/
│   │   │   ├── useTasks.ts
│   │   │   └── useKanban.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── stores/
│   │   │   └── taskStore.ts
│   │   ├── types/
│   │   │   └── task.ts
│   │   ├── utils/
│   │   │   └── constants.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── backend/                        # FastAPI アプリケーション
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── tasks.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── task.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── task.py
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   └── connection.py
│   │   └── __init__.py
│   ├── main.py
│   ├── requirements.txt
│   ├── create_tables_supabase.sql  # Supabase用テーブル作成SQL
│   └── env_example.txt
├── README.md
└── package.json                    # ルートレベル（開発用スクリプト）
```

## フロントエンド詳細

### `/src/components/`
- **kanban/** - カンバンボード関連コンポーネント
- **tasks/** - タスク管理画面コンポーネント
- **common/** - 共通UI コンポーネント

### `/src/hooks/`
- カスタムフック（データ取得、状態管理）

### `/src/services/`
- API通信関連の処理

### `/src/stores/`
- Zustandを使った状態管理

### `/src/types/`
- TypeScript型定義

## バックエンド詳細

### `/app/api/`
- FastAPIのルーターファイル

### `/app/models/`
- SQLAlchemyのデータベースモデル

### `/app/schemas/`
- Pydanticのスキーマ（API入出力）

### `/app/database/`
- データベース接続設定

## 開発時のファイル配置

```
開発環境:
├── localhost:5173  (Frontend - Vite dev server)
└── localhost:8000  (Backend - FastAPI)

本番環境:
├── Vercel           (Frontend + Serverless Functions)
└── Supabase         (PostgreSQL Database)
```
