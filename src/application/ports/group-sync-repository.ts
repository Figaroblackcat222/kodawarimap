/**
 * グループ同期リポジトリのポート
 */
import type { RawGroupRecord, GroupMember } from "@domain/entities/family-group";

export interface GroupPinSyncRecord {
  id: string;
  authorId: string;
  keyVersion: number;
  encryptedPayload: string;
  iv: string;
  hlcPhysical: number;
  hlcLogical: number;
  hlcNodeId: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface GroupSyncRepository {
  // ── グループ管理 ──────────────────────────────────────────────────────────
  createGroup(data: {
    encryptedName: string;
    nameIv: string;
    wrappedGroupKey: string;
  }): Promise<{ groupId: string }>;

  listGroups(): Promise<RawGroupRecord[]>;

  listMembers(groupId: string): Promise<GroupMember[]>;

  /** 招待トークンを発行する */
  inviteMember(groupId: string, inviteeEmail: string): Promise<{ token: string }>;

  /** トークンを使って招待を承認する（pending_key になる） */
  acceptInvite(token: string): Promise<{ groupId: string }>;

  /** 自分用のラップ済みグループ鍵を取得する */
  fetchMyGroupKey(groupId: string): Promise<{ wrappedGroupKey: string; keyVersion: number } | null>;

  /** pending_key メンバーとその公開鍵を取得する */
  listPendingKeys(
    groupId: string
  ): Promise<Array<{ userId: string; publicKey: string; fingerprint: string }>>;

  /** グループ鍵を pending メンバーに付与する */
  grantMemberKey(groupId: string, userId: string, wrappedGroupKey: string): Promise<void>;

  // ── グループピン同期 ───────────────────────────────────────────────────────
  fetchGroupPinsSince(
    groupId: string,
    physical: number,
    logical: number
  ): Promise<GroupPinSyncRecord[]>;

  pushGroupPin(
    groupId: string,
    pinId: string,
    data: {
      encryptedPayload: string;
      iv: string;
      hlcPhysical: number;
      hlcLogical: number;
      hlcNodeId: string;
      isDeleted: boolean;
      keyVersion: number;
    }
  ): Promise<{ hlcPhysical: number; hlcLogical: number }>;

  // ── Phase 4: グループ写真 ──────────────────────────────────────────────────

  /** グループピンに紐づく写真メタ一覧を取得する */
  fetchGroupPhotoList(
    groupId: string,
    pinId: string
  ): Promise<
    Array<{
      id: string;
      hlcPhysical: number;
      hlcLogical: number;
      encryptedMeta: string;
      metaIv: string;
      keyVersion: number;
    }>
  >;

  /** グループ写真を暗号化バイナリ + メタで multipart アップロードする */
  pushGroupPhotoBinary(
    groupId: string,
    photoId: string,
    encryptedBlob: ArrayBuffer,
    meta: {
      encryptedMeta: string;
      metaIv: string;
      pinId: string;
      keyVersion: number;
      hlcPhysical: number;
      hlcLogical: number;
      hlcNodeId: string;
    }
  ): Promise<void>;

  /** グループ写真の暗号化バイナリを取得する */
  fetchGroupPhotoBinary(groupId: string, photoId: string): Promise<ArrayBuffer>;

  /** グループ写真を論理削除する */
  deleteGroupPhoto(groupId: string, photoId: string): Promise<void>;

  // ── Phase 3: 失効 + 鍵ローテーション ─────────────────────────────────────

  /** メンバーをソフト失効する（オーナーのみ、または自分自身が退会） */
  revokeGroupMember(groupId: string, userId: string): Promise<void>;

  /** アクティブメンバー全員の公開鍵を取得する（鍵ローテーション用） */
  fetchActivePublicKeys(
    groupId: string
  ): Promise<Array<{ userId: string; publicKey: string; fingerprint: string }>>;

  /** グループ鍵をローテーションする（新 key_version + 全メンバー分の wrappedGroupKey を送信） */
  rotateGroupKey(
    groupId: string,
    data: {
      newKeyVersion: number;
      wrappedKeys: Array<{ userId: string; wrappedGroupKey: string }>;
    }
  ): Promise<void>;
}
