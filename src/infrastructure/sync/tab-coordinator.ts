/**
 * マルチタブ調整
 *
 * Web Locks API でリーダー選出し、リーダータブだけが同期処理を実行する。
 * BroadcastChannel で他タブへ同期完了を通知する。
 * BroadcastChannel が使えない環境は localStorage フォールバックを使用する。
 */

const LOCK_NAME = "kdm:sync-leader";
const BROADCAST_CHANNEL_NAME = "kdm:sync";
const BROADCAST_MESSAGE_TYPE = "sync-complete";

/** localStorage フォールバック用のキー */
const LS_SYNC_COMPLETE_KEY = "kdm:sync-complete-ts";

type BroadcastMessage = { type: typeof BROADCAST_MESSAGE_TYPE };

/** BroadcastChannel が利用可能かどうか */
function isBroadcastChannelAvailable(): boolean {
  return typeof BroadcastChannel !== "undefined";
}

/** Web Locks API が利用可能かどうか */
function isWebLocksAvailable(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.locks !== "undefined";
}

export const tabCoordinator = {
  /**
   * このタブが同期リーダーである間だけ callback を実行する。
   *
   * Web Locks が利用可能な場合:
   *   - exclusive ロックを取得し、callback の完了まで保持する
   *   - 他タブはロックが解放されるまでコールバックを実行できない
   *
   * Web Locks が利用不可能な場合:
   *   - フォールバックとしてそのまま callback を実行する
   */
  async acquireSyncLead(callback: () => Promise<void>): Promise<void> {
    if (isWebLocksAvailable()) {
      await navigator.locks.request(LOCK_NAME, { mode: "exclusive" }, async () => {
        await callback();
      });
    } else {
      // フォールバック: ロックなしで実行
      await callback();
    }
  },

  /**
   * 他タブに「同期完了・IndexedDB 再読込して」を通知する。
   */
  broadcastSyncComplete(): void {
    if (isBroadcastChannelAvailable()) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({ type: BROADCAST_MESSAGE_TYPE } satisfies BroadcastMessage);
      // メッセージ送信後すぐにクローズ
      channel.close();
    } else {
      // localStorage フォールバック: タイムスタンプを更新して storage イベントを発生させる
      localStorage.setItem(LS_SYNC_COMPLETE_KEY, String(Date.now()));
    }
  },

  /**
   * 同期完了通知を受け取ったときのコールバックを登録する。
   * unsubscribe 関数を返す。
   */
  onSyncComplete(callback: () => void): () => void {
    if (isBroadcastChannelAvailable()) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

      const handler = (event: MessageEvent<BroadcastMessage>) => {
        if (event.data?.type === BROADCAST_MESSAGE_TYPE) {
          callback();
        }
      };

      channel.addEventListener("message", handler);

      return () => {
        channel.removeEventListener("message", handler);
        channel.close();
      };
    } else {
      // localStorage フォールバック
      const handler = (event: StorageEvent) => {
        if (event.key === LS_SYNC_COMPLETE_KEY) {
          callback();
        }
      };

      window.addEventListener("storage", handler);

      return () => {
        window.removeEventListener("storage", handler);
      };
    }
  },
};
