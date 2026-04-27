/**
 * Retries small images (<1MB) using main.jpg instead of normalized.jpg
 * Only replaces the file if the new download is larger.
 * Usage: node scripts/retry-small-images.mjs
 */

import { createWriteStream, statSync, mkdirSync, renameSync, unlinkSync } from "fs";
import { get } from "https";
import { join } from "path";

const OUTPUT_DIR = "data/images";
mkdirSync(OUTPUT_DIR, { recursive: true });

const BASE = "https://d32dm0rphc51dk.cloudfront.net/";

const images = [
  ["jason-peterson-one-of-your-voices",   "O_WGvRjWeY3DSlEUm2dmew"],
  ["donald-martiny-untitled-red-light",   "geleBur2oJLe_REhipdNRw"],
  ["donald-martiny-untitled-red-dark",    "3OtfPu7I9Z2fRzKJkbZJ8A"],
  ["sara-macculloch-low-tide",            "su0eBlneTSgEZuN4rU7YJw"],
  ["amanda-baldwin-pressed-celadon-peaks","eCE-U8fi1WYFWCBr4_IK4g"],
  ["slawn-skate-deck-red-purple",         "PMubclUA7_rUhKGAc405Dg"],
  ["helen-lundeberg-looking-through-series","hGHuu-ahgzYmO_SrMFCa4A"],
  ["donald-sultan-four-reds",             "TwMzInSzq7mVyfIvS2mqqA"],
  ["henrietta-harris-beep-beep",          "OOsu8Hz8Z0vynidSq225Kw"],
  ["marco-mancera-reflexion",             "nq8CCGsdcL3QcdYp0b1E6g"],
  ["sander-coers-the-palette-table",      "grQ8NC70yduKQyx0k_r4Sw"],
  ["jen-hitchings-divergence-06",         "AsqtR1jdKCzGOfvWY9LIBg"],
  ["chris-rwk-see-the-sights-together",   "L_NGdDLvYHXEfeS64pDCqw"],
  ["chase-langford-elephant-walk-3",      "q9oth2kiDfY4p1Bj0QFqtw"],
  ["chris-rwk-here-i-have-proof",         "P_VFJNstc4Sohg9fdRJX-A"],
  ["swoon-sibylant-sketch-pegasus",       "rujtBjTMa5qXrWn0lDOk9g"],
  ["damien-hirst-heart-spin",             "3ZfPtFMm5UnhNweA2T1sGQ"],
  ["alojzij-kogovsek-untitled",           "NwzpXz6J9njIgI1RwVAIOw"],
  ["henrietta-harris-firefly",            "6vTRxVbfpBSp-Q2KeVh1MQ"],
  ["hunt-slonem-midnight-run",            "nQ__ZG_GTQQPEQpj8Wfgxg"],
  ["alix-white-winter-twilight",          "-MO_MO5zMJDq8Dnf6pBpWA"],
  ["max-ernst-soleil-jaune",              "j_c1AeGyO_tafX_DC1bgYQ"],
  ["hugo-pondz-lattente-du-lendemain",    "ariyQ5-jlhEffJKH5S3sMQ"],
  ["adam-sorensen-napier",                "hGRUrqciKIIBmDTPT9O5ZQ"],
  ["zoe-mcguire-red-extension",           "JS4ND23lXo2ec1uir47lgg"],
  ["vahe-yeremyan-green-valley",          "vWOj-KCmtXuNrS02nfL7ug"],
  ["petra-schott-miracles-ahead",         "xd3BHTIeNLsSBy803Pq7Uw"],
  ["shiri-phillips-just-right",           "NNpIelAub0ATrjlIcaeISQ"],
  ["yuko-yamazaki-crossing-into-tomorrow","aXySML8ikzF90HMfTYzTvA"],
  ["shiri-phillips-little-bits",          "PlWJvDum-5_OoL9_MK2uCg"],
  ["jingwen-flower-and-pink",             "iFJqgEj4d4wBzQO2fj7G9w"],
  ["amy-lincoln-red-rainbow-with-clouds", "w_nqbL34ZiAHDNaKcGLSDA"],
  ["qiyi-ma-message-from-the-universe",   "70UVEKdWQpOUVFoBT3xArw"],
  ["yanlin-song-flower-season",           "K6PkRiOTKxdbWAWlJwDyvA"],
  ["robert-indiana-love",                 "ykv_mRl8axMVx9Ph846wEA"],
  ["christina-mastrangelo-pink-lisianthus","XyKtvFzP8H0wyVhEGvJQsw"],
  ["noelia-vilches-echoes-of-the-horizon","nB0v1bven1buuul_aHSpzQ"],
  ["taiyo-tono-botanical-pink",           "t41SMTlZvvxHGb5YP8XWOg"],
  ["burton-morris-jardin-rouge",          "7zkl0z4k9znBzBJMYHwy5w"],
  ["kateryna-malomuzh-mexican-sun-dance", "-MhgNZfY43ECFsI48C0VDg"],
  ["lisa-petker-mintz-pink-love-1",       "6emvC35gjzcKwn8qf2TsIA"],
];

function getSize(path) {
  try { return statSync(path).size; } catch { return 0; }
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      } else {
        file.close();
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    }).on("error", reject);
  });
}

let improved = 0, same = 0, failed = 0;

for (const [name, hash] of images) {
  const dest = join(OUTPUT_DIR, name + ".jpg");
  const tmp  = join(OUTPUT_DIR, name + ".tmp.jpg");
  const url  = BASE + hash + "/main.jpg";
  const oldSize = getSize(dest);

  try {
    await download(url, tmp);
    const newSize = getSize(tmp);
    if (newSize > oldSize) {
      renameSync(tmp, dest);
      console.log(`  ↑ ${name}.jpg  ${Math.round(oldSize/1024)}KB → ${Math.round(newSize/1024)}KB`);
      improved++;
    } else {
      unlinkSync(tmp);
      console.log(`  = ${name}.jpg  kept normalized (${Math.round(oldSize/1024)}KB ≥ ${Math.round(newSize/1024)}KB)`);
      same++;
    }
  } catch (e) {
    console.error(`  ✗ ${name}: ${e.message}`);
    try { unlinkSync(tmp); } catch {}
    failed++;
  }
}

console.log(`\nDone. ${improved} improved, ${same} unchanged, ${failed} failed.`);
