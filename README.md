# 📸 Print do YouTube em HD - Capturar Foto e Imagem de Vídeo

Uma extensão leve, rápida e moderna para o Google Chrome (Manifest V3) que permite capturar prints e salvar imagens de qualquer vídeo do YouTube em resolução nativa máxima (1080p, 1440p, 4K), com 1 clique e sem barras de progresso ou botões de controle na imagem.

---

## ✨ Recursos

- 🎯 **Resolução Real (1080p / 4K):** Captura o frame original do vídeo na qualidade em que ele está rodando, não apenas o tamanho da tela.
- 🧹 **Imagem Limpa:** Sem botões de play, legendas indesejadas ou barra vermelha do player.
- ⚡ **1 Clique na Barra do Player:** Ícone de câmera integrado diretamente aos controles do YouTube.
- ⌨️ **Atalho de Teclado:** Pressione `Shift + S` para capturar instantaneamente enquanto assiste.
- 📋 **Download + Clipboard:** Salva automaticamente o arquivo `.png` com o nome do vídeo e o tempo exato (ex: `NomeDoVideo_01m45s_1080p.png`) e já copia a imagem para a área de transferência (ótimo para colar no WhatsApp, Discord ou Notion).
- 🔒 **100% Privado e Local:** Nenhum dado é coletado ou enviado para servidores externos. Todo o processamento ocorre no próprio navegador.

---

## 🚀 Como testar no seu Google Chrome (Modo Desenvolvedor)

1. Abra o Google Chrome e digite na barra de endereços:  
   `chrome://extensions/`
2. No canto superior direito, ative a chave **"Modo do desenvolvedor"**.
3. No canto superior esquerdo, clique no botão **"Carregar sem compactação"**.
4. Selecione esta pasta (`youtube-screenshot-hd`).
5. Pronto! Agora abra qualquer vídeo no [YouTube](https://www.youtube.com) e você verá o ícone de câmera ao lado das configurações do player ou poderá usar o atalho `Shift + S`.

---

## 📁 Estrutura do Projeto

```
youtube-screenshot-hd/
├── manifest.json       # Configuração da extensão (Manifest V3)
├── content.js          # Script injetado no player para captura do <canvas>
├── styles.css          # Estilos do botão e efeito de flash
├── popup.html          # Interface rápida ao clicar no ícone da barra de tarefas
├── popup.js            # Lógica de interação do popup
├── icons/              # Ícones oficiais (16x16, 48x48, 128x128)
├── PRIVACY_POLICY.md   # Política de privacidade para a Chrome Web Store
└── README.md           # Documentação do projeto
```

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para mais informações.
