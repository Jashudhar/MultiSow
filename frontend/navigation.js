// Reusable Navigation Component
// This file creates a collapsible sidebar navigation that works across all pages

function createNavigation(activePage) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || 'User';
    const userInitials = userName.substring(0, 2).toUpperCase();
    const isCollapsed = localStorage.getItem('navCollapsed') === 'true';

    const nav = document.createElement('div');
    nav.className = 'app-sidebar' + (isCollapsed ? ' collapsed' : '');
    nav.id = 'appSidebar';

    nav.innerHTML = `
        <div class="sidebar-header">
            <div class="sidebar-logo">
                <span class="logo-icon"><span class="material-icons md-32" style="color: white;">eco</span></span>
                <span class="logo-text">MultiSow</span>
            </div>
            <button class="sidebar-toggle" onclick="toggleSidebar()" aria-label="Toggle Sidebar">
                <span class="toggle-icon"><span class="material-icons">${isCollapsed ? 'menu' : 'eco'}</span></span>
            </button>
        </div>

        <nav class="sidebar-nav">
            <a href="home.html" class="nav-item ${activePage === 'home' ? 'active' : ''}">
                <span class="nav-item-icon-wrapper"><span class="nav-item-icon material-icons">home</span></span>
                <span class="nav-item-text">Home</span>
            </a>
            <a href="dashboard.html" class="nav-item ${activePage === 'dashboard' ? 'active' : ''}">
                <span class="nav-item-icon-wrapper"><span class="nav-item-icon material-icons">bar_chart</span></span>
                <span class="nav-item-text">Dashboard</span>
            </a>
            <a href="strata.html" class="nav-item ${activePage === 'strata' ? 'active' : ''}">
                <span class="nav-item-icon-wrapper"><span class="nav-item-icon material-icons">grass</span></span>
                <span class="nav-item-text">Strata System</span>
            </a>
            <a href="research.html" class="nav-item ${activePage === 'research' ? 'active' : ''}">
                <span class="nav-item-icon-wrapper"><span class="nav-item-icon material-icons">library_books</span></span>
                <span class="nav-item-text">Success Stories</span>
            </a>
        </nav>

        <div class="sidebar-footer">
            ${isLoggedIn ? `
                <div class="user-section" onclick="window.location.href='profile.html'">
                    <div class="user-avatar">${userInitials}</div>
                    <div class="user-info">
                        <div class="user-name">${userName.charAt(0).toUpperCase() + userName.slice(1)}</div>
                        <div class="user-role">Farmer</div>
                    </div>
                </div>
            ` : `
                <button class="login-btn" onclick="window.location.href='login.html'">
                    <span class="login-icon-wrapper"><span class="login-icon material-icons">person</span></span>
                    <span class="login-text">Login</span>
                </button>
            `}
        </div>
    `;

    // Insert at beginning of body
    document.body.insertBefore(nav, document.body.firstChild);

    // Add main content wrapper class to ensure proper layout
    const mainContent = document.body.children[1];
    if (mainContent) {
        mainContent.classList.add('main-content-wrapper');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('appSidebar');
    const toggleIcon = document.querySelector('.toggle-icon');
    const isCollapsed = sidebar.classList.toggle('collapsed');
    localStorage.setItem('navCollapsed', isCollapsed);

    // Change emoji based on state
    if (toggleIcon) {
        toggleIcon.innerHTML = isCollapsed ? '<span class="material-icons">menu</span>' : '<span class="material-icons">eco</span>';
    }
}

// CSS Styles for Navigation
const navStyles = `
<style>
    /* Force Material Icons font over emoji in sidebar */
    .app-sidebar .material-icons {
        font-family: 'Material Icons' !important;
        font-variant-emoji: text;
        font-variant-ligatures: common-ligatures;
        -webkit-text-stroke: 0;
        font-style: normal;
        font-weight: normal;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
    }

    body {
        display: flex;
    }

    .app-sidebar {
        width: 240px;
        background: linear-gradient(180deg, #1e4620 0%, #2d5c2f 50%, #4a7c59 100%);
        color: white;
        position: fixed;
        height: 100vh;
        left: 0;
        top: 0;
        box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
        z-index: 100;
        display: flex;
        flex-direction: column;
        transition: width 0.3s ease, transform 0.3s ease;
        overflow: visible;
    }

    .app-sidebar.collapsed {
        width: 70px;
    }

    .app-sidebar.collapsed .logo-text,
    .app-sidebar.collapsed .nav-item-text,
    .app-sidebar.collapsed .user-info,
    .app-sidebar.collapsed .login-text {
        opacity: 0;
        width: 0;
        overflow: hidden;
    }

    .app-sidebar.collapsed .nav-item {
        justify-content: center;
        padding: 0.75rem 0;
        gap: 0;
    }

    .app-sidebar.collapsed .nav-item-icon {
        margin-right: 0;
    }

    .app-sidebar.collapsed .nav-item-icon-wrapper {
        margin: 0 auto;
    }

    .app-sidebar.collapsed .sidebar-logo {
        justify-content: center;
    }

    .app-sidebar.collapsed .user-section {
        justify-content: center;
    }

    .app-sidebar.collapsed .user-avatar {
        margin-right: 0;
    }

    .sidebar-header {
        padding: 1.5rem 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        overflow: visible;
    }

    .sidebar-logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transition: all 0.3s ease;
    }

    .logo-icon {
        font-size: 2rem;
        flex-shrink: 0;
    }

    .logo-text {
        font-family: var(--font-heading);
        font-size: 1.75rem;
        font-weight: 700;
        transition: opacity 0.3s ease, width 0.3s ease;
        white-space: nowrap;
    }

    .sidebar-toggle {
        width: 48px;
        height: 48px;
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        flex-shrink: 0;
        position: absolute;
        right: -24px;
        bottom: -24px;
        z-index: 1000;
    }

    .sidebar-toggle:hover {
        transform: scale(1.2);
    }

    .toggle-icon {
        font-size: 1.5rem;
        transition: transform 0.3s ease;
        background: transparent;
        border: none;
    }

    .sidebar-nav {
        flex: 1;
        padding: 1.5rem 0.5rem;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .sidebar-nav::-webkit-scrollbar {
        display: none;
    }

    .nav-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1rem;
        margin-bottom: 0;
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        border-radius: 12px;
        transition: all 0.3s ease;
        font-weight: 500;
        white-space: nowrap;
    }

    .nav-item:hover {
        background: transparent;
        color: white;
        transform: translateX(5px);
    }

    .nav-item.active {
        background: transparent;
        color: white;
    }

    .nav-item-icon-wrapper {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.3s ease;
    }

    .nav-item:hover .nav-item-icon-wrapper {
        background: rgba(255, 255, 255, 0.15);
    }

    .nav-item.active .nav-item-icon-wrapper {
        background: rgba(255, 255, 255, 0.25);
        border-radius: 50%;
    }

    .nav-item-icon {
        font-size: 1.3rem;
        flex-shrink: 0;
        transition: margin 0.3s ease;
    }



    .nav-item-text {
        transition: opacity 0.3s ease, width 0.3s ease;
    }

    .sidebar-footer {
        padding: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .user-section {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.875rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .user-section:hover {
        background: rgba(255, 255, 255, 0.15);
    }

    .app-sidebar.collapsed .user-section {
        background: transparent;
        padding: 0.875rem 0;
        justify-content: center;
        gap: 0;
    }

    .app-sidebar.collapsed .user-section:hover {
        background: transparent;
    }

    .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: white;
        color: var(--primary-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1rem;
        flex-shrink: 0;
        transition: margin 0.3s ease;
    }

    .user-info {
        flex: 1;
        transition: opacity 0.3s ease, width 0.3s ease;
        overflow: hidden;
    }

    .user-name {
        font-weight: 600;
        font-size: 0.9rem;
        white-space: nowrap;
    }

    .user-role {
        font-size: 0.75rem;
        opacity: 0.8;
        white-space: nowrap;
    }

    .login-btn {
        width: 100%;
        padding: 0.75rem 1rem;
        background: transparent;
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 1rem;
        margin-bottom: 0;
    }

    .login-btn:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .login-icon-wrapper {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .login-icon {
        font-size: 1.3rem;
        flex-shrink: 0;
        color: white;
    }

    .login-text {
        transition: opacity 0.3s ease, width 0.3s ease;
        font-weight: 600;
    }

    .app-sidebar.collapsed .login-btn {
        justify-content: center;
        padding: 0.75rem 0;
        background: transparent;
        gap: 0;
    }

    .app-sidebar.collapsed .login-icon-wrapper {
        margin: 0 auto;
    }

    .app-sidebar.collapsed .login-btn:hover {
        background: transparent;
    }

    .main-content-wrapper {
        margin-left: 240px;
        flex: 1;
        width: calc(100% - 240px);
        transition: none;
    }

    .app-sidebar.collapsed + .main-content-wrapper {
        margin-left: 240px;
        width: calc(100% - 240px);
    }

    @media (max-width: 768px) {
        .app-sidebar {
            transform: translateX(-100%);
        }

        .app-sidebar.mobile-open {
            transform: translateX(0);
        }

        .main-content-wrapper {
            margin-left: 0;
            width: 100%;
        }
    }
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', navStyles);
