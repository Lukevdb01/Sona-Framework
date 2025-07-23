<!DOCTYPE html>
<html lang="nl">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Virtual DOM PHP Renderer</title>
  <link rel="icon" href="/favicon.ico" />
  <script src="dist/core/renderer.js" type="module"></script>
  <script src="dist/core/vnode.js" type="module"></script>
</head>

<body>
  <div id="output"><div>

  <script type="module">
    const vnode = {
      type: "div",
      props: { class: "box" },
      children: [
        {
          type: "h1",
          props: { style: "color: #007bff;" },
          children: ["Server-Side Rendered Titel"]
        },
        {
          type: "p",
          props: {},
          children: ["Deze inhoud is gegenereerd via de PHP Virtual DOM renderer."]
        }
      ]
    };

    fetch(window.location.href, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vnode)
    })
    .then(res => res.json())
    .then(json => {
      if (json.html) {
        document.getElementById("output").innerHTML = json.html;
      } else {
        document.getElementById("output").innerText = "Fout bij server-rendering.";
        console.error(json);
      }
    })
    .catch(err => {
      document.getElementById("output").innerText = "Netwerkfout.";
      console.error(err);
    });
  </script>
</body>

</html>
