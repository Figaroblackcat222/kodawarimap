/**
 * 家族グループ共有管理シート
 *
 * - グループ作成
 * - メンバー一覧 + safety number 表示
 * - 招待トークン発行・コピー
 * - アクセス権付与待ちバナー
 * - 注意事項通知
 */
import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  Copy,
  Check,
  X,
  Fingerprint,
  AlertTriangle,
  Clock,
  UserX,
  RefreshCw,
  Trash2,
} from "lucide-react";
import type { FamilyGroup, GroupMember, RawGroupRecord } from "@domain/entities/family-group";
import type { KeyManagementService } from "@application/ports/key-management-service";
import type { GroupSyncRepository } from "@application/ports/group-sync-repository";
import type { KeySyncRepository } from "@application/ports/key-sync-repository";
import type { PinRepository } from "@application/ports/pin-repository";
import { createGroup as createGroupUseCase } from "@application/use-cases/create-group";
import { grantPendingMemberKeys } from "@application/use-cases/grant-pending-member-keys";
import { revokeMember } from "@application/use-cases/revoke-member";
import { rotateGroupKey } from "@application/use-cases/rotate-group-key";

interface Props {
  onClose: () => void;
  keyManagementService: KeyManagementService;
  groupSyncRepository: GroupSyncRepository;
  keySyncRepository: KeySyncRepository;
  pinRepository: PinRepository;
  encryptionKey: CryptoKey | null;
  getPrivateKey: () => Promise<CryptoKey | null>;
  saveGroupKey: (groupId: string, key: CryptoKey) => Promise<void>;
  getGroupKey: (groupId: string) => Promise<CryptoKey | null>;
  /** グループ一覧が読み込まれた時のコールバック（親が availableGroups を更新するために使用） */
  onGroupsLoaded?: (groups: Array<{ groupId: string; groupName: string }>) => void;
}

const NOTICES = [
  "パスフレーズを忘れると共有データも復元できません。大切に保管してください。",
  "招待後、既存メンバーの端末がオンラインになるまで共有データは表示されません（アクセス権付与待ち）。",
  "メンバーを削除する際は、あわせて「暗号鍵の再作成」を実施してください。暗号鍵の再作成はグループの暗号鍵を新しく作り直します。これにより、削除したメンバーは以降のグループデータを閲覧できなくなります。",
  "「安全番号」を家族と口頭で確認することでなりすましを防止できます。",
];

export function FamilyGroupSheet({
  onClose,
  keyManagementService,
  groupSyncRepository,
  keySyncRepository,
  pinRepository,
  encryptionKey,
  getPrivateKey,
  saveGroupKey,
  getGroupKey,
  onGroupsLoaded,
}: Props) {
  const [groups, setGroups] = useState<FamilyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // グループ作成モード
  const [creating, setCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // 選択中グループのメンバー
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  // 招待
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 失効
  const [revokingUserId, setRevokingUserId] = useState<string | null>(null);

  // グループ削除
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  // 鍵ローテーション
  const [rotateLoading, setRotateLoading] = useState(false);
  const [rotateProgress, setRotateProgress] = useState<{ current: number; total: number } | null>(
    null
  );
  const [rotateConfirm, setRotateConfirm] = useState(false);

  // グループ一覧取得
  const loadGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await groupSyncRepository.listGroups();
      // グループ名を復号
      const decrypted = await Promise.all(
        raw.map(async (r: RawGroupRecord): Promise<FamilyGroup> => {
          const key = await getGroupKey(r.id);
          let name = `（グループ ${r.id.slice(0, 6)}）`;
          if (key) {
            try {
              name = await keyManagementService
                .decryptWithGroupKey(key, r.encryptedName, r.nameIv)
                .catch(() => name);
            } catch {}
          }
          return { id: r.id, name, keyVersion: r.keyVersion, maxSeats: r.maxSeats, role: r.role };
        })
      );
      setGroups(decrypted);
      onGroupsLoaded?.(decrypted.map((g) => ({ groupId: g.id, groupName: g.name })));
    } catch (e) {
      setError("グループ情報を取得できませんでした。");
    } finally {
      setLoading(false);
    }
  }, [groupSyncRepository, getGroupKey, keyManagementService, onGroupsLoaded]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  // メンバー一覧 + pending_key への鍵付与
  const loadMembers = useCallback(
    async (groupId: string) => {
      setMembersLoading(true);
      setSelectedGroupId(groupId);
      setInviteToken(null);
      try {
        const list = await groupSyncRepository.listMembers(groupId);
        setMembers(list);

        // pending_key がいれば鍵を付与する
        const hasPending = list.some((m) => m.status === "pending_key");
        if (hasPending) {
          const groupKey = await getGroupKey(groupId);
          if (groupKey) {
            await grantPendingMemberKeys(
              groupId,
              groupKey,
              keyManagementService,
              groupSyncRepository
            );
            // 再取得
            const updated = await groupSyncRepository.listMembers(groupId);
            setMembers(updated);
          }
        }
      } catch {
        setError("メンバー情報を取得できませんでした。");
      } finally {
        setMembersLoading(false);
      }
    },
    [groupSyncRepository, getGroupKey, keyManagementService]
  );

  // グループ作成
  async function handleCreateGroup() {
    if (!newGroupName.trim() || !encryptionKey) return;
    setCreateLoading(true);
    setError(null);
    try {
      await createGroupUseCase(newGroupName.trim(), {
        keyManagementService,
        keySyncRepository,
        groupSyncRepository,
        getPrivateKey,
        saveGroupKey,
      });
      setCreating(false);
      setNewGroupName("");
      await loadGroups();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "グループ作成に失敗しました。");
    } finally {
      setCreateLoading(false);
    }
  }

  // 招待トークン発行
  async function handleInvite() {
    if (!selectedGroupId || !inviteEmail.trim()) return;
    setInviteLoading(true);
    setError(null);
    try {
      const { token } = await groupSyncRepository.inviteMember(selectedGroupId, inviteEmail.trim());
      setInviteToken(token);
      setInviteEmail("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "招待に失敗しました。");
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleRevoke(targetUserId: string) {
    if (!selectedGroupId) return;
    setRevokingUserId(targetUserId);
    setError(null);
    try {
      await revokeMember(selectedGroupId, targetUserId, groupSyncRepository);
      const updated = await groupSyncRepository.listMembers(selectedGroupId);
      setMembers(updated);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "失効に失敗しました。");
    } finally {
      setRevokingUserId(null);
    }
  }

  async function handleDeleteGroup(groupId: string, groupName: string) {
    if (!window.confirm(`「${groupName}」を削除しますか？\nグループのデータはサーバーから削除されます。`)) return;
    setDeletingGroupId(groupId);
    setError(null);
    try {
      await groupSyncRepository.deleteGroup(groupId);
      setSelectedGroupId(null);
      setMembers([]);
      await loadGroups();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "グループの削除に失敗しました。");
    } finally {
      setDeletingGroupId(null);
    }
  }

  async function handleRotateKey() {
    if (!selectedGroupId || !selectedGroup) return;
    const groupKey = await getGroupKey(selectedGroupId);
    if (!groupKey) {
      setError("グループ鍵が見つかりません。");
      return;
    }
    setRotateLoading(true);
    setRotateProgress(null);
    setRotateConfirm(false);
    setError(null);
    try {
      const { newGroupKey } = await rotateGroupKey(
        selectedGroupId,
        selectedGroup.keyVersion,
        groupKey,
        {
          keyManagementService,
          groupSyncRepository,
          pinRepository,
          groupName: selectedGroup.name,
          onProgress: (current, total) => setRotateProgress({ current, total }),
        }
      );
      await saveGroupKey(selectedGroupId, newGroupKey);
      await loadGroups();
      await loadMembers(selectedGroupId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "暗号鍵の再作成に失敗しました。");
    } finally {
      setRotateLoading(false);
      setRotateProgress(null);
    }
  }

  async function handleCopyToken() {
    if (!inviteToken) return;
    const link = `${window.location.origin}?invite=${inviteToken}`;
    await navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* ヘッダー */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 16px 8px" }}>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-primary)",
            padding: 4,
          }}
        >
          <X size={20} />
        </button>
        <Users size={18} color="#6366f1" />
        <span style={{ fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}>
          家族共有
        </span>
      </div>

      {/* 注意事項バナー */}
      <div
        style={{
          margin: "0 16px 12px",
          background: "var(--bg-secondary)",
          borderRadius: 8,
          padding: 12,
          borderLeft: "3px solid #f59e0b",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
          <AlertTriangle size={14} color="#f59e0b" style={{ marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#f59e0b" }}>
            ご利用前にご確認ください
          </span>
        </div>
        {NOTICES.map((n, i) => (
          <p
            key={i}
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              margin: "2px 0 0 22px",
              lineHeight: 1.5,
            }}
          >
            • {n}
          </p>
        ))}
      </div>

      {error && (
        <div
          style={{
            margin: "0 16px 8px",
            padding: 10,
            background: "#fef2f2",
            borderRadius: 6,
            color: "#dc2626",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* グループ一覧 */}
      <div style={{ padding: "0 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
            グループ
          </span>
          {!creating && (
            <button
              onClick={() => setCreating(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "#6366f1",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              <Plus size={14} /> 作成
            </button>
          )}
        </div>

        {creating && (
          <div
            style={{
              marginBottom: 12,
              padding: 12,
              background: "var(--bg-secondary)",
              borderRadius: 8,
            }}
          >
            <input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="グループ名（例：田中家）"
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                fontSize: 14,
                marginBottom: 8,
                boxSizing: "border-box",
                background: "var(--input-bg)",
                color: "var(--text-primary)",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
              autoFocus
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleCreateGroup}
                disabled={createLoading || !newGroupName.trim()}
                style={{
                  flex: 1,
                  padding: "8px",
                  background: "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 13,
                  opacity: createLoading ? 0.6 : 1,
                }}
              >
                {createLoading ? "作成中…" : "作成する"}
              </button>
              <button
                onClick={() => {
                  setCreating(false);
                  setNewGroupName("");
                }}
                style={{
                  padding: "8px 12px",
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 13,
                  color: "var(--text-primary)",
                }}
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>読み込み中…</p>
        ) : groups.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            グループがありません。「作成」ボタンから始めましょう。
          </p>
        ) : (
          groups.map((g) => (
            <div
              key={g.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <button
                onClick={() => loadMembers(g.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flex: 1,
                  padding: "10px 12px",
                  background: selectedGroupId === g.id ? "#6366f120" : "var(--bg-secondary)",
                  border:
                    selectedGroupId === g.id ? "1px solid #6366f1" : "1px solid var(--border)",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <Users size={16} color="#6366f1" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>
                    {g.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {g.role === "owner" ? "オーナー" : "メンバー"} · 最大 {g.maxSeats} 人
                  </div>
                </div>
              </button>
              {g.role === "owner" && (
                <button
                  onClick={() => handleDeleteGroup(g.id, g.name)}
                  disabled={deletingGroupId === g.id}
                  title="グループを削除"
                  style={{
                    background: "none",
                    border: "1px solid #ef4444",
                    borderRadius: 6,
                    color: "#ef4444",
                    cursor: "pointer",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    opacity: deletingGroupId === g.id ? 0.5 : 1,
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* 選択グループのメンバー */}
      {selectedGroupId && (
        <div style={{ padding: "12px 16px 0" }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
            メンバー：{selectedGroup?.name}
          </span>
          {membersLoading ? (
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>読み込み中…</p>
          ) : (
            <div style={{ marginTop: 8 }}>
              {members.map((m) => (
                <div
                  key={m.userId}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                      {m.email}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {m.role === "owner" ? "オーナー" : "メンバー"}
                      {m.status === "pending_key" && (
                        <span
                          style={{
                            marginLeft: 6,
                            color: "#f59e0b",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <Clock size={10} /> アクセス権付与待ち
                        </span>
                      )}
                    </div>
                    {m.fingerprint && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <Fingerprint size={10} color="var(--text-muted)" />
                        <span
                          style={{
                            fontSize: 10,
                            color: "var(--text-muted)",
                            fontFamily: "monospace",
                          }}
                        >
                          {m.fingerprint}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* オーナーはメンバーを失効できる */}
                  {selectedGroup?.role === "owner" && m.role !== "owner" && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `${m.email} をグループから削除しますか？\n削除後は「暗号鍵の再作成」も実施することで、このメンバーへのアクセスを完全に遮断できます。`
                          )
                        ) {
                          handleRevoke(m.userId);
                        }
                      }}
                      disabled={revokingUserId === m.userId}
                      title="メンバーを削除"
                      style={{
                        background: "none",
                        border: "1px solid #ef4444",
                        borderRadius: 6,
                        color: "#ef4444",
                        cursor: "pointer",
                        padding: "4px 8px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        opacity: revokingUserId === m.userId ? 0.5 : 1,
                        flexShrink: 0,
                      }}
                    >
                      <UserX size={12} />
                      {revokingUserId === m.userId ? "削除中…" : "削除"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 鍵ローテーション */}
          {selectedGroup?.role === "owner" && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: "var(--bg-secondary)",
                borderRadius: 8,
                borderLeft: "3px solid #8b5cf6",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                <RefreshCw size={14} color="#8b5cf6" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#8b5cf6" }}>
                  暗号鍵の再作成
                </span>
              </div>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "0 0 8px" }}>
                メンバー削除後の完全保護のため、新しいグループ鍵を生成して全ピンを再暗号化します。
                ピン数が多い場合は時間がかかります。Wi-Fi 環境で実行してください。
              </p>
              {rotateProgress && (
                <div style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      height: 4,
                      background: "var(--border)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: "#8b5cf6",
                        width: `${rotateProgress.total > 0 ? (rotateProgress.current / rotateProgress.total) * 100 : 0}%`,
                        transition: "width 0.2s",
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                    {rotateProgress.current} / {rotateProgress.total} ピン処理中…
                  </div>
                </div>
              )}
              {!rotateConfirm ? (
                <button
                  onClick={() => setRotateConfirm(true)}
                  disabled={rotateLoading}
                  style={{
                    padding: "6px 12px",
                    background: "#8b5cf6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                    opacity: rotateLoading ? 0.6 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <RefreshCw size={12} />
                  {rotateLoading ? "再作成中…" : "暗号鍵を再作成する"}
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={handleRotateKey}
                    disabled={rotateLoading}
                    style={{
                      padding: "6px 12px",
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 12,
                      opacity: rotateLoading ? 0.6 : 1,
                    }}
                  >
                    実行する
                  </button>
                  <button
                    onClick={() => setRotateConfirm(false)}
                    style={{
                      padding: "6px 12px",
                      background: "none",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 12,
                      color: "var(--text-primary)",
                    }}
                  >
                    キャンセル
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 招待 */}
          {selectedGroup?.role === "owner" && (
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: "var(--text-primary)",
                }}
              >
                メンバーを招待
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="メールアドレス"
                  type="email"
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    fontSize: 13,
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                />
                <button
                  onClick={handleInvite}
                  disabled={inviteLoading || !inviteEmail.trim()}
                  style={{
                    padding: "8px 12px",
                    background: "#6366f1",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 13,
                    opacity: inviteLoading ? 0.6 : 1,
                  }}
                >
                  招待
                </button>
              </div>

              {inviteToken && (
                <div
                  style={{
                    marginTop: 8,
                    padding: 10,
                    background: "var(--bg-secondary)",
                    borderRadius: 6,
                  }}
                >
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                    招待リンクを相手に送ってください
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <code
                      style={{
                        flex: 1,
                        fontSize: 11,
                        wordBreak: "break-all",
                        color: "var(--text-primary)",
                      }}
                    >
                      {`${window.location.origin}?invite=${inviteToken}`}
                    </code>
                    <button
                      onClick={handleCopyToken}
                      style={{
                        flexShrink: 0,
                        padding: "6px 10px",
                        background: copied ? "#22c55e" : "#6366f1",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                      }}
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? "コピー済み" : "コピー"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ height: 32 }} />
    </div>
  );
}
