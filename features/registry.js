/**
 * CoKit — FEATURE REGISTRY
 * ------------------------------------------------------------
 * Đây là file DUY NHẤT cần sửa ở phía shell khi thêm/bớt feature.
 * Mỗi feature = 1 object trong mảng bên dưới + 1 folder trong /features.
 *
 *  id          : slug, trùng tên folder (dùng làm #hash trên URL)
 *  name        : tên hiển thị ở tab + card
 *  icon        : emoji (hoặc ký tự) hiển thị ở tab + card
 *  color       : màu nền nhạt cho icon
 *  description : mô tả ngắn trên card ở Home
 *  path        : đường dẫn tới trang chính của feature
 *
 * Thứ tự trong mảng = thứ tự tab và card. Xoá 1 object = gỡ feature.
 */
window.COKIT_FEATURES = [
  {
    id: 'ifragen',
    name: 'IfraGen',
    icon: '🖼️',
    color: '#eef0f6',
    description: 'Generate iframe embed code for Canvas — paste a link, set the size and copy clean HTML.',
    path: 'features/ifragen/index.html'
  },
  {
    id: 'style-builder',
    name: 'Style Builder',
    icon: '🎨',
    color: '#fbeee3',
    description: 'Build HTML style prompts for interactive learning activities that follow RMIT branding.',
    path: 'features/style-builder/index.html'
  }
];
