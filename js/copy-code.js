/* ============================================
   Copy-to-Clipboard for Code Blocks
   W84-1: Vanilla JS, no dependencies
   ============================================ */

(function () {
  'use strict';

  function initCopyButtons() {
    var blocks = document.querySelectorAll('.code-block');
    blocks.forEach(function (block) {
      var btn = block.querySelector('.code-block__copy');
      if (!btn) return;

      btn.addEventListener('click', function () {
        var code = block.querySelector('code');
        if (!code) return;

        var text = code.textContent;
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        }).catch(function () {
          // Fallback for older browsers
          var textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
  } else {
    initCopyButtons();
  }
})();
