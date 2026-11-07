(() => {
  "use strict";
  const config = window.CUVAYO_CONFIG || {};
  if (new URLSearchParams(location.search).get("request") === "privacy") {
    const form = document.querySelector("#support-form");
    if (form) { form.dataset.kind = "privacy"; document.querySelector("#request-heading").textContent = "Send a private privacy request"; }
  }
  const dialog = document.querySelector("#signup-dialog");
  document.querySelectorAll("[data-signup]").forEach(link => link.addEventListener("click", event => {
    if (config.appStoreURL && /^https:\/\/apps\.apple\.com\//.test(config.appStoreURL)) {
      event.preventDefault(); window.location.assign(config.appStoreURL); return;
    }
    if (dialog && typeof dialog.showModal === "function") { event.preventDefault(); dialog.showModal(); }
  }));
  document.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  const scenes = {
    question: ["MAYA ASKS", "“What’s one thing you wish more people understood about what you do?”", "A thoughtful question. A place to start."],
    answer: ["YOUR ANSWER, YOUR WAY", "“The thing I wish more people understood is [your main point]. A real example from my experience is [your example].”", "Edit the script, use talking points, or go freestyle."],
    episode: ["READY FOR YOUR NEXT LISTENER", "Your answers. Your hosts. Your music. One episode you can listen to, edit, and make your own.", "Export audio and pull out moments to share. Free-only creations export free."]
  };
  function showMode(button) {
    const mode = button.dataset.mode, scene = scenes[mode]; if (!scene) return;
    document.querySelectorAll("[data-mode]").forEach(tab => { const selected = tab === button; tab.setAttribute("aria-selected", selected); tab.tabIndex = selected ? 0 : -1; });
    document.querySelector("#demo-kicker").textContent = scene[0];
    document.querySelector("#demo-content").textContent = scene[1];
    document.querySelector("#demo-note").textContent = scene[2];
    document.querySelector("#demo-panel").setAttribute("aria-labelledby", button.id);
  }
  const tabs = [...document.querySelectorAll("[data-mode]")];
  tabs.forEach((button, index) => {
    button.addEventListener("click", () => showMode(button));
    button.addEventListener("keydown", event => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next != null) { event.preventDefault(); tabs[next].focus(); showMode(tabs[next]); }
    });
  });
  const heights = [12,22,16,30,24,42,32,48,38,26,44,52,36,24,18,34,46,54,40,28,44,30,20,36,50,42,30,22,38,26,16,32,44,36,24,14,28,38,26,18];
  document.querySelectorAll(".wave").forEach(wave => heights.forEach((height, i) => {
    const bar = document.createElement("i"); bar.style.height = height + "px"; bar.style.setProperty("--i", i); wave.append(bar);
  }));
  document.querySelectorAll(".intake-form").forEach(form => form.addEventListener("submit", async event => {
    event.preventDefault(); if (!form.reportValidity()) return;
    const status = form.querySelector(".form-status"), button = form.querySelector("[type=submit]"), data = new FormData(form);
    button.disabled = true; status.textContent = "Saving your request…"; status.className = "form-status";
    try {
      const response = await fetch(config.apiBase + "/v1/public/intake", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: form.dataset.kind, email: data.get("email"), message: data.get("message") || "", consent: data.get("consent") === "on", website: data.get("website") || "" }),
        signal: AbortSignal.timeout(15000)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Your request could not be saved.");
      if (result.token && form.dataset.kind === "waitlist") { try { localStorage.setItem("cuvayo-signup-token", result.token); } catch {} }
      status.textContent = form.dataset.kind === "waitlist" ? "You’re on the list. We’ll email the launch link when Cuvayo is ready." : "Your request is saved privately. Please allow time for a response.";
      status.classList.add("success"); form.reset();
    } catch (error) {
      status.textContent = error.name === "TimeoutError" || error instanceof TypeError ? "We couldn’t connect. Please try again in a moment." : error.message;
      status.classList.add("error");
    } finally { button.disabled = false; }
  }));
  document.querySelector("[data-remove-signup]")?.addEventListener("click", async event => {
    const status = document.querySelector("#remove-status"); let token;
    try { token = localStorage.getItem("cuvayo-signup-token"); } catch {}
    if (!token) { status.textContent = "No signup token is saved on this browser. Use the private privacy-request form below."; return; }
    event.target.disabled = true;
    try {
      const response = await fetch(config.apiBase + "/v1/public/intake", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }), signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error("Please try again.");
      localStorage.removeItem("cuvayo-signup-token"); status.textContent = "The signup associated with this browser has been removed.";
    } catch { status.textContent = "We couldn’t remove the signup. Please try again or send a private request below."; }
    finally { event.target.disabled = false; }
  });
})();
