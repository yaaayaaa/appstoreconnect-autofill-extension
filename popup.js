const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["appleId", "password", "enabled"], (data) => {
    if (data.appleId) $("appleId").value = data.appleId;
    if (data.password) $("password").value = data.password;
    $("enabled").checked = data.enabled !== false;
  });

  $("save").addEventListener("click", () => {
    const appleId = $("appleId").value.trim();
    const password = $("password").value;
    const enabled = $("enabled").checked;

    if (!appleId || !password) {
      toast("Apple IDとパスワードを入力してください", true);
      return;
    }

    chrome.storage.local.set({ appleId, password, enabled }, () => {
      toast("保存しました");
    });
  });

  $("clear").addEventListener("click", () => {
    chrome.storage.local.remove(["appleId", "password", "enabled"], () => {
      $("appleId").value = "";
      $("password").value = "";
      $("enabled").checked = true;
      toast("削除しました");
    });
  });
});

function toast(msg, isError = false) {
  const el = $("toast");
  el.textContent = msg;
  el.className = "toast visible" + (isError ? " error" : "");
  setTimeout(() => el.classList.remove("visible"), 2000);
}
