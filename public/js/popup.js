export function setupGameOverPopup({ onRestart }) {
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("gameOverPopup");
  const currentScoreEl = popup.querySelector("#currentScore");
  const maxScoreEl = popup.querySelector("#maxScore");
  const closeBtn = popup.querySelector("#closeGameOver");

  function show({ maxScore, finalScore }) {
    currentScoreEl.textContent = finalScore;
    maxScoreEl.textContent = maxScore;

    overlay.style.display = "block";
    popup.style.display = "block";

    void overlay.offsetWidth;
    void popup.offsetWidth;

    overlay.classList.add("active");
    popup.classList.add("active");
  }

  function hide() {
    overlay.classList.remove("active");
    popup.classList.remove("active");

    setTimeout(() => {
      overlay.style.display = "none";
      popup.style.display = "none";
    }, 300);
  }

  closeBtn.addEventListener("click", () => {
    hide();
    if (onRestart) onRestart();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) hide();
  });

  hide();

  return { show, hide };
}
