import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { astDataService } from '../../services/test_astDataService';
import type { AstSnapshot } from '../../interface/ast.interface';
import type { FlowNodeData } from '../../interface/flow.interface';
import AstFlowCanvas from '../../components/flow/AstFlowCanvas';
import styles from './VisualizationPage.module.css';

export default function VisualizationPage() {
  const { snapshotId } = useParams<{ snapshotId: string }>();
  const navigate = useNavigate();
  const [snapshot, setSnapshot] = useState<AstSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNode, setSelectedNode] = useState<FlowNodeData | null>(null);

  useEffect(() => {
    if (!snapshotId) return;
    setLoading(true);
    astDataService
      .getSnapshot(Number(snapshotId))
      .then(setSnapshot)
      .catch(() => setError('스냅샷 데이터를 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false));
  }, [snapshotId]);

  const handleNodeSelect = useCallback((data: FlowNodeData) => {
    setSelectedNode(data);
  }, []);

  const nodeTypeLabel: Record<string, string> = {
    directory: '📁 디렉토리',
    file: '📄 파일',
    class: '🏛️ 클래스',
    function: '⚡ 함수',
  };

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← 대시보드
        </button>
        <div className={styles.headerCenter}>
          <span className={styles.logo}>⬡</span>
          <span className={styles.snapLabel}>Snapshot #{snapshotId}</span>
        </div>
        <div className={styles.headerRight}>
          {snapshot && (
            <span className={styles.snapshotDate}>
              {new Date(snapshot.createdAt).toLocaleString('ko-KR')}
            </span>
          )}
        </div>
      </header>

      <div className={styles.body}>
        {/* 메인 캔버스 영역 */}
        <main className={styles.canvas}>
          {loading ? (
            <div className={styles.center}>
              <div className={styles.spinner} />
              <p>스냅샷 데이터 로딩 중...</p>
            </div>
          ) : error ? (
            <div className={styles.center}>
              <div className={styles.errorBox}>{error}</div>
            </div>
          ) : (
            <AstFlowCanvas snapshot={snapshot} onNodeSelect={handleNodeSelect} />
          )}
        </main>

        {/* 우측 디테일 패널 */}
        <aside className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>노드 상세</h3>
          </div>

          {selectedNode ? (
            <div className={styles.nodeDetail}>
              <div className={styles.detailType}>
                {nodeTypeLabel[selectedNode.nodeType] ?? selectedNode.nodeType}
              </div>
              <div className={styles.detailName}>{selectedNode.label}</div>

              {selectedNode.meta && (
                <div className={styles.detailMeta}>
                  {selectedNode.meta.startLine != null && (
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>위치</span>
                      <span className={styles.metaVal}>
                        L{selectedNode.meta.startLine} → L{selectedNode.meta.endLine}
                      </span>
                    </div>
                  )}
                  {selectedNode.meta.methodCount != null && (
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>메서드 수</span>
                      <span className={styles.metaVal}>{selectedNode.meta.methodCount}</span>
                    </div>
                  )}
                  {selectedNode.meta.fileCount != null && (
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>파일 수</span>
                      <span className={styles.metaVal}>{selectedNode.meta.fileCount}</span>
                    </div>
                  )}
                  {selectedNode.meta.childDirCount != null && (
                    <div className={styles.metaRow}>
                      <span className={styles.metaKey}>하위 디렉토리</span>
                      <span className={styles.metaVal}>{selectedNode.meta.childDirCount}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.panelEmpty}>
              <span>노드를 클릭하면</span>
              <span>상세 정보가 표시됩니다.</span>
            </div>
          )}

          {/* 범례 */}
          <div className={styles.legend}>
            <div className={styles.legendTitle}>범례</div>
            {[
              { color: '#3b82f6', label: '📁 디렉토리' },
              { color: '#10b981', label: '📄 파일' },
              { color: '#f59e0b', label: '🏛️ 클래스' },
              { color: '#a855f7', label: '⚡ 함수 / 메서드' },
            ].map(({ color, label }) => (
              <div key={label} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: color }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
