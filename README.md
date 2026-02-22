# YT Thumbnail Edge Cache Proxy

YouTube サムネイルを img.youtube.com と同じURL形式で取得できる
CDN最適化 + Edgeキャッシュ対応プロキシです。

--------------------------------------------------

■ 目的

- img.youtube.com がブロックされている環境でもサムネ表示可能
- 学校 / 社内 / 制限ネットワーク対応
- YouTubeへのアクセス回数を最小化
- CDNとして動作する高速配信

--------------------------------------------------

■ 特徴

- YouTube公式と完全互換URL
- 初回のみYouTubeから取得
- 取得画像をサーバーに保存（Edge Cache）
- 2回目以降はYouTube不要
- CDNキャッシュ最適化ヘッダ
- 自動画質フォールバック
- CORS対応

--------------------------------------------------

■ URL形式（完全互換）

通常のYouTube：

[https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg](https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg)

このプロキシ：

[https://your-domain/vi/VIDEO_ID/hqdefault.jpg](https://wista-thumb-01.onrender.com/vi/VIDEO_ID/hqdefault.jpg)

既存コードのURLを置き換えるだけで使用できます。

--------------------------------------------------

■ 動作仕組み

【初回アクセス】

Client
 ↓
Proxy Server
 ↓
img.youtube.com
 ↓
画像保存（cache）

【2回目以降】

Client
 ↓
Proxy Server（保存済み画像）

→ YouTubeへアクセスしません。

--------------------------------------------------

■ 画質フォールバック

存在しない場合、自動で切り替え：

maxresdefault.jpg
↓
hqdefault.jpg
↓
mqdefault.jpg
↓
default.jpg

404を防止します。

--------------------------------------------------

■ プロジェクト構成

yt-thumb-edge/
├── cache/        (サムネ保存ディレクトリ・自動生成)
├── index.js
├── package.json
└── .gitignore

--------------------------------------------------

■ デプロイ（Render）

1. GitHubへアップロード

以下をpush：

index.js
package.json
.gitignore

--------------------------------

2. Render設定

Service Type : Web Service
Runtime      : Node
Build Command: npm install
Start Command: npm start

Deploy を押すだけ。

--------------------------------------------------

■ 動作確認

[https://wista-thumb-01.onrender.com/vi/dQw4w9WgXcQ/hqdefault.jpg](https://wista-thumb-01.onrender.com/vi/dQw4w9WgXcQ/hqdefault.jpg)

サムネが表示されれば成功。

--------------------------------------------------

■ キャッシュ仕様

Cache-Control: public, max-age=31536000, immutable
Access-Control-Allow-Origin: *

- CDN長期キャッシュ
- 再検証なし
- 高速配信

--------------------------------------------------

■ Render Free Plan 注意

Render Free は再起動時に：

cache フォルダが削除される可能性があります。

永続保存したい場合：

- Cloudflare R2
- S3互換ストレージ

との連携を推奨。

--------------------------------------------------

■ セキュリティ

- .jpg のみ許可
- 任意URLプロキシ不可
- YouTubeサムネ専用設計

--------------------------------------------------

■ 将来拡張（予定）

- WebP / AVIF 自動変換
- Cloudflare Edge Cache
- 永続ストレージ対応
- 動画URL直接入力API
- Smart Cache Index

--------------------------------------------------

■ License

MIT License

--------------------------------------------------

■ 概要

YT Thumbnail Edge Cache Proxy は
YouTubeサムネイルを独立CDNとして配信する軽量プロキシです。

「YouTubeが見えなくてもサムネは表示できる」
