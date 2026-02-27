document.addEventListener('keydown', (e) => {
  // Option + N (Mac) or Alt + N (Windows)
  if (e.altKey && e.code === 'KeyN') {
    let name = "〇〇"; // デフォルト

    // ダイアログ（リプライ画面）内のツイートから名前を取得する試み
    // X（Twitter）のDOMは複雑で変わりやすいため、いくつかのセレクタを試す
    try {
      const dialogs = document.querySelectorAll('div[role="dialog"]');
      if (dialogs.length > 0) {
        // 表示中のダイアログの最初のツイート要素を探す
        const firstTweet = dialogs[0].querySelector('[data-testid="tweet"]');
        if (firstTweet) {
          // ツイート内のテキスト要素から名前らしきものを抽出
          // プロフィール画像横の名前部分のSpanを狙う
          const spans = firstTweet.querySelectorAll('div[dir="ltr"] > span > span');
          if (spans.length > 0) {
            name = spans[0].innerText;
          } else {
            const userNames = firstTweet.querySelectorAll('a[role="link"] span');
            if (userNames.length > 0) {
              name = userNames[0].innerText;
            }
          }
        }
      } else {
        // 単一ページ（ツイート個別ページ）の場合
        const article = document.querySelector('article[data-testid="tweet"]');
        if (article) {
          const spans = article.querySelectorAll('div[dir="ltr"] > span > span');
          if (spans.length > 0) {
            name = spans[0].innerText;
          }
        }
      }
    } catch (err) {
      console.error("名前の取得に失敗しました", err);
    }

    // 名前から特定の絵文字などを除外する簡単なクリーンアップ
    name = name.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '').trim();

    // chrome.storageから設定値を読み込んでテキストを作成
    chrome.storage.sync.get({
      prefix: '',
      suffix: 'さん'
    }, (items) => {
      const textToCopy = `${items.prefix}${name}${items.suffix}`;

      // クリップボードにコピー
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`コピーしました:\n${textToCopy}`);
      }).catch(err => {
        console.error('クリップボードのコピーに失敗しました: ', err);
      });
    });
  }
});

// 画面上に小さな通知を出す関数
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = 'rgba(29, 155, 240, 0.9)'; // Xの青色っぽい色
  toast.style.color = '#fff';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '999px';
  toast.style.zIndex = '999999';
  toast.style.fontSize = '15px';
  toast.style.fontWeight = 'bold';
  toast.style.pointerEvents = 'none';
  toast.style.transition = 'opacity 0.3s ease-in-out';

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
