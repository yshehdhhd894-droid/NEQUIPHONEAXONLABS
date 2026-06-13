/** Reinicia animaciones SMIL del SVG y avisa a React Native cuando empiezan. */
export const MUNDIAL_RESTART_ANIMATIONS_JS = `
(function() {
  function notify() {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage('anim-start');
    }
  }
  var svg = document.querySelector('svg');
  if (!svg || !svg.parentNode) {
    notify();
    return true;
  }
  var clone = svg.cloneNode(true);
  svg.parentNode.replaceChild(clone, svg);
  requestAnimationFrame(function() {
    requestAnimationFrame(notify);
  });
  return true;
})();
true;
`;
