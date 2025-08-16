# API仕様書

## 概要

- **ベースURL**: `http://localhost:8000` (開発) / `https://yourdomain.xsrv.jp` (本番)
- **認証**: なし（シンプル構成）
- **レスポンス形式**: JSON
- **文字エンコード**: UTF-8

## データモデル

### Task（タスク）
```typescript
interface Task {
  id: number;                    // タスクID
  title: string;                 // タスクタイトル
  description?: string;          // タスク説明
  status: TaskStatus;            // ステータス
  priority: TaskPriority;        // 優先度
  assignee?: string;             // 担当者
  due_date?: string;             // 期限（ISO 8601）
  created_at: string;            // 作成日時（ISO 8601）
  updated_at: string;            // 更新日時（ISO 8601）
  position: number;              // カンバン内の位置
}

type TaskStatus = "todo" | "in_progress" | "review" | "done";
type TaskPriority = "low" | "medium" | "high" | "urgent";
```

## エンドポイント

### タスク一覧取得
```http
GET /api/tasks
```

**レスポンス**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "UIデザインの作成",
      "description": "カンバンボードのUIを作成する",
      "status": "in_progress",
      "priority": "high",
      "assignee": "田中太郎",
      "due_date": "2024-01-15T23:59:59Z",
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-02T14:30:00Z",
      "position": 1
    }
  ],
  "total": 1
}
```

### タスク詳細取得
```http
GET /api/tasks/{task_id}
```

**パラメータ**
- `task_id`: タスクID（整数）

**レスポンス**
```json
{
  "id": 1,
  "title": "UIデザインの作成",
  "description": "カンバンボードのUIを作成する",
  "status": "in_progress",
  "priority": "high",
  "assignee": "田中太郎",
  "due_date": "2024-01-15T23:59:59Z",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-02T14:30:00Z",
  "position": 1
}
```

### タスク作成
```http
POST /api/tasks
```

**リクエストボディ**
```json
{
  "title": "新しいタスク",
  "description": "タスクの説明",
  "status": "todo",
  "priority": "medium",
  "assignee": "山田花子",
  "due_date": "2024-01-20T23:59:59Z"
}
```

**レスポンス**
```json
{
  "id": 2,
  "title": "新しいタスク",
  "description": "タスクの説明",
  "status": "todo",
  "priority": "medium",
  "assignee": "山田花子",
  "due_date": "2024-01-20T23:59:59Z",
  "created_at": "2024-01-03T09:00:00Z",
  "updated_at": "2024-01-03T09:00:00Z",
  "position": 1
}
```

### タスク更新
```http
PUT /api/tasks/{task_id}
```

**パラメータ**
- `task_id`: タスクID（整数）

**リクエストボディ**
```json
{
  "title": "更新されたタスク",
  "description": "更新された説明",
  "status": "in_progress",
  "priority": "high",
  "assignee": "佐藤次郎",
  "due_date": "2024-01-25T23:59:59Z"
}
```

**レスポンス**
```json
{
  "id": 1,
  "title": "更新されたタスク",
  "description": "更新された説明",
  "status": "in_progress",
  "priority": "high",
  "assignee": "佐藤次郎",
  "due_date": "2024-01-25T23:59:59Z",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-03T15:30:00Z",
  "position": 1
}
```

### タスク削除
```http
DELETE /api/tasks/{task_id}
```

**パラメータ**
- `task_id`: タスクID（整数）

**レスポンス**
```json
{
  "message": "Task deleted successfully",
  "deleted_id": 1
}
```

### タスク位置更新（カンバン用）
```http
PATCH /api/tasks/{task_id}/position
```

**パラメータ**
- `task_id`: タスクID（整数）

**リクエストボディ**
```json
{
  "status": "in_progress",
  "position": 2
}
```

**レスポンス**
```json
{
  "id": 1,
  "status": "in_progress",
  "position": 2,
  "updated_at": "2024-01-03T16:00:00Z"
}
```

### ステータス別タスク取得
```http
GET /api/tasks/by-status
```

**レスポンス**
```json
{
  "todo": [
    {
      "id": 2,
      "title": "新機能の設計",
      "status": "todo",
      "priority": "medium",
      "position": 1
    }
  ],
  "in_progress": [
    {
      "id": 1,
      "title": "UIデザインの作成",
      "status": "in_progress", 
      "priority": "high",
      "position": 1
    }
  ],
  "review": [],
  "done": [
    {
      "id": 3,
      "title": "要件定義",
      "status": "done",
      "priority": "high",
      "position": 1
    }
  ]
}
```

## エラーレスポンス

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": {
    "title": ["This field is required"]
  }
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Task with id 999 not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error", 
  "message": "Database connection failed"
}
```

## 使用例（JavaScript/TypeScript）

### タスク一覧取得
```typescript
const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch('/api/tasks');
  const data = await response.json();
  return data.tasks;
};
```

### タスク作成
```typescript
const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  return await response.json();
};
```

### タスクのドラッグ&ドロップ更新
```typescript
const updateTaskPosition = async (
  taskId: number, 
  newStatus: TaskStatus, 
  newPosition: number
): Promise<void> => {
  await fetch(`/api/tasks/${taskId}/position`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: newStatus,
      position: newPosition,
    }),
  });
};
```

## データベース設計

### tasksテーブル
```sql
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('todo', 'in_progress', 'review', 'done') DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    assignee VARCHAR(100),
    due_date DATETIME,
    position INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_assignee (assignee),
    INDEX idx_due_date (due_date),
    INDEX idx_created_at (created_at)
);
```

## 将来の拡張予定

### 認証・認可
- JWT トークン認証
- ユーザー管理
- 権限ベースアクセス制御

### 高度な機能
- ファイル添付API
- コメント機能
- 通知システム
- 検索・フィルタリング
- バルク操作

### AI連携
- タスク自動分類
- 優先度推定
- 進捗予測
- 自動アサイン
