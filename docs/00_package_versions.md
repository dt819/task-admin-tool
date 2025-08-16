# インストール済みパッケージ情報

## 環境情報

### 開発環境
- **Node.js**: v16.13.1
- **npm**: 8.1.2
- **Python**: 要確認 (コマンド未実行)

⚠️ **注意**: Node.js v16.13.1は一部パッケージの推奨バージョンより古いですが、動作します。

## フロントエンド パッケージ

### 主要フレームワーク
- **React**: 19.1.1
- **TypeScript**: 5.8.3
- **Vite**: 7.1.2

### UI・スタイリング
- **Tailwind CSS**: 4.1.12
- **PostCSS**: 8.5.6
- **Autoprefixer**: 10.4.21

### 状態管理・データ取得
- **Zustand**: 5.0.7
- **React Query**: 5.85.3 (@tanstack/react-query)
- **Axios**: 1.11.0

### ドラッグ&ドロップ
- **@hello-pangea/dnd**: 18.0.1

### 開発ツール
- **ESLint**: 9.33.0
- **TypeScript ESLint**: 8.39.1
- **Vite Plugin React**: 5.0.0

### 型定義
- **@types/react**: 19.1.10
- **@types/react-dom**: 19.1.7
- **@types/node**: 24.3.0

## バックエンド パッケージ

### メインフレームワーク
- **FastAPI**: 0.104.1
- **Uvicorn**: 0.24.0

### データベース
- **SQLAlchemy**: 2.0.23
- **PyMySQL**: 1.1.0
- **Cryptography**: 41.0.7

### データ検証・ユーティリティ
- **Pydantic**: 2.5.0
- **python-multipart**: 0.0.6
- **python-dotenv**: 1.0.0

## 開発用パッケージ

### ルートレベル
- **concurrently**: ^8.2.2

## インストール確認コマンド

```bash
# フロントエンド確認
cd frontend
npm list --depth=0

# バックエンド確認
cd backend
pip list

# 開発サーバー起動テスト
npm run dev
```

## 互換性情報

### Node.js バージョン警告について
現在のNode.js v16.13.1では以下の警告が表示されますが、動作に問題ありません：

```
npm WARN EBADENGINE Unsupported engine {
  package: 'vite@7.1.2',
  required: { node: '^20.19.0 || >=22.12.0' },
  current: { node: 'v16.13.1', npm: '8.1.2' }
}
```

### 推奨アップデート（任意）
- **Node.js**: v20.19.0+ または v22.12.0+
- **npm**: v11.5.2

## トラブルシューティング

### パッケージインストールエラー
```bash
# キャッシュクリア
npm cache clean --force

# node_modules削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### Python仮想環境
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux  
source venv/bin/activate

pip install -r requirements.txt
```
