// VISION app Service Worker - キャッシュ無効化版
const SW_VERSION = 'v' + Date.now();

// インストール: 即座にアクティベート
self.addEventListener('install', (e) => {
  console.log('[SW] install', SW_VERSION);
  self.skipWaiting();
});

// アクティベート: 古いキャッシュを全削除
self.addEventListener('activate', (e) => {
  console.log('[SW] activate', SW_VERSION);
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// フェッチ: 必ずネットワークから取得（キャッシュ使わない）
self.addEventListener('fetch', (e) => {
  // GETリクエストのみ
  if (e.request.method !== 'GET') return;
  
  e.respondWith(
    fetch(e.request, {cache: 'no-store'})
      .then(response => {
        // 成功時はそのまま返す（キャッシュには保存しない）
        return response;
      })
      .catch(() => {
        // オフライン時のみフォールバック
        return new Response(
          '<html><body style="font-family:sans-serif;padding:30px;text-align:center;"><h2>オフライン</h2><p>ネット接続を確認して再読込してください</p><button onclick="location.reload()" style="padding:12px 24px;background:#B2261C;color:#fff;border:none;border-radius:8px;font-size:14px;">再読込</button></body></html>',
          {
            status: 200,
            headers: {'Content-Type': 'text/html; charset=utf-8'}
          }
        );
      })
  );
});

// メッセージ受信: 強制更新コマンド
self.addEventListener('message', (e) => {
  if (e.data && e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
