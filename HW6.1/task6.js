document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("colorForm");
    const palette = document.getElementById("palette");
  
    const errorName = document.getElementById("errorName");
    const errorCode = document.getElementById("errorCode");
  
    let colors = loadColorsFromCookie();
  
    function renderPalette() {
      palette.innerHTML = "";
      colors.forEach(color => {
        const div = document.createElement("div");
        div.className = "color-box";
        div.textContent = color.name;
        div.style.backgroundColor = color.code;
        palette.appendChild(div);
      });
    }
  
    function saveToCookie() {
      const json = JSON.stringify(colors);
      const expires = new Date(Date.now() + 3 * 60 * 60 * 1000).toUTCString();
      document.cookie = `colors=${encodeURIComponent(json)}; expires=${expires}; path=/`;
    }
  
    function loadColorsFromCookie() {
      const cookie = document.cookie
        .split("; ")
        .find(row => row.startsWith("colors="));
      if (cookie) {
        try {
          return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
        } catch (e) {
          return [];
        }
      }
      return [];
    }
  
    function isValidName(name) {
      return /^[a-zа-яёіїєґ]+$/i.test(name);
    }
  
    function isValidColorCode(code, type) {
      if (type === "RGB")
        return /^(\d{1,3}),(\d{1,3}),(\d{1,3})$/.test(code) &&
          code.split(",").every(n => n >= 0 && n <= 255);
  
      if (type === "RGBA") {
        const match = code.match(/^(\d{1,3}),(\d{1,3}),(\d{1,3}),(0(\.\d+)?|1)$/);
        return match && [match[1], match[2], match[3]].every(n => n >= 0 && n <= 255);
      }
  
      if (type === "HEX")
        return /^#[0-9A-Fa-f]{6}$/.test(code);
  
      return false;
    }
  
    form.addEventListener("submit", e => {
      e.preventDefault();
  
      const name = document.getElementById("name").value.trim();
      const type = document.getElementById("type").value;
      const code = document.getElementById("code").value.trim();
  
      // Очистка помилок
      errorName.textContent = "";
      errorCode.textContent = "";
  
      let hasError = false;
  
      if (!name) {
        errorName.textContent = "Поле обов'язкове.";
        hasError = true;
      } else if (!isValidName(name)) {
        errorName.textContent = "Назва має містити тільки літери.";
        hasError = true;
      } else if (colors.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        errorName.textContent = "Ця назва вже використовується.";
        hasError = true;
      }
  
      if (!isValidColorCode(code, type)) {
        errorCode.textContent = `Невірний формат для типу ${type}`;
        hasError = true;
      }
  
      if (hasError) return;
  
      // Якщо усе валідно — додаємо
      colors.push({ name, type, code });
      saveToCookie();
      renderPalette();
      form.reset();
    });
  
    renderPalette();
  });
  