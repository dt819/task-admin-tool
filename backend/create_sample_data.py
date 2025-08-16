"""
サンプルデータ作成スクリプト
開発・デモ用のタスクデータを生成します
"""

import sys
import os
from datetime import datetime, timedelta

# パスを追加
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import SessionLocal, engine
from app.models.task import Base, Task, TaskStatus, TaskPriority

def create_sample_data():
    """サンプルタスクデータを作成"""
    
    # テーブル作成
    Base.metadata.create_all(bind=engine)
    
    # セッション作成
    db = SessionLocal()
    
    try:
        # 既存データをクリア
        db.query(Task).delete()
        db.commit()
        
        # サンプルタスクデータ
        sample_tasks = [
            # TODO
            {
                "title": "プロジェクト計画書作成",
                "description": "Q1のプロジェクト計画書を作成し、ステークホルダーと共有する。\n\n含むべき内容:\n- 目標設定\n- タイムライン\n- リソース配分\n- リスク評価",
                "status": TaskStatus.TODO,
                "priority": TaskPriority.HIGH,
                "assignee": "田中太郎",
                "due_date": datetime.now() + timedelta(days=3),
                "position": 1
            },
            {
                "title": "新機能の要件定義",
                "description": "ユーザーからの要望を整理し、新機能の詳細仕様を策定する。",
                "status": TaskStatus.TODO,
                "priority": TaskPriority.MEDIUM,
                "assignee": "佐藤花子",
                "due_date": datetime.now() + timedelta(days=7),
                "position": 2
            },
            {
                "title": "UI/UXデザインレビュー",
                "description": "現在のUIを見直し、ユーザビリティの改善点を洗い出す。",
                "status": TaskStatus.TODO,
                "priority": TaskPriority.LOW,
                "assignee": "山田次郎",
                "due_date": datetime.now() + timedelta(days=14),
                "position": 3
            },
            
            # IN_PROGRESS
            {
                "title": "APIエンドポイント実装",
                "description": "タスク管理機能のRESTful APIを実装中。\n\n実装済み:\n- GET /tasks\n- POST /tasks\n\n残り:\n- PUT /tasks/{id}\n- DELETE /tasks/{id}",
                "status": TaskStatus.IN_PROGRESS,
                "priority": TaskPriority.HIGH,
                "assignee": "鈴木一郎",
                "due_date": datetime.now() + timedelta(days=2),
                "position": 1
            },
            {
                "title": "データベース設計最適化",
                "description": "パフォーマンス向上のためのインデックス追加とクエリ最適化。",
                "status": TaskStatus.IN_PROGRESS,
                "priority": TaskPriority.MEDIUM,
                "assignee": "高橋美咲",
                "due_date": datetime.now() + timedelta(days=5),
                "position": 2
            },
            
            # REVIEW
            {
                "title": "セキュリティ監査",
                "description": "アプリケーションの脆弱性チェックと対策の実装。OWASP Top 10に基づく包括的な監査を実施。",
                "status": TaskStatus.REVIEW,
                "priority": TaskPriority.URGENT,
                "assignee": "渡辺健太",
                "due_date": datetime.now() + timedelta(days=1),
                "position": 1
            },
            {
                "title": "ユニットテスト追加",
                "description": "コードカバレッジ80%を目標とした包括的なテストケースの作成。",
                "status": TaskStatus.REVIEW,
                "priority": TaskPriority.MEDIUM,
                "assignee": "伊藤愛",
                "due_date": datetime.now() + timedelta(days=4),
                "position": 2
            },
            
            # DONE
            {
                "title": "プロジェクト環境構築",
                "description": "開発環境のDocker化とCI/CDパイプラインの構築が完了。\n\n完了項目:\n- Dockerfile作成\n- GitHub Actions設定\n- 自動デプロイ設定",
                "status": TaskStatus.DONE,
                "priority": TaskPriority.HIGH,
                "assignee": "中村裕子",
                "due_date": datetime.now() - timedelta(days=2),
                "position": 1
            },
            {
                "title": "ブランド戦略策定",
                "description": "ロゴデザインとブランドガイドラインの策定が完了。全社で統一されたビジュアルアイデンティティを確立。",
                "status": TaskStatus.DONE,
                "priority": TaskPriority.LOW,
                "assignee": "小林拓也",
                "due_date": datetime.now() - timedelta(days=10),
                "position": 2
            },
            {
                "title": "初期リサーチ完了",
                "description": "市場調査と競合分析が完了。レポートをステークホルダーに提出済み。",
                "status": TaskStatus.DONE,
                "priority": TaskPriority.MEDIUM,
                "assignee": "森田智美",
                "due_date": datetime.now() - timedelta(days=15),
                "position": 3
            },
            
            # 期限切れタスク（デモ用）
            {
                "title": "緊急バグ修正",
                "description": "本番環境で発生したクリティカルなバグの修正。影響範囲が広いため最優先で対応が必要。",
                "status": TaskStatus.IN_PROGRESS,
                "priority": TaskPriority.URGENT,
                "assignee": "加藤大輔",
                "due_date": datetime.now() - timedelta(days=1),
                "position": 3
            },
            {
                "title": "クライアント打ち合わせ資料作成",
                "description": "来週のクライアント定例会議用のプレゼンテーション資料を作成。進捗報告と次期計画を含む。",
                "status": TaskStatus.TODO,
                "priority": TaskPriority.HIGH,
                "assignee": "松本真由美",
                "due_date": datetime.now() - timedelta(days=3),
                "position": 4
            }
        ]
        
        # タスクを作成
        for task_data in sample_tasks:
            task = Task(**task_data)
            db.add(task)
        
        db.commit()
        
        # 作成されたタスク数を確認
        count = db.query(Task).count()
        print(f"✅ サンプルデータ作成完了: {count}件のタスクを作成しました")
        
        # ステータス別の件数表示
        for status in TaskStatus:
            status_count = db.query(Task).filter(Task.status == status).count()
            status_name = {
                TaskStatus.TODO: "TODO",
                TaskStatus.IN_PROGRESS: "進行中",
                TaskStatus.REVIEW: "レビュー",
                TaskStatus.DONE: "完了"
            }[status]
            print(f"   {status_name}: {status_count}件")
            
    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("📋 サンプルデータを作成しています...")
    create_sample_data()
    print("🎉 完了しました！")
    print("\n📝 確認方法:")
    print("1. FastAPI サーバー起動: python main.py")
    print("2. ブラウザで確認: http://localhost:8000/docs")
    print("3. フロントエンド起動: npm run dev (frontend ディレクトリで)")
    print("4. アプリ確認: http://localhost:5173")
