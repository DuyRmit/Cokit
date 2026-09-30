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
  },
  {
    id: 'laygen',
    name: 'LayGen',
    icon: '⊞',
    color: '#e8efff',
    description: "Visual grid layout builder — choose columns, styles, and fill in content.",
    path: 'features/laygen/index.html'
  },
  {
    id: 'tabgen',
    name: 'Tab Gen',
    icon: '🗂',
    color: '#e6e8f5',
    description: "Build jQuery UI tab components and export clean HTML instantly.",
    path: 'features/tabgen/index.html'
  },
  {
    id: 'navgen',
    name: 'Navigate Gen',
    icon: '🧭',
    color: '#fff4d6',
    description: "Create styled navigation cards that link to page sections.",
    path: 'features/navgen/index.html'
  },
  {
    id: 'details-toggle',
    name: 'Details Toggle',
    icon: '▶',
    color: '#e3f4ec',
    description: "Generate collapsible &lt;details&gt; toggle snippets for Canvas.",
    path: 'features/details-toggle/index.html'
  },
  {
    id: 'coldate',
    name: 'Coldate',
    icon: '🎨',
    color: '#efe9fb',
    description: "Find and replace color codes across your HTML/CSS in bulk.",
    path: 'features/coldate/index.html'
  },
  {
    id: 'tablegen',
    name: 'Table Gen',
    icon: '▦',
    color: '#e8efff',
    description: "Build Canvas-ready tables with headers, alternating rows, borders and section breaks.",
    path: 'features/tablegen/index.html'
  },
  {
    id: 'meet-lecturer',
    name: 'Meet Lecturer',
    icon: '👤',
    color: '#fdeaea',
    description: "Build lecturer profile cards with image cropping — ready to embed in Canvas.",
    path: 'features/meet-lecturer/index.html'
  }
];
