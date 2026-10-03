document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('openYouTubeBtn');

  // Verifica a aba ativa
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const isYouTube = currentTab && currentTab.url && currentTab.url.includes('youtube.com/watch');

    if (isYouTube) {
      btn.innerHTML = '📸 Capturar Print Agora';
      btn.addEventListener('click', () => {
        chrome.tabs.sendMessage(currentTab.id, { action: 'capture' }, () => {
          window.close();
        });
      });
    } else {
      btn.addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://www.youtube.com' });
        window.close();
      });
    }
  });
});
