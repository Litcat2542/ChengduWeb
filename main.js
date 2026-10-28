/* ==========================================================
   蜀韵·成都 —— 全站交互脚本
   主要功能：
   1. Banner 轮播图（自动播放 / 手动切换 / 指示点联动）
   2. 页头滚动阴影切换
   3. 移动端导航抽屉开关
   ========================================================== */

// 页面 DOM 加载完成后初始化各项交互
window.addEventListener("DOMContentLoaded", function () {
  initBanner();      // 初始化轮播图
  initHeader();      // 初始化页头效果
  initNavToggle();   // 初始化移动端导航
  initMusic();       // 初始化背景音乐控制
});

/* ---------- 1. Banner 轮播图 ---------- */
function initBanner() {
  // 获取轮播相关元素
  const slides   = document.querySelectorAll("#banner .slide"); // 所有幻灯片
  const dotsWrap = document.getElementById("bannerDots");       // 指示点容器
  const prevBtn  = document.getElementById("prevBtn");         // 上一张按钮
  const nextBtn  = document.getElementById("nextBtn");         // 下一张按钮
  const banner   = document.getElementById("banner");          // 轮播容器

  let current = 0;        // 当前播放的幻灯片索引
  let timer = null;       // 自动播放定时器
  const INTERVAL = 4500;  // 自动播放间隔（毫秒）

  // ① 根据幻灯片数量动态生成底部指示圆点
  slides.forEach(function (_, i) {
    const dot = document.createElement("button");
    dot.className = "banner-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "第 " + (i + 1) + " 张轮播图");
    // 点击指示点直接切换到对应幻灯片
    dot.addEventListener("click", function () { goTo(i); restart(); });
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.children;

  // ② 切换到指定索引的幻灯片（带首尾回绕保护）
  function goTo(index) {
    if (index < 0) index = slides.length - 1;            // 向左越界：回绕到最后一张
    if (index > slides.length - 1) index = 0;            // 向右越界：回绕到第一张
    slides[current].classList.remove("active");          // 隐藏当前幻灯片
    dots[current].classList.remove("active");            // 取消当前指示点高亮
    current = index;
    slides[current].classList.add("active");             // 显示目标幻灯片
    dots[current].classList.add("active");               // 高亮对应指示点
  }

  // ③ 自动播放：启动 / 停止 / 重置
  function start()   { timer = setInterval(function () { goTo(current + 1); }, INTERVAL); }
  function stop()    { clearInterval(timer); }
  function restart() { stop(); start(); }

  // ④ 绑定左右切换按钮
  prevBtn.addEventListener("click", function () { goTo(current - 1); restart(); });
  nextBtn.addEventListener("click", function () { goTo(current + 1); restart(); });

  // ⑤ 鼠标悬停时暂停自动播放，移出后恢复
  banner.addEventListener("mouseenter", stop);
  banner.addEventListener("mouseleave", start);

  start(); // 页面加载后启动自动播放
}

/* ---------- 2. 页头滚动阴影 ---------- */
function initHeader() {
  const header = document.getElementById("header");
  // 监听页面滚动：滚动超过 10px 时为页头加深阴影
  window.addEventListener("scroll", function () {
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });
}

/* ---------- 3. 移动端导航抽屉 ---------- */
function initNavToggle() {
  const btn = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  // 点击汉堡按钮：展开 / 收起导航抽屉
  btn.addEventListener("click", function () {
    nav.classList.toggle("open");
  });
}

/* ---------- 4. 全局背景音乐控制 ---------- */
function initMusic() {
  // 获取控制按钮与背景音乐音频元素
  const btn   = document.getElementById("musicBtn");
  const audio = document.getElementById("bgMusic");
  // 页面中不存在音乐控件时直接跳过（保持兼容）
  if (!btn || !audio) return;

  // 点击按钮：切换播放 / 暂停状态
  btn.addEventListener("click", function () {
    if (audio.paused) {
      // 当前为暂停 → 开始循环播放背景音乐
      audio.play();
      btn.classList.add("playing"); // 切换为“播放中”金色样式
      btn.title = "暂停背景音乐";
    } else {
      // 当前为播放 → 暂停背景音乐
      audio.pause();
      btn.classList.remove("playing");
      btn.title = "播放背景音乐";
    }
  });
}