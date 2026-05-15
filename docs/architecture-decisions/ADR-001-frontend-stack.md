# ADR-001: フロントエンド構成（React + Vite を採用）

## 状況
ローカルファーストPWAのフロントエンド技術を決める必要がある。将来クラウドバックアップ・Web公開機能の追加予定がある。

## 選択肢
- React + Vite（SPA）
- Next.js（SSR/フルスタック）
- Svelte + Vite

## 決定
**React + Vite + TypeScript（SPA / PWA）**

## 理由
- kodawarimap はローカルファースト。データは端末内・地図はクライアント描画で、SSR/SSG の恩恵がほぼない
- Next.js は SSR が宝の持ち腐れになり、むしろ PWA 化を複雑にする
- MapLibre / Dexie のエコシステム・実装例が React 中心で情報量が最多
- Svelte はバンドルサイズで魅力的だが地図系の実装例が少なくハマりやすい

## 将来機能への配慮
- **クラウドバックアップ**: フロントFWに影響しない（APIを叩くだけ）
- **Web公開機能**: SEO/OGPが必要でSSR/SSGが活きる。ただしアプリ本体とは性質が真逆（公開・read only・オンライン）。**1つのNext.jsに統合せず、将来「分離したSSR/SSGサーフェス（Astro or Next.js）」として追加**し、monorepoでUIコンポーネントを共有する
- 軽い保険として、UIをDexie/IndexedDBに直結させずデータアクセス層（=Clean Architectureのリポジトリport）を1枚挟む
