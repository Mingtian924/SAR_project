// 后端基础地址（本地测试：http://localhost:8000，部署后改为你的后端域名）
const BACKEND_BASE_URL = "http://localhost:8000";

document.addEventListener('DOMContentLoaded', () => {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const previewArea = document.getElementById('previewArea');
  const loading = document.getElementById('loading');
  const uploadError = document.getElementById('uploadError');
  const logoutBtn = document.getElementById('logoutBtn');

  // 退出登录：跳回登录页
  logoutBtn.addEventListener('click', () => {
    window.location.href = 'login.html';
  });

  // 点击上传区域触发文件选择
  let isClicking = false;
  uploadArea.addEventListener('click', () => {
    if (!isClicking) {
      isClicking = true;
      fileInput.click();
      setTimeout(() => isClicking = false, 300);
    }
});

  // 选择文件后处理
  fileInput.addEventListener('change', (e) => {
    fileInput.value = ''; // 移到最前面，先重置
    const file = e.target.files[0];
    if (!file) return;

    // 验证文件格式
    const allowedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedFormats.includes(file.type)) {
      showError("不支持的文件格式，仅支持 JPG、PNG、WEBP");
      return;
    }

    // 验证文件大小（10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showError("文件大小不能超过 10MB");
      return;
    }

    // 读取文件并转为 Base64
    const reader = new FileReader();
    reader.onloadstart = () => {
      uploadArea.classList.add('active');
      loading.classList.add('show');
      uploadError.classList.remove('show');
    };

    reader.onload = async (event) => {
      const imageBase64 = event.target.result;
      try {
        // 调用后端图片处理接口
        const res = await fetch(`${BACKEND_BASE_URL}/api/enhance-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64 })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          // 处理成功，显示增强后的图片
          loading.classList.remove('show');
          uploadArea.classList.remove('active');
          const img = document.createElement('img');
          img.src = data.enhanced_image;
          img.className = 'preview-img';
          previewArea.innerHTML = '';
          previewArea.appendChild(img);
        } else {
          loading.classList.remove('show');
          uploadArea.classList.remove('active');
          showError(data.detail || "图片处理失败");
        }
      } catch (err) {
        loading.classList.remove('show');
        uploadArea.classList.remove('active');
        showError("网络错误，请重试");
        console.error("图片处理失败：", err);
      }
    };

    reader.onerror = () => {
      loading.classList.remove('show');
      uploadArea.classList.remove('active');
      showError("文件读取失败，请重试");
    };

    reader.readAsDataURL(file);
  });

  // 拖放功能
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('active');
  });

  uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('active');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('active');
    const file = e.dataTransfer.files[0];
    if (file) {
      fileInput.value = ''; // 先重置
      fileInput.files = e.dataTransfer.files;
      fileInput.dispatchEvent(new Event('change', { bubbles: true })); // 增加 bubbles 参数
    }
  });

  // 阻止文档拖放冒泡
  document.addEventListener('DOMContentLoaded', () => {
  // 其他变量定义不变
  // 先解绑旧的 change 事件（如果存在）
  fileInput.removeEventListener('change', handleFileChange);
  // 定义独立的事件处理函数
  function handleFileChange(e) {
    fileInput.value = '';
    const file = e.target.files[0];
    if (!file) return;
    // 原有的文件验证、读取等逻辑全部移到这里
  }
  // 重新绑定事件
  fileInput.addEventListener('change', handleFileChange);
  // 其他事件绑定（点击、拖放等）不变
});

  // 显示错误提示
  function showError(msg) {
    uploadError.textContent = msg;
    uploadError.classList.add('show');
    setTimeout(() => uploadError.classList.remove('show'), 3000);
  }
});