const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const CACHE_DIR = path.join(__dirname, "cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

const FALLBACK = [
  "maxresdefault.jpg",
  "hqdefault.jpg",
  "mqdefault.jpg",
  "default.jpg"
];

// 保存パス
const filePath = (id, file) =>
  path.join(CACHE_DIR, `${id}_${file}`);

// キャッシュ存在確認
const exists = p => fs.existsSync(p);

// YouTube取得
async function download(id, file) {
  const url = `https://img.youtube.com/vi/${id}/${file}`;
  const res = await fetch(url);

  if (!res.ok) return null;

  const buffer = Buffer.from(await res.arrayBuffer());
  return buffer;
}

app.get("/vi/:id/:file", async (req, res) => {
  const { id, file } = req.params;

  if (!file.endsWith(".jpg"))
    return res.status(400).send("invalid");

  const cacheFile = filePath(id, file);

  // ✅ キャッシュヒット
  if (exists(cacheFile)) {
    res.set(headers());
    return fs.createReadStream(cacheFile).pipe(res);
  }

  // 🔥 fallback付き取得
  for (const q of [file, ...FALLBACK]) {
    const buffer = await download(id, q);
    if (!buffer) continue;

    fs.writeFileSync(cacheFile, buffer);

    res.set(headers());
    return res.end(buffer);
  }

  res.status(404).send("not found");
});

function headers() {
  return {
    "Content-Type": "image/jpeg",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Access-Control-Allow-Origin": "*"
  };
}

app.get("/", (_, res) =>
  res.send("YT Edge Cache Proxy ✅")
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("running"));
