const express = require("express");

const app = express();

// 試す画質順
const FALLBACK = [
  "maxresdefault.jpg",
  "hqdefault.jpg",
  "mqdefault.jpg",
  "default.jpg"
];

async function fetchThumbnail(id, requested) {
  const order = [
    requested,
    ...FALLBACK.filter(q => q !== requested)
  ];

  for (const file of order) {
    const url = `https://img.youtube.com/vi/${id}/${file}`;
    const res = await fetch(url);

    if (res.ok) {
      return res;
    }
  }

  return null;
}

app.get("/vi/:id/:file", async (req, res) => {
  const { id, file } = req.params;

  if (!file.endsWith(".jpg"))
    return res.status(400).send("invalid");

  try {
    const yt = await fetchThumbnail(id, file);

    if (!yt)
      return res.status(404).send("not found");

    res.set({
      "Content-Type": "image/jpeg",

      //CDN最適ヘッダ
      "Cache-Control": "public, max-age=31536000, immutable",
      "CDN-Cache-Control": "public, max-age=31536000",
      "Access-Control-Allow-Origin": "*"
    });

    yt.body.pipe(res);

  } catch {
    res.status(500).send("proxy error");
  }
});

app.get("/", (_, res) =>
  res.send("YT Thumbnail CDN Proxy")
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("running"));
