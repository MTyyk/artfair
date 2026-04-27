/**
 * Downloads artwork images from Artsy CDN to data/images/
 * Strategy: tries variants in order of quality, keeps the largest file.
 * Usage: node scripts/download-images.mjs
 */

import { createWriteStream, mkdirSync, statSync, renameSync, unlinkSync, existsSync } from "fs";
import { get } from "https";
import { join } from "path";

const OUTPUT_DIR = "data/images";
mkdirSync(OUTPUT_DIR, { recursive: true });

const BASE = "https://d32dm0rphc51dk.cloudfront.net/";

// Variants tried in order — main.jpg is consistently the largest for modern works,
// normalized.jpg is the fallback for older/restricted ones.
const VARIANTS = ["main.jpg", "normalized.jpg", "large.jpg", "larger.jpg"];

const images = [
  ["tomas-sanchez-el-anochecer",            "NrlGw_GiAKn7XRTn0coPpg"],
  ["alex-breaux-do-you-feel-it",            "cTEPoy0-YM0rZqQr9_7FmQ"],
  ["chris-rwk-see-the-sights-together",     "L_NGdDLvYHXEfeS64pDCqw"],
  ["james-lumsden-open-painting-north-light","XAHvoGPc7oSkkbwTnL38UA"],
  ["chris-rwk-here-i-have-proof",           "P_VFJNstc4Sohg9fdRJX-A"],
  ["amber-goldhammer-pac-is-on-the-move",   "TFp0TALGtz5B7XPzxob3_w"],
  ["hunt-slonem-midnight-run",              "nQ__ZG_GTQQPEQpj8Wfgxg"],
  ["kateryna-malomuzh-mexican-sun-dance",   "-MhgNZfY43ECFsI48C0VDg"],
  ["eric-zener-free",                       "2R00eQ3q1FMGujOFTLpMfA"],
  ["matteo-massagrande-interno-vii",        "6PkzYFcFZr6geaNwVJYCtg"],
  ["esther-shaw-jt-spirit",                 "ICbTv9ATVoX3W5hexZiEoA"],
  ["adam-handler-ice-kat-girl",             "XdqNRHnmVCc8LP-CgZGt-Q"],
  ["jill-ricci-diamonds-in-the-sky",        "e-Bnzl1_5_sZCK_rCagXJQ"],
  ["robert-longo-study-for-culture-culture","cSBE1j9EVLz3yJFAex4RwA"],
  ["amber-goldhammer-love-moves-me",        "Scb7Wa_SRxDdW23pvyWUyQ"],
  ["poonam-khanna-eye-in-the-storm",        "sW1hX0AEwv-v4jFj3pV9ow"],
  ["marcel-dzama-untitled",                 "qx6KQXYAaHsTA6ZM-5fyvA"],
  ["tyson-reeder-whiskers",                 "QQej5C_G0RQ1dUi0IA2yMg"],
  ["hunt-slonem-migration-2",               "Zh9cdH0oDhdJkgkq_ZKk2A"],
  ["swoon-sibylant-sketch-pegasus",         "rujtBjTMa5qXrWn0lDOk9g"],
  ["james-lumsden-fugal-painting",          "nbHwpyy7GiduCqk6xM4d1g"],
  ["damien-hirst-heart-spin",               "3ZfPtFMm5UnhNweA2T1sGQ"],
  ["kyujin-lee-bow-and-arrow",              "mrEOXwdAXtJHeWeeYXrYAQ"],
  ["shiri-phillips-just-right",             "NNpIelAub0ATrjlIcaeISQ"],
  ["robert-indiana-love",                   "ykv_mRl8axMVx9Ph846wEA"],
  ["slawn-skate-deck-red-purple",           "PMubclUA7_rUhKGAc405Dg"],
  ["james-lumsden-resonance",               "Ae-oQ7tRr-9mNZonmV1ilA"],
  ["shiri-phillips-little-bits",            "PlWJvDum-5_OoL9_MK2uCg"],
  ["vahe-yeremyan-green-valley",            "vWOj-KCmtXuNrS02nfL7ug"],
  ["shiri-phillips-for-the-love-of-art",    "8vjusKDxzav3ITlg9Erg-w"],
  ["sara-macculloch-low-tide",              "su0eBlneTSgEZuN4rU7YJw"],
  ["jen-hitchings-divergence-06",           "AsqtR1jdKCzGOfvWY9LIBg"],
  ["aryon-winter-landscape",                "iDJRtd0l5LPjSURAgQfPNA"],
  ["hugo-pondz-lattente-du-lendemain",      "ariyQ5-jlhEffJKH5S3sMQ"],
  ["noelia-vilches-echoes-of-the-horizon",  "nB0v1bven1buuul_aHSpzQ"],
  ["marco-mancera-reflexion",               "nq8CCGsdcL3QcdYp0b1E6g"],
  ["qiyi-ma-message-from-the-universe",     "70UVEKdWQpOUVFoBT3xArw"],
  ["zoe-mcguire-red-extension",             "JS4ND23lXo2ec1uir47lgg"],
  ["saskia-fleishman-margate",              "xFvk7Av0Tzyt7PDBaB8vow"],
  ["rachel-macfarlane-rockaway",            "i20iDO7QKXh0QoSrm9plpw"],
  ["yuko-yamazaki-crossing-into-tomorrow",  "aXySML8ikzF90HMfTYzTvA"],
  ["yanlin-song-flower-season",             "K6PkRiOTKxdbWAWlJwDyvA"],
  ["manuel-hernandez-ruiz-days-of-golden-dust","9eFiSzYQwm_PJaZcwtHkpQ"],
  ["amanda-baldwin-pressed-celadon-peaks",  "eCE-U8fi1WYFWCBr4_IK4g"],
  ["thomas-geyer-waxing-moon",              "dXpmIC4bejWqvJo-tG_mkg"],
  ["alojzij-kogovsek-untitled",             "NwzpXz6J9njIgI1RwVAIOw"],
  ["jason-peterson-one-of-your-voices",     "O_WGvRjWeY3DSlEUm2dmew"],
  ["adam-sorensen-napier",                  "hGRUrqciKIIBmDTPT9O5ZQ"],
  ["nicholas-coley-astral-clouds-17",       "JCvvKW9ncuKhMOMaoPhoRA"],
  ["alix-white-winter-twilight",            "-MO_MO5zMJDq8Dnf6pBpWA"],
  ["jacopo-pagin-prova-tutte-le-cose",      "TJPGg3EXiKtkD5W5G2rbAQ"],
  ["lisa-petker-mintz-pink-love-1",         "6emvC35gjzcKwn8qf2TsIA"],
  ["amy-lincoln-red-rainbow-with-clouds",   "w_nqbL34ZiAHDNaKcGLSDA"],
  ["sander-coers-the-palette-table",        "grQ8NC70yduKQyx0k_r4Sw"],
  ["trudy-benson-red-stack",                "FmQOSM7nVvrLY9RtN5MZqg"],
  ["petra-schott-miracles-ahead",           "xd3BHTIeNLsSBy803Pq7Uw"],
  ["burton-morris-pop-in-bloom",            "iDV-SC1NR9UXpsh-oJmq8A"],
  ["donald-martiny-untitled-red-dark",      "3OtfPu7I9Z2fRzKJkbZJ8A"],
  ["dasha-pogodina-i-fell-in-love-with-you","I-ljdmgQcrdqmjcHVYHzWA"],
  ["chase-langford-elephant-walk-3",        "q9oth2kiDfY4p1Bj0QFqtw"],
  ["ishmael-armarh-kiss-b",                 "sxhij9qSn4UMtGq4cuT3Lg"],
  ["burton-morris-jardin-rouge",            "7zkl0z4k9znBzBJMYHwy5w"],
  ["andy-burgess-red-spin-southwest",       "n549ENmT6wjnAcZaVTvN5Q"],
  ["donald-martiny-untitled-red-light",     "geleBur2oJLe_REhipdNRw"],
  ["lisa-petker-mintz-pink-love-2",         "PGcbfAeOKoIstf5ZfdB-Vw"],
  ["henrietta-harris-firefly",              "6vTRxVbfpBSp-Q2KeVh1MQ"],
  ["taiyo-tono-botanical-pink",             "t41SMTlZvvxHGb5YP8XWOg"],
  ["mia-farrington-azalea",                 "xo9j-BpIqN-GJuiwRbZ3og"],
  ["eric-alfaro-loving-you",                "ksQgQTBfw7fcgCR1rSacVg"],
  ["marina-fisher-red-poppy",               "TvfbtyIE57aondyoURUJZA"],
  ["henrietta-harris-beep-beep",            "OOsu8Hz8Z0vynidSq225Kw"],
  ["donald-sultan-four-reds",               "TwMzInSzq7mVyfIvS2mqqA"],
  ["christina-mastrangelo-pink-lisianthus", "XyKtvFzP8H0wyVhEGvJQsw"],
  ["jingwen-flower-and-pink",               "iFJqgEj4d4wBzQO2fj7G9w"],
  ["max-ernst-soleil-jaune",                "j_c1AeGyO_tafX_DC1bgYQ"],
  ["helen-lundeberg-looking-through-series","hGHuu-ahgzYmO_SrMFCa4A"],
  ["roberto-matta-juego-de-vidrio",         "whTEBW55D49sYGotPE3RkQ"],
  ["enrico-donati-untitled",                "XetKyD7HBhQO-HUBtFrRJQ"],
];

// Try to download url into dest. Returns file size on success, 0 on failure.
function tryDownload(url, dest) {
  return new Promise((resolve) => {
    const file = createWriteStream(dest);
    get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(statSync(dest).size);
        });
      } else {
        file.close();
        try { unlinkSync(dest); } catch {}
        resolve(0);
      }
    }).on("error", () => {
      file.close();
      try { unlinkSync(dest); } catch {}
      resolve(0);
    });
  });
}

function getSize(path) {
  try { return statSync(path).size; } catch { return 0; }
}

let ok = 0, skipped = 0, failed = 0;

for (const [name, hash] of images) {
  const dest = join(OUTPUT_DIR, name + ".jpg");
  const existingSize = getSize(dest);
  let bestSize = 0;
  let bestVariant = null;
  let bestTmp = null;

  // Try each variant, keep track of the largest result
  for (const variant of VARIANTS) {
    const tmp = join(OUTPUT_DIR, `${name}.${variant}.tmp`);
    const url = BASE + hash + "/" + variant;
    const size = await tryDownload(url, tmp);
    if (size > bestSize) {
      if (bestTmp) try { unlinkSync(bestTmp); } catch {}
      bestSize = size;
      bestVariant = variant;
      bestTmp = tmp;
    } else {
      try { unlinkSync(tmp); } catch {}
    }
  }

  if (bestSize > existingSize) {
    renameSync(bestTmp, dest);
    const action = existingSize > 0 ? `${Math.round(existingSize/1024)}KB → ${Math.round(bestSize/1024)}KB` : `${Math.round(bestSize/1024)}KB`;
    console.log(`  ✓ ${name}.jpg  [${bestVariant}]  ${action}`);
    ok++;
  } else if (bestSize > 0) {
    if (bestTmp) try { unlinkSync(bestTmp); } catch {}
    console.log(`  = ${name}.jpg  already best (${Math.round(existingSize/1024)}KB)`);
    skipped++;
  } else {
    if (bestTmp) try { unlinkSync(bestTmp); } catch {}
    console.log(`  ✗ ${name}.jpg  all variants failed`);
    failed++;
  }
}

console.log(`\nDone. ${ok} downloaded/improved, ${skipped} already optimal, ${failed} failed.`);
