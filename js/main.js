/* ============ tunnel_proxy_rs 官网交互 ============ */
(function () {
  "use strict";

  // ---- 导航滚动阴影 ----
  var nav = document.getElementById("nav");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- 移动端菜单 ----
  var toggle = document.getElementById("navToggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  // ---- 滚动揭示动画 ----
  var revealEls = document.querySelectorAll(".feature-card, .pf-card, .tutorial-step, .compare-card, .badge, .stat, .install-box");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // ---- 数字计数动画 ----
  var counters = document.querySelectorAll("[data-count]");
  var counterIo = ("IntersectionObserver" in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            counterIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 })
    : null;
  counters.forEach(function (el) { if (counterIo) counterIo.observe(el); else animateCount(el); });

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var duration = 1100;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // ease-out
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  // ---- 复制按钮：给代码块加"复制"角标 ----
  var pres = document.querySelectorAll("pre");
  pres.forEach(function (pre) {
    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "复制";
    btn.setAttribute("aria-label", "复制代码");
    pre.style.position = "relative";
    pre.appendChild(btn);
    btn.addEventListener("click", function () {
      var text = pre.querySelector("code").innerText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { flash(btn, "已复制 ✓"); },
          function () { fallbackCopy(text, btn); }
        );
      } else {
        fallbackCopy(text, btn);
      }
    });
  });

  function fallbackCopy(text, btn) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); flash(btn, "已复制 ✓"); }
    catch (e) { flash(btn, "复制失败"); }
    document.body.removeChild(ta);
  }

  function flash(btn, msg) {
    var old = btn.textContent;
    btn.textContent = msg;
    btn.classList.add("copied");
    setTimeout(function () {
      btn.textContent = old;
      btn.classList.remove("copied");
    }, 1500);
  }
})();
