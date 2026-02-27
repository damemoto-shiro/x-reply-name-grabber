// 保存ボタンが押されたときの処理
document.getElementById('save').addEventListener('click', () => {
  const prefix = document.getElementById('prefix').value;
  const suffix = document.getElementById('suffix').value;

  chrome.storage.sync.set({
    prefix: prefix,
    suffix: suffix
  }, () => {
    // 保存完了のメッセージを表示
    const status = document.getElementById('status');
    status.textContent = '設定を保存しました。';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  });
});

// ページ読み込み時に保存されている設定を復元する
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get({
    prefix: '',    // デフォルト値
    suffix: 'さん' // デフォルト値
  }, (items) => {
    document.getElementById('prefix').value = items.prefix;
    document.getElementById('suffix').value = items.suffix;
  });
});
