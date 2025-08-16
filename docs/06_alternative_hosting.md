# 代替ホスティングサーバー

Xserver以外の無料・安価なホスティング選択肢

## 🆓 完全無料プラン

### 1. Vercel + Supabase (最推奨)

**構成:**
```
フロントエンド: Vercel (無料)
API: Vercel Serverless Functions (無料枠)
データベース: Supabase PostgreSQL (無料)
```

**料金:** 完全無料（制限内）
**メリット:**
- Git連携自動デプロイ
- 高速CDN配信
- データベースGUI管理画面
- 本格的なスケーラビリティ

**制限:**
- 月100GBまでの帯域幅
- 12個のServerless Functions
- 500MBまでのデータベース

### 2. Netlify + Render

**構成:**
```
フロントエンド: Netlify (無料)
バックエンド: Render Web Service (無料)
データベース: Render PostgreSQL (無料)
```

**料金:** 完全無料
**制限:**
- バックエンドは15分無操作でスリープ
- 月750時間まで実行時間

### 3. GitHub Pages + Railway

**構成:**
```
フロントエンド: GitHub Pages (無料)
バックエンド: Railway ($5/月、初回$5クレジット)
データベース: Railway PostgreSQL
```

## 💰 激安有料プラン（月500円以下）

### 1. ロリポップ！ライトプラン

**料金:** 月250円（年払い）
**スペック:**
- 容量: 200GB
- MySQL: 1個
- Python: CGI対応
- 独自ドメイン: 100個

**メリット:**
- 老舗の安定性
- 日本語サポート
- WordPressも使える

### 2. さくらのレンタルサーバー スタンダード

**料金:** 月131円〜
**スペック:**
- 容量: 100GB
- MySQL: 20個
- Python: 対応
- 転送量: 700GB/日

### 3. スターサーバー ライト

**料金:** 月220円〜
**スペック:**
- 容量: 20GB
- MySQL: 1個
- Python: 対応
- 無料SSL対応

## 🚀 推奨デプロイ戦略

### フェーズ1: プロトタイプ (無料)
```
Vercel + Supabase
→ 完全無料でMVP開発
```

### フェーズ2: 本格運用 (低コスト)
```
Vercel Pro ($20/月) + Supabase Pro ($25/月)
または
ロリポップ！ + 独自MySQL
```

### フェーズ3: スケール時
```
AWS/GCP/Azure
→ 成長に合わせて移行
```

## 各プラットフォーム詳細

### Vercel
```bash
# デプロイ手順
npm install -g vercel
vercel --prod

# 環境変数設定
vercel env add VITE_API_URL
```

### Supabase
```sql
-- テーブル作成（自動マイグレーション）
create table tasks (
  id serial primary key,
  title varchar(255) not null,
  description text,
  status varchar(20) default 'todo',
  priority varchar(20) default 'medium',
  assignee varchar(100),
  due_date timestamp,
  position integer default 1,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

### Railway
```bash
# Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

## 移行手順

### 1. Supabaseデータベース設定
1. [supabase.com](https://supabase.com) でアカウント作成
2. 新しいプロジェクト作成
3. SQL Editorでテーブル作成
4. 接続文字列をコピー

### 2. Vercelデプロイ
1. GitHubリポジトリにプッシュ
2. [vercel.com](https://vercel.com) でインポート
3. 環境変数設定
4. 自動デプロイ完了

### 3. バックエンド調整
```python
# FastAPI → Vercel Serverless Functions
# または Railway/Render継続使用
```

## コスト比較

| サービス | 月額料金 | 帯域幅 | ストレージ | DB |
|---------|---------|--------|-----------|-----|
| Vercel+Supabase | 無料 | 100GB | 1GB | 500MB |
| Netlify+Render | 無料 | 100GB | 1GB | 1GB |
| ロリポップ！ | ¥250 | 無制限 | 200GB | MySQL |
| さくら | ¥131 | 700GB/日 | 100GB | MySQL×20 |

## まとめ

**学習・プロトタイプ:** Vercel + Supabase (無料)
**本格運用・コスト重視:** ロリポップ！
**パフォーマンス重視:** Vercel Pro + Supabase Pro

どの選択肢も現在のReact+FastAPI構成で動作します！
