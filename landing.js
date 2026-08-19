/* ============ i18n (selection page only) ============ */
const LANDING_STR = {
  th:{
    appSubtitle:"เลือกชุดตัวอักษรที่ต้องการฝึก",
    heroTitle:"เลือกชุดตัวอักษรที่ต้องการฝึก",
    heroSub:"ฝึกอ่าน จำ เขียน และออกเสียงตัวอักษรญี่ปุ่น ผ่าน 7 โหมดฝึกฝน",
    hiraganaTitle:"ฮิรางานะ",
    hiraganaDesc:"อักษรพื้นฐานสำหรับคำศัพท์ญี่ปุ่นทั่วไป 46 ตัว",
    katakanaTitle:"คาตากานะ",
    katakanaDesc:"อักษรสำหรับคำทับศัพท์และคำยืมจากภาษาต่างประเทศ 46 ตัว",
    footerText:"Kana Lab — เลือกฮิรางานะหรือคาตากานะเพื่อเริ่มฝึก"
  },
  en:{
    appSubtitle:"Choose a character set to practice",
    heroTitle:"Choose a character set to practice",
    heroSub:"Learn to read, remember, write, and pronounce Japanese characters through 7 practice modes",
    hiraganaTitle:"Hiragana",
    hiraganaDesc:"The basic 46 characters used for everyday Japanese words",
    katakanaTitle:"Katakana",
    katakanaDesc:"The 46 characters used for loanwords and foreign names",
    footerText:"Kana Lab — pick Hiragana or Katakana to start practicing"
  }
};

function applyLandingLang(lang){
  const t = LANDING_STR[lang];
  document.getElementById("appSubtitle").textContent = t.appSubtitle;
  document.getElementById("heroTitle").textContent = t.heroTitle;
  document.getElementById("heroSub").textContent = t.heroSub;
  document.getElementById("hiraganaTitle").textContent = t.hiraganaTitle;
  document.getElementById("hiraganaDesc").textContent = t.hiraganaDesc;
  document.getElementById("katakanaTitle").textContent = t.katakanaTitle;
  document.getElementById("katakanaDesc").textContent = t.katakanaDesc;
  document.getElementById("footerText").textContent = t.footerText;
  document.documentElement.lang = lang;
}

document.getElementById("langSelect").addEventListener("change", (e)=>{
  applyLandingLang(e.target.value);
});

/* ============ THEME ============ */
document.getElementById("themeDots").addEventListener("click",(e)=>{
  const dot = e.target.closest(".theme-dot");
  if(!dot) return;
  const theme = dot.getAttribute("data-t");
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll(".theme-dot").forEach(d=>d.classList.remove("active"));
  dot.classList.add("active");
});

applyLandingLang("th");
