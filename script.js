const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const toast = $('#toast');
let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function updatePromptCount() {
  $('#promptCount').textContent = `${$('#promptInput').value.length} / 500`;
}

$$('.mode-tab').forEach((tab) => tab.addEventListener('click', () => {
  $$('.mode-tab').forEach((item) => {
    item.classList.toggle('active', item === tab);
    item.setAttribute('aria-selected', item === tab ? 'true' : 'false');
  });
  const editMode = tab.dataset.mode === 'edit';
  $('#editUpload').classList.toggle('hidden', !editMode);
  $('#generateBtn strong').textContent = editMode ? '開始編輯' : '開始生成';
  showToast(editMode ? '已切換至圖片編輯模式' : '已切換至圖片生成模式');
}));

$$('.style-card').forEach((card) => card.addEventListener('click', () => {
  $$('.style-card').forEach((item) => item.classList.remove('active'));
  card.classList.add('active');
  showToast(`已選擇「${card.dataset.style}」風格`);
}));

$('#promptInput').addEventListener('input', updatePromptCount);
$('#clearPrompt').addEventListener('click', () => {
  $('#promptInput').value = '';
  updatePromptCount();
  $('#promptInput').focus();
});
$('#magicBtn').addEventListener('click', () => {
  const input = $('#promptInput');
  if (!input.value.trim()) input.value = '一個充滿細節與情感的畫面';
  if (!input.value.includes('柔和自然光')) input.value += '，柔和自然光，專業構圖，細節豐富，4K 高品質';
  updatePromptCount();
  showToast('✦ 已為你優化提示詞');
});

$('#minusBtn').addEventListener('click', () => {
  const current = Number($('#imageCount').textContent);
  $('#imageCount').textContent = Math.max(1, current - 1);
});
$('#plusBtn').addEventListener('click', () => {
  const current = Number($('#imageCount').textContent);
  $('#imageCount').textContent = Math.min(8, current + 1);
});
$('#ratioSelect').addEventListener('click', () => showToast('比例選單：目前使用 4 : 3'));
$('#advancedToggle').addEventListener('click', () => $('#advancedPanel').classList.toggle('hidden'));
$('#creativityRange').addEventListener('input', ({ target }) => $('#creativityOutput').textContent = `${target.value}%`);
$('#layoutBtn').addEventListener('click', () => $('#galleryGrid').classList.toggle('list-view'));
$('#downloadAll').addEventListener('click', () => showToast('已準備下載 4 張圖片'));
$('#regenerateBtn').addEventListener('click', generateImages);

function generateImages() {
  const overlay = $('#generationOverlay');
  overlay.classList.remove('hidden');
  setTimeout(() => {
    overlay.classList.add('hidden');
    showToast('✦ 圖片生成完成！');
  }, 1400);
}
$('#generateBtn').addEventListener('click', generateImages);

$('#fileInput').addEventListener('change', ({ target }) => {
  const file = target.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) return showToast('圖片超過 10MB，請重新選擇');
  $('#uploadZone strong').textContent = `已上傳：${file.name}`;
  showToast('圖片上傳成功');
});

$$('.card-actions button').forEach((button) => button.addEventListener('click', () => {
  showToast(button.title === '下載' ? '圖片下載已準備就緒' : `${button.title}功能已開啟`);
}));

updatePromptCount();
