// chrome.commandsAPIを使ってショートカットキーの入力を監視するバックグラウンドスクリプトです。
// このスクリプトはユーザーがショートカットを押した時だけ起動し、アクティブなタブ（content.js）に「実行して！」というメッセージを送ります。

chrome.commands.onCommand.addListener((command) => {
  if (command === "copy-name") {
    // 現在アクティブになっているタブを探す
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const tabId = tabs[0].id;
      
      // 見つけたタブの中で動いている content.js に対して、「DO_COPY_NAME」というメッセージ（合図）を送る
      chrome.tabs.sendMessage(tabId, { action: "DO_COPY_NAME" }).catch(err => {
          // もしX（Twitter）以外のページでショートカットが押された場合、content.jsがいないのでエラーになる。
          // その場合は無視する。
          console.log("対象ページではないため無視しました: ", err);
      });
    });
  }
});
