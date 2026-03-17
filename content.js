// App Store Connect login auto-fill

(function () {
  if (window.__ascAutoFillActive) return;
  window.__ascAutoFillActive = true;

  let filled = false;

  function start() {
    if (filled) return;
    chrome.storage.local.get(["appleId", "password", "enabled"], (data) => {
      if (data.enabled === false || !data.appleId || !data.password) return;
      poll(data.appleId, data.password, 0);
    });
  }

  function poll(appleId, password, attempt) {
    if (attempt > 40 || filled) return;
    if (detect2FA()) return;

    // Step 1: Apple ID
    const idField = document.querySelector("#account_name_text_field");
    if (idField && !idField.value) {
      fillInput(idField, appleId);
      setTimeout(() => {
        const submitBtn = document.querySelector("#sign-in") ||
                          document.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.click();
        setTimeout(() => waitForContinue(password), 1000);
      }, 800);
      return;
    }

    // Step 2: Continue with password button
    const continueBtn = document.querySelector("#continue-password");
    if (continueBtn && isVisible(continueBtn)) {
      continueBtn.click();
      setTimeout(() => waitForPasswordField(password), 1000);
      return;
    }

    // Step 3: Password field
    const pwField = document.querySelector("#password_text_field") ||
                    document.querySelector('input[type="password"]');
    if (pwField && !pwField.value && isVisible(pwField)) {
      submitPassword(pwField, password);
      return;
    }

    setTimeout(() => poll(appleId, password, attempt + 1), 800);
  }

  function waitForContinue(password) {
    let n = 0;
    const check = () => {
      if (++n > 60 || filled) return;
      const btn = document.querySelector("#continue-password");
      if (btn && isVisible(btn)) {
        btn.click();
        setTimeout(() => waitForPasswordField(password), 1000);
        return;
      }
      setTimeout(check, 500);
    };
    check();
  }

  function waitForPasswordField(password) {
    let n = 0;
    const check = () => {
      if (++n > 30 || filled) return;
      const pw = document.querySelector("#password_text_field") ||
                 document.querySelector('input[type="password"]');
      if (pw && isVisible(pw)) {
        submitPassword(pw, password);
        return;
      }
      setTimeout(check, 500);
    };
    check();
  }

  function submitPassword(pwField, password) {
    if (filled || pwField.value) return;
    fillInput(pwField, password);
    setTimeout(() => {
      const signIn = findSignInButton();
      if (signIn) signIn.click();
      filled = true;
    }, 500);
  }

  function findSignInButton() {
    const buttons = [
      document.querySelector("#sign-in"),
      ...document.querySelectorAll('button[type="submit"], button.button-primary'),
    ];
    for (const btn of buttons) {
      if (!btn || !isVisible(btn)) continue;
      const id = (btn.id || "").toLowerCase();
      const text = (btn.textContent || "").toLowerCase();
      if (id.includes("cancel") || text.includes("cancel")) continue;
      return btn;
    }
    return null;
  }

  function fillInput(input, value) {
    input.focus();
    input.click();
    input.select();
    document.execCommand("delete");
    document.execCommand("insertText", false, value);

    if (input.value !== value) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, "value"
      ).set;
      setter.call(input, value);
      input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: value }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function isVisible(el) {
    if (!el) return false;
    const s = window.getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden" && s.opacity !== "0" && el.offsetHeight > 0;
  }

  function detect2FA() {
    if (document.querySelector("#char0") || document.querySelector('input[placeholder*="code" i]')) return true;
    const t = document.body.innerText || "";
    return t.includes("確認コード") || t.includes("verification code") || t.includes("Two-Factor");
  }

  start();
})();
