# システム構成

## 概要
シンプルなタスク管理ツール - カンバンボード機能付き

## 技術スタック

### フロントエンド
- **React 19.1.1** + **TypeScript 5.8.3** + **Vite 7.1.2**
- **Tailwind CSS 4.1.12** - スタイリング
- **@hello-pangea/dnd 18.0.1** - ドラッグ&ドロップ
- **Zustand 5.0.7** - 状態管理
- **React Query 5.85.3** - サーバー状態管理
- **Axios 1.11.0** - HTTP通信

### バックエンド
- **FastAPI 0.104.1** (Python)
- **SQLAlchemy 2.0.23** - ORM
- **PostgreSQL** - データベース（Supabase）
- **psycopg2-binary 2.9.9** - PostgreSQLドライバー
- **Pydantic 2.5.0** - データ検証
- **Supabase 2.3.4** - BaaS クライアント

### 本番環境
- **推奨**: Vercel + Supabase (無料)
- **代替**: ロリポップ！(月250円〜) 
- **元案**: Xserver（有料プラン切れ）
- 詳細: [代替ホスティング](docs/06_alternative_hosting.md)

## システム構成図

```
┌─────────────────────────────────────────┐
│              Vercel                     │
├─────────────────────────────────────────┤
│  Frontend (React SPA)                  │
│  ├── Static Files (CDN)                │
│  ├── Serverless Functions (API)        │
│  └── Auto SSL + Domain                 │
├─────────────────────────────────────────┤
│              Supabase                   │
│  ├── PostgreSQL Database               │
│  ├── Real-time Subscriptions           │
│  ├── Row Level Security                │
│  └── Auto Backup                       │
└─────────────────────────────────────────┘
```

## データフロー

```
ブラウザ → Vercel CDN → Serverless Functions → Supabase PostgreSQL
         ←            ←                     ←
```

## Supabase + Vercel構成の利点

1. **完全無料** - 制限内なら0円で運用
2. **自動スケーリング** - トラフィック増加に自動対応
3. **高速CDN** - 世界中で高速配信
4. **自動SSL** - 証明書管理不要
5. **Git連携** - プッシュで自動デプロイ
6. **バックアップ自動** - データ保護
7. **リアルタイム対応** - WebSocket自動サポート
