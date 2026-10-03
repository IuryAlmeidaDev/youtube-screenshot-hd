// Content Script para Extensão: Print do YouTube em HD

(function () {
  'use strict';

  const BUTTON_CLASS = 'ytp-hd-screenshot-btn';
  let isCapturing = false;

  // SVG de câmera no estilo nativo do YouTube
  const CAMERA_ICON_SVG = `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
    </svg>
  `;

  // Função para sanitizar o nome do arquivo
  function sanitizeFilename(name) {
    return name
      .replace(/[\\/:*?"<>|]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 60);
  }

  // Formata os segundos em MMmSSs
  function formatTime(seconds) {
    const totalSecs = Math.floor(seconds || 0);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}m${String(secs).padStart(2, '0')}s`;
  }

  // Notificação Toast na tela
  function showToast(message, badgeText) {
    let toast = document.querySelector('.yt-screenshot-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'yt-screenshot-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <span>${message}</span>
      ${badgeText ? `<span class="yt-screenshot-badge">${badgeText}</span>` : ''}
    `;

    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Efeito de Flash na tela ao fotografar
  function triggerFlashEffect(player) {
    if (!player) return;
    const flash = document.createElement('div');
    flash.className = 'yt-screenshot-flash-overlay';
    player.appendChild(flash);

    requestAnimationFrame(() => {
      flash.style.opacity = '0';
      setTimeout(() => {
        if (flash.parentNode) {
          flash.parentNode.removeChild(flash);
        }
      }, 300);
    });
  }

  // Captura o quadro atual do vídeo na resolução original
  function captureScreenshot() {
    if (isCapturing) return;

    const video = document.querySelector('video.html5-main-video') || document.querySelector('video');
    const player = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');

    if (!video || !video.videoWidth || !video.videoHeight) {
      showToast('⚠️ Nenhum vídeo pronto para captura', '');
      return;
    }

    isCapturing = true;

    try {
      // Cria canvas off-screen nas dimensões nativas do vídeo (1080p, 4k, etc)
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Efeito visual imediato
      triggerFlashEffect(player);

      // Obter título do vídeo
      const titleElem = document.querySelector('h1.ytd-watch-metadata yt-formatted-string') ||
                        document.querySelector('h1.title yt-formatted-string') ||
                        document.querySelector('h1.ytd-video-primary-info-renderer');
      
      const rawTitle = titleElem ? titleElem.textContent : document.title.replace(' - YouTube', '');
      const cleanTitle = sanitizeFilename(rawTitle || 'youtube_screenshot');
      const timeStr = formatTime(video.currentTime);
      const resolution = `${video.videoHeight}p`;
      const filename = `${cleanTitle}_${timeStr}_${resolution}.png`;

      // Converte para blob e faz download
      canvas.toBlob((blob) => {
        if (!blob) {
          isCapturing = false;
          return;
        }

        // Tenta copiar para o clipboard simultaneamente (ótimo para colar no WhatsApp / Discord)
        if (navigator.clipboard && window.ClipboardItem) {
          try {
            navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]).catch(() => {}); // silencia se a aba não estiver focada
          } catch (e) {}
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          isCapturing = false;
        }, 300);

        showToast('📸 Foto salva com sucesso!', resolution);
      }, 'image/png');

    } catch (err) {
      console.error('Erro ao capturar screenshot:', err);
      isCapturing = false;
      showToast('❌ Erro ao capturar imagem', '');
    }
  }

  // Injeta o botão na barra de controles do player
  function injectButton() {
    const rightControls = document.querySelector('.ytp-right-controls');
    if (!rightControls) return;

    // Se já tiver o botão, não insere duplicado
    if (rightControls.querySelector(`.${BUTTON_CLASS}`)) return;

    const button = document.createElement('button');
    button.className = `ytp-button ${BUTTON_CLASS}`;
    button.title = 'Capturar Screenshot em HD (Atalho: Shift + S)';
    button.setAttribute('aria-label', 'Capturar Screenshot em HD');
    button.innerHTML = CAMERA_ICON_SVG;

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      captureScreenshot();
    });

    // Insere antes do primeiro botão de controle à direita (ex: legendas ou configurações)
    if (rightControls.firstChild) {
      rightControls.insertBefore(button, rightControls.firstChild);
    } else {
      rightControls.appendChild(button);
    }
  }

  // Atalho de Teclado (Shift + S)
  document.addEventListener('keydown', (e) => {
    // Ignora se estiver digitando em comentários, barra de pesquisa, etc.
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) {
      return;
    }

    if (e.shiftKey && (e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      captureScreenshot();
    }
  });

  // Monitora mudanças de página no YouTube (SPA)
  window.addEventListener('yt-navigate-finish', () => {
    setTimeout(injectButton, 500);
    setTimeout(injectButton, 1500);
  });

  // Intervalo de segurança leve para garantir que o botão sempre apareça
  setInterval(injectButton, 1000);

  // Escuta mensagem vinda do popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'capture') {
      captureScreenshot();
      sendResponse({ status: 'ok' });
    }
  });

  // Execução inicial
  injectButton();
})();
