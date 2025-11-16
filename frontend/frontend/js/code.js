// 后端基础地址（本地测试：http://localhost:8000，部署后改为你的后端域名）
const BACKEND_BASE_URL = "http://localhost:8000";

document.addEventListener('DOMContentLoaded', () => {
  const verifyBtn = document.getElementById('verifyBtn');
  const activeCodeInput = document.getElementById('activeCode');
  const codeError = document.getElementById('codeError');

  // 验证激活码
  verifyBtn.addEventListener('click', async () => {
    const code = activeCodeInput.value.trim();
    if (!code) {
      showError("请输入激活码");
      return;
    }

    try {
      // 调用后端激活码验证接口
      const res = await fetch(`${BACKEND_BASE_URL}/api/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await res.json();
      if (res.ok) {
        // 验证成功，跳转到登录页
        window.location.href = 'login.html';
      } else {
        showError(data.detail || "激活码无效");
      }
    } catch (err) {
      showError("网络错误，请重试");
      console.error("激活码验证失败：", err);
    }
  });

  // 按回车验证
  activeCodeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyBtn.click();
  });

  // 显示错误提示
  function showError(msg) {
    codeError.textContent = msg;
    codeError.classList.add('show');
    setTimeout(() => codeError.classList.remove('show'), 3000);
  }
});