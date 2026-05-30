export type GroupRole = "owner" | "member";
export type MemberStatus = "pending_key" | "active";

export interface GroupMember {
  userId: string;
  email: string;
  role: GroupRole;
  status: MemberStatus;
  joinedAt: string;
  /** safety number 表示用フィンガープリント */
  fingerprint: string | null;
}

export interface FamilyGroup {
  id: string;
  /** グループ鍵で復号済みのグループ名 */
  name: string;
  keyVersion: number;
  maxSeats: number;
  role: GroupRole;
}

/** GET /api/groups から返るサーバーの生データ（名前は暗号化済み） */
export interface RawGroupRecord {
  id: string;
  encryptedName: string;
  nameIv: string;
  keyVersion: number;
  maxSeats: number;
  role: GroupRole;
}
