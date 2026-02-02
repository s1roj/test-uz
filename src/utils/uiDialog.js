export async function uiAlert(message, title = "Xabar") {
  if (window.examApp?.alert) return await window.examApp.alert(message, title);
  alert(`${title}\n\n${message}`);
  return true;
}

export async function uiConfirm(message, title = "Tasdiqlang") {
  if (window.examApp?.confirm)
    return await window.examApp.confirm(message, title);
  return confirm(`${title}\n\n${message}`);
}
