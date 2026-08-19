/* ============ DATA ============ */
const KANA = [
  ["あ","a"],["い","i"],["う","u"],["え","e"],["お","o"],
  ["か","ka"],["き","ki"],["く","ku"],["け","ke"],["こ","ko"],
  ["さ","sa"],["し","shi"],["す","su"],["せ","se"],["そ","so"],
  ["た","ta"],["ち","chi"],["つ","tsu"],["て","te"],["と","to"],
  ["な","na"],["に","ni"],["ぬ","nu"],["ね","ne"],["の","no"],
  ["は","ha"],["ひ","hi"],["ふ","fu"],["へ","he"],["ほ","ho"],
  ["ま","ma"],["み","mi"],["む","mu"],["め","me"],["も","mo"],
  ["や","ya"],["ゆ","yu"],["よ","yo"],
  ["ら","ra"],["り","ri"],["る","ru"],["れ","re"],["ろ","ro"],
  ["わ","wa"],["を","wo"],["ん","n"]
];

const ALT_ROMAJI = {
  "shi":["si"], "chi":["ti"], "tsu":["tu"], "fu":["hu"],
  "wo":["o"], "ji":["zi"], "n":["nn"]
};

const VOCAB = [
  ["あさ","asa","เช้า","morning"],
  ["ひる","hiru","กลางวัน","daytime"],
  ["よる","yoru","กลางคืน","night"],
  ["みず","mizu","น้ำ","water"],
  ["やま","yama","ภูเขา","mountain"],
  ["かわ","kawa","แม่น้ำ","river"],
  ["うみ","umi","ทะเล","sea"],
  ["そら","sora","ท้องฟ้า","sky"],
  ["はな","hana","ดอกไม้","flower"],
  ["くも","kumo","เมฆ","cloud"],
  ["あめ","ame","ฝน","rain"],
  ["かぜ","kaze","ลม","wind"],
  ["ゆき","yuki","หิมะ","snow"],
  ["いえ","ie","บ้าน","house"],
  ["とり","tori","นก","bird"],
  ["いぬ","inu","หมา","dog"],
  ["ねこ","neko","แมว","cat"],
  ["さかな","sakana","ปลา","fish"],
  ["たまご","tamago","ไข่","egg"],
  ["くるま","kuruma","รถยนต์","car"],
  ["でんしゃ","densha","รถไฟ","train"],
  ["がっこう","gakkou","โรงเรียน","school"],
  ["ともだち","tomodachi","เพื่อน","friend"],
  ["かぞく","kazoku","ครอบครัว","family"],
  ["せんせい","sensei","ครู","teacher"],
  ["本","hon","หนังสือ","book"],
  ["つくえ","tsukue","โต๊ะ","desk"],
  ["いす","isu","เก้าอี้","chair"],
  ["あさごはん","asagohan","อาหารเช้า","breakfast"],
  ["ありがとう","arigatou","ขอบคุณ","thank you"],
  ["すみません","sumimasen","ขอโทษ / ขออนุญาต","sorry / excuse me"],
  ["おはよう","ohayou","อรุณสวัสดิ์","good morning"],
  ["こんにちは","konnichiwa","สวัสดี","hello"],
  ["こんばんは","konbanwa","สวัสดีตอนเย็น","good evening"],
  ["さようなら","sayounara","ลาก่อน","goodbye"],
  ["かわいい","kawaii","น่ารัก","cute"],
  ["おいしい","oishii","อร่อย","delicious"],
  ["たのしい","tanoshii","สนุก","fun"],
  ["うれしい","ureshii","ดีใจ","happy"],
  ["さむい","samui","หนาว","cold"]
];

const GOJUON_ROWS = [
  {label:"-",  cells:["あ|a","い|i","う|u","え|e","お|o"]},
  {label:"k",  cells:["か|ka","き|ki","く|ku","け|ke","こ|ko"]},
  {label:"s",  cells:["さ|sa","し|shi","す|su","せ|se","そ|so"]},
  {label:"t",  cells:["た|ta","ち|chi","つ|tsu","て|te","と|to"]},
  {label:"n",  cells:["な|na","に|ni","ぬ|nu","ね|ne","の|no"]},
  {label:"h",  cells:["は|ha","ひ|hi","ふ|fu","へ|he","ほ|ho"]},
  {label:"m",  cells:["ま|ma","み|mi","む|mu","め|me","も|mo"]},
  {label:"y",  cells:["や|ya","","ゆ|yu","","よ|yo"]},
  {label:"r",  cells:["ら|ra","り|ri","る|ru","れ|re","ろ|ro"]},
  {label:"w",  cells:["わ|wa","","","","を|wo"]},
  {label:"n",  cells:["ん|n","","","",""]}
];

const DAKUTEN_ROWS = [
  {label:"g", cells:["が|ga","ぎ|gi","ぐ|gu","げ|ge","ご|go"]},
  {label:"z", cells:["ざ|za","じ|ji","ず|zu","ぜ|ze","ぞ|zo"]},
  {label:"d", cells:["だ|da","ぢ|ji","づ|zu","で|de","ど|do"]},
  {label:"b", cells:["ば|ba","び|bi","ぶ|ぶ","べ|be","ぼ|bo"]},
  {label:"p", cells:["ぱ|pa","ぴ|pi","ぷ|pu","ぺ|pe","ぽ|po"]}
];

const YOUON_ROWS = [
  {label:"ky", cells:["きゃ|kya","きゅ|kyu","きょ|kyo"]},
  {label:"sh", cells:["しゃ|sha","しゅ|shu","しょ|sho"]},
  {label:"ch", cells:["ちゃ|cha","ちゅ|chu","ちょ|cho"]},
  {label:"ny", cells:["にゃ|nya","にゅ|nyu","にょ|nyo"]},
  {label:"hy", cells:["ひゃ|hya","ひゅ|hyu","ひょ|hyo"]},
  {label:"my", cells:["みゃ|mya","みゅ|myu","みょ|myo"]},
  {label:"ry", cells:["りゃ|rya","りゅ|ryu","りょ|ryo"]},
  {label:"gy", cells:["ぎゃ|gya","ぎゅ|gyu","ぎょ|gyo"]},
  {label:"j",  cells:["じゃ|ja","じゅ|ju","じょ|jo"]},
  {label:"by", cells:["びゃ|bya","びゅ|byu","びょ|byo"]},
  {label:"py", cells:["ぴゃ|pya","ぴゅ|pyu","ぴょ|pyo"]}
];

/* ============ KANA SET IDENTITY ============ */
const KANA_TYPE = "hiragana";
const KANA_LABEL_TH = "ฮิรางานะ";
const KANA_LABEL_EN = "Hiragana";
const APP_TITLE_JP = "ひらがな Lab";
