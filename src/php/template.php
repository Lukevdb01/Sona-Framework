<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SSR VDOM Demo</title>
  <link rel="icon" href="/favicon.ico" />
</head>
<body>
  <div>
    <h1>Realtime SSR VDOM Demo</h1>
    <form id="demo-form">
      <label for="name">Naam:</label>
      <input type="text" id="name" name="name" value="" autocomplete="off" />
      <button type="submit">Verstuur</button>
    </form>
    <div id="ssr-output"></div>
  </div>
  <script type="module">
    import { SonaClientApp } from '/ionx/sona-framework/dist/core/sona.js';

    // Helper: build VDOM for the form state
    function buildVDOM(name) {
      return {
        type: 'div',
        props: { class: 'ssr-content' },
        children: [
          { type: 'h2', props: {}, children: [ name ? `Hallo, ${name}!` : 'Voer je naam in.' ] },
          { type: 'p', props: {}, children: [ 'Dit is server-side rendered in realtime.' ] }
        ]
      };
    }

    // Mount SonaClientApp to the output div and use dom.php as the patch endpoint
    const app = new SonaClientApp(document.getElementById('ssr-output'), 'dom.php');

    // Initial render
    app.sync(buildVDOM(''));

    // Only update SSR on submit
    document.getElementById('demo-form').addEventListener('submit', e => {
      e.preventDefault();
      const nameValue = document.getElementById('name').value;
      app.sync(buildVDOM(nameValue)).then(() => {
        // Restore input value after SSR DOM update
        document.getElementById('name').value = nameValue;
      });
    });
  </script>
</body>
</html>
