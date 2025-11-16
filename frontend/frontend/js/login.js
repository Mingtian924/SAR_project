// 后端基础地址（本地测试：http://localhost:8000，部署后改为你的后端域名）
const BACKEND_BASE_URL = "http://localhost:8000";

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginError = document.getElementById('loginError');

  // 登录
  loginBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      showError("请输入邮箱和密码");
      return;
    }

    try {
      // 调用后端登录接口
      const res = await fetch(`${BACKEND_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        // 登录成功，跳转到上传页面
        window.location.href = 'upload.html';
      } else {
        showError(data.detail || "邮箱或密码错误");
      }
    } catch (err) {
      showError("网络错误，请重试");
      console.error("登录失败：", err);
    }
  });

  // 按回车登录
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginBtn.click();
  });

  // 显示错误提示
  function showError(msg) {
    loginError.textContent = msg;
    loginError.classList.add('show');
    setTimeout(() => loginError.classList.remove('show'), 3000);
  }
});