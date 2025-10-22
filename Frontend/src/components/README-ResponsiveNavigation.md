# Responsive Hamburger Navigation System

A comprehensive responsive sidebar navigation system for the Online Learning Portal with smooth animations, accessibility features, and performance optimizations.

## 🚀 Features

- **Responsive Design**: Adapts to desktop (≥1024px), tablet (768px-1023px), and mobile (≤767px) screens
- **Smooth Animations**: CSS3 transitions with cubic-bezier easing and micro-interactions
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support, and high contrast mode
- **Performance**: React.memo optimization, useCallback hooks, and CSS containment
- **Touch Gestures**: Swipe to close on mobile devices
- **State Persistence**: localStorage integration for user preferences
- **Auto-close**: Closes sidebar on route changes and outside clicks

## 📁 Component Structure

```
Frontend/src/components/
├── SidebarProvider.jsx          # Context provider for global state
├── HamburgerIcon.jsx           # Animated hamburger menu icon
├── SidebarToggle.jsx           # Toggle button with accessibility
├── ResponsiveSidebar.jsx       # Responsive sidebar wrapper
├── ResponsiveSidebarLayout.jsx # Complete layout component
├── Leraners/Sidebar.jsx        # Enhanced learner sidebar
├── Teacher/TeacherSidebar.jsx  # Enhanced teacher sidebar
├── examples/
│   ├── LearnerDashboardExample.jsx
│   └── TeacherDashboardExample.jsx
└── styles/
    └── sidebar-animations.css  # Comprehensive CSS animations
```

## 🛠 Installation & Setup

### 1. Import Required Styles

Add the CSS animations to your main CSS file or import directly:

```jsx
import '../styles/sidebar-animations.css';
```

### 2. Wrap Your App with SidebarProvider

```jsx
import { SidebarProvider } from './components/SidebarProvider';

function App() {
  return (
    <SidebarProvider>
      {/* Your app content */}
    </SidebarProvider>
  );
}
```

### 3. Use ResponsiveSidebarLayout

```jsx
import ResponsiveSidebarLayout from './components/ResponsiveSidebarLayout';
import Sidebar from './components/Leraners/Sidebar';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('syllabus');

  return (
    <ResponsiveSidebarLayout
      header={<YourHeaderComponent />}
      sidebar={
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
      }
    >
      <YourMainContent />
    </ResponsiveSidebarLayout>
  );
}
```

## 🎨 Customization

### Hamburger Icon Variants

```jsx
<SidebarToggle 
  variant="default"    // White background with shadow
  variant="header"     // Transparent for header use
  variant="floating"   // Fixed floating button
  size={24}           // Icon size in pixels
/>
```

### Sidebar Positioning

```jsx
<ResponsiveSidebar side="left">   {/* Default */}
<ResponsiveSidebar side="right">  {/* Right-aligned */}
```

### Animation Customization

Override CSS custom properties:

```css
:root {
  --sidebar-transition-duration: 0.3s;
  --sidebar-transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
  --sidebar-backdrop-blur: 4px;
  --sidebar-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

## 🎯 Responsive Breakpoints

| Screen Size | Behavior | Hamburger | Sidebar |
|-------------|----------|-----------|---------|
| Desktop (≥1024px) | Always visible | Hidden | Static |
| Tablet (768px-1023px) | Toggleable | Visible | Overlay |
| Mobile (≤767px) | Modal overlay | Prominent | Full overlay |

## ♿ Accessibility Features

### Keyboard Navigation
- **Tab**: Navigate through sidebar items
- **Enter/Space**: Activate buttons
- **Escape**: Close sidebar

### Screen Reader Support
- ARIA labels for all interactive elements
- Proper focus management
- Semantic HTML structure

### High Contrast Mode
- Automatic detection and adaptation
- Enhanced borders and colors
- Maintained usability

### Reduced Motion
- Respects `prefers-reduced-motion` setting
- Disables animations when requested
- Maintains functionality

## 🚀 Performance Optimizations

### React Optimizations
```jsx
// Components are memoized
const Sidebar = memo(({ activeSection, onSectionChange }) => {
  // useCallback for event handlers
  const handleSectionChange = useCallback((sectionId) => {
    onSectionChange(sectionId);
    if (isMobile) close();
  }, [onSectionChange, isMobile, close]);
});
```

### CSS Optimizations
```css
.sidebar-mobile {
  will-change: transform;
  contain: layout style paint;
}
```

## 📱 Touch Gestures

### Swipe to Close (Mobile)
- Swipe left to close sidebar
- 50px threshold for activation
- Smooth gesture recognition

### Implementation
```jsx
// Automatic gesture handling in ResponsiveSidebar component
// No additional setup required
```

## 🧪 Testing Guide

### Manual Testing Checklist

#### Desktop (≥1024px)
- [ ] Sidebar always visible
- [ ] Hamburger icon hidden
- [ ] Smooth hover animations
- [ ] Keyboard navigation works

#### Tablet (768px-1023px)
- [ ] Hamburger icon visible in header
- [ ] Sidebar toggles on click
- [ ] Overlay closes on outside click
- [ ] Touch gestures work

#### Mobile (≤767px)
- [ ] Hamburger icon prominent
- [ ] Sidebar as full overlay
- [ ] Body scroll prevented when open
- [ ] Swipe to close works
- [ ] Auto-close on route change

### Accessibility Testing
- [ ] Screen reader announces sidebar state
- [ ] Keyboard navigation complete
- [ ] Focus management correct
- [ ] High contrast mode works
- [ ] Reduced motion respected

### Performance Testing
- [ ] Smooth 60fps animations
- [ ] No layout thrashing
- [ ] Memory usage stable
- [ ] Touch response < 100ms

## 🐛 Troubleshooting

### Common Issues

#### Sidebar not responding to toggle
```jsx
// Ensure SidebarProvider wraps your app
<SidebarProvider>
  <App />
</SidebarProvider>
```

#### Animations not working
```jsx
// Import CSS animations
import '../styles/sidebar-animations.css';
```

#### Touch gestures not working
```jsx
// Ensure touch events are not prevented
// Check for conflicting event listeners
```

#### State not persisting
```jsx
// Check localStorage permissions
// Verify SidebarProvider is at app root
```

## 🔧 Advanced Configuration

### Custom Animations
```css
/* Override default animations */
.sidebar-mobile.custom-animation {
  animation: customSlideIn 0.5s ease-out;
}

@keyframes customSlideIn {
  from { transform: translateX(-100%) scale(0.9); }
  to { transform: translateX(0) scale(1); }
}
```

### Theme Integration
```jsx
// Dark mode support
const { isDark } = useTheme();

<ResponsiveSidebarLayout 
  className={isDark ? 'dark-theme' : 'light-theme'}
>
```

### Custom Breakpoints
```css
/* Custom responsive behavior */
@media (max-width: 1200px) {
  .sidebar-desktop {
    width: 240px;
  }
}
```

## 📊 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 60+ | ✅ Full |
| Firefox | 55+ | ✅ Full |
| Safari | 12+ | ✅ Full |
| Edge | 79+ | ✅ Full |
| IE | 11 | ⚠️ Limited |

## 🤝 Contributing

1. Follow existing code patterns
2. Add tests for new features
3. Update documentation
4. Ensure accessibility compliance
5. Test across all breakpoints

## 📄 License

This component system is part of the Online Learning Portal project.

---

**Need help?** Check the example implementations in the `examples/` directory or refer to the component documentation.