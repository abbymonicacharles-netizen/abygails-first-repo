export function ThemeScript() {
  const script = `
    (function () {
      try {
        var theme = localStorage.getItem('ac-theme');
        var size = localStorage.getItem('ac-text-size');
        document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
        document.documentElement.setAttribute('data-text-size', size === 'sm' || size === 'lg' ? size : 'md');
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
