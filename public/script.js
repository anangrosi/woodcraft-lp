document.addEventListener("DOMContentLoaded", () => {
  const chatToggle = document.getElementById("chatToggle");
  const chatWindow = document.getElementById("chatWindow");
  const chatClose = document.getElementById("chatClose");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");
  const chatMessages = document.getElementById("chatMessages");
  const chatWidget = document.getElementById("chatWidget");

  let conversation = [];
  let isChatOpen = false;
  let isBusy = false;

  const renderMessage = (text, role) => {
    const el = document.createElement("div");
    el.className = "message " + role;
    el.textContent = text;
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const finishTurn = () => {
    isBusy = false;
    chatInput.disabled = false;
    chatSend.disabled = false;
    chatInput.focus();
  };

  const handleError = (message) => {
    renderMessage(
      message || "Maaf, sedang terjadi gangguan pada server. Silakan coba lagi nanti.",
      "bot"
    );
    finishTurn();
  };

  const sendChat = async () => {
    if (isBusy) return;
    const message = chatInput.value.trim();
    if (!message) return;

    isBusy = true;
    chatInput.disabled = true;
    chatSend.disabled = true;
    chatInput.value = "";

    conversation.push({ role: "user", text: message });
    renderMessage(message, "user");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Permintaan gagal");

      renderMessage(data.result, "bot");
      conversation.push({ role: "model", text: data.result });
    } catch (err) {
      console.error(err);
      handleError();
    } finally {
      finishTurn();
    }
  };

  const toggleChat = (open) => {
    isChatOpen = open;
    chatWindow.classList.toggle("active", open);
    if (open) chatInput.focus();
  };

  chatToggle.addEventListener("click", () => toggleChat(true));
  chatClose.addEventListener("click", () => toggleChat(false));
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendChat();
  });
  chatSend.addEventListener("click", sendChat);

  window.addEventListener("click", (e) => {
    if (
      isChatOpen &&
      !chatWidget.contains(e.target) &&
      !chatToggle.contains(e.target)
    ) {
      toggleChat(false);
    }
  });
});
