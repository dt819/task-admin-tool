-- Supabase用テーブル作成SQL
-- Supabase SQL Editor で実行してください

-- カスタム型定義
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Tasks テーブル作成
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'todo',
    priority task_priority DEFAULT 'medium',
    assignee VARCHAR(100),
    due_date TIMESTAMP WITH TIME ZONE,
    position INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_position ON tasks(position);

-- updated_at自動更新のトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_atトリガー
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 有効化（必要に応じて）
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- サンプルデータ挿入
INSERT INTO tasks (title, description, status, priority, assignee, position) VALUES
('プロジェクト計画書作成', 'Q1のプロジェクト計画書を作成する', 'todo', 'high', '田中太郎', 1),
('UIデザイン', 'カンバンボードのUIデザインを作成', 'in_progress', 'medium', '佐藤花子', 1),
('API実装', 'タスク管理APIの実装', 'in_progress', 'high', '山田次郎', 2),
('テスト実行', '単体テストとE2Eテストの実行', 'review', 'medium', '鈴木三郎', 1),
('要件定義', 'システム要件の詳細定義', 'done', 'high', '田中太郎', 1);

-- テーブル確認
SELECT * FROM tasks ORDER BY created_at;
