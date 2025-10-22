# Quick Integration Guide - Responsive Hamburger Navigation

## 🚀 Quick Start (3 Steps)

### Step 1: Wrap your app with SidebarProvider

```jsx
// In your main App.jsx or index.js
import { SidebarProvider } from './components/SidebarProvider';

function App() {
  return (
    <SidebarProvider>
      {/* Your existing app content */}
      <YourExistingApp />
    </SidebarProvider>
  );
}
```

### Step 2: Import the CSS animations

```jsx
// In your main CSS file or component
import './styles/sidebar-animations.css';
```

### Step 3: Use ResponsiveSidebarLayout

```jsx
// Replace your existing layout with ResponsiveSidebarLayout
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

## 🔧 Fixed Issues

### Issue 1: "useSidebar must be used within a SidebarProvider"
**Solution**: The sidebar components now accept props instead of directly using the hook:
- `onClose` - Function to close the sidebar
- `isMobile` - Boolean indicating if it's mobile/tablet view

### Issue 2: "Functions are not valid as a React child"
**Solution**: Components now properly handle React elements using `React.cloneElement`

## 📱 Component Props

### Sidebar Components (Learner & Teacher)
```jsx
<Sidebar 
  activeSection="syllabus"           // Current active section
  onSectionChange={handleChange}     // Function to handle section changes
  onClose={handleClose}              // Function to close sidebar (passed automatically)
  isMobile={false}                   // Mobile state (passed automatically)
/>
```

### ResponsiveSidebarLayout
```jsx
<ResponsiveSidebarLayout
  header={<HeaderComponent />}       // Optional header component
  sidebar={<SidebarComponent />}     // Your sidebar component
  className="custom-class"           // Optional CSS class
  sidebarSide="left"                 // 'left' or 'right' (default: 'left')
>
  <MainContent />
</ResponsiveSidebarLayout>
```

### SidebarToggle
```jsx
<SidebarToggle 
  variant="default"                  // 'default', 'header', 'floating'
  size={24}                          // Icon size in pixels
  className="custom-class"           // Optional CSS class
/>
```

## 🎯 Testing Your Implementation

1. **Desktop (≥1024px)**: Sidebar should always be visible, no hamburger icon
2. **Tablet (768px-1023px)**: Hamburger icon in header, sidebar toggles
3. **Mobile (≤767px)**: Prominent hamburger, sidebar as overlay
4. **Keyboard**: Tab navigation, Enter/Space to activate, Escape to close
5. **Touch**: Swipe left to close sidebar on mobile

## 🐛 Common Issues & Solutions

### Sidebar not closing on mobile
```jsx
// Make sure onClose prop is being passed and called
const handleSectionChange = (sectionId) => {
  onSectionChange(sectionId);
  if (isMobile && onClose) {
    onClose(); // This closes the sidebar
  }
};
```

### Animations not working
```jsx
// Ensure CSS is imported
import '../styles/sidebar-animations.css';
```

### Context errors
```jsx
// Ensure SidebarProvider wraps your entire app
<SidebarProvider>
  <App />
</SidebarProvider>
```

## 📋 Migration Checklist

- [ ] Wrap app with SidebarProvider
- [ ] Import sidebar-animations.css
- [ ] Replace existing layout with ResponsiveSidebarLayout
- [ ] Test on desktop, tablet, and mobile
- [ ] Verify keyboard navigation works
- [ ] Check accessibility with screen reader
- [ ] Test touch gestures on mobile device

## 🎨 Customization Examples

### Custom Header with Hamburger
```jsx
const CustomHeader = () => (
  <div className="flex items-center justify-between p-4">
    <SidebarToggle variant="header" className="lg:hidden" />
    <h1>My App</h1>
    <UserMenu />
  </div>
);
```

### Custom Sidebar Styling
```jsx
<ResponsiveSidebarLayout
  sidebar={<Sidebar />}
  className="custom-layout"
>
  <style jsx>{`
    .custom-layout .sidebar-mobile {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  `}</style>
</ResponsiveSidebarLayout>
```

## 🚀 Ready to Use Examples

Check these files for complete working examples:
- [`LearnerDashboardExample.jsx`](./examples/LearnerDashboardExample.jsx)
- [`TeacherDashboardExample.jsx`](./examples/TeacherDashboardExample.jsx)
- [`ResponsiveNavigationDemo.jsx`](./ResponsiveNavigationDemo.jsx)

---

**Need more help?** Check the full [`README-ResponsiveNavigation.md`](./README-ResponsiveNavigation.md) for detailed documentation.