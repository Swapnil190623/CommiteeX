// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Sidebar, roleConfig } from './Sidebar';
// import { Header } from './Header';
// import { LogOut } from 'lucide-react';

// export function AppShell({ children, role, setRole }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [mobileNavOpen, setMobileNavOpen] = useState(false);
//   const sidebarWrapRef = useRef(null);

//   function handleSwitchRole() {
//     setRole(null);
//     navigate('/');
//   }

//   const isStandalone = !role || location.pathname === '/';

//   // #region agent log
//   useEffect(() => {
//     const sidebarEl = sidebarWrapRef.current;
//     const sidebarRect = sidebarEl?.getBoundingClientRect();
//     fetch('http://127.0.0.1:7715/ingest/69a774dc-9dd4-4874-aa14-461272b168d1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8fb8b9'},body:JSON.stringify({sessionId:'8fb8b9',location:'AppShell.jsx:render-effect',message:'AppShell layout state',data:{role,pathname:location.pathname,isStandalone,mobileNavOpen,viewportWidth:window.innerWidth,isLgUp:window.matchMedia('(min-width: 1024px)').matches,sidebarWrapWidth:sidebarRect?.width??null,sidebarWrapDisplay:sidebarEl?getComputedStyle(sidebarEl).display:null,sidebarWrapVisibility:sidebarEl?getComputedStyle(sidebarEl).visibility:null},timestamp:Date.now(),hypothesisId:'A-B-C-D'})}).catch(()=>{});
//   }, [role, location.pathname, isStandalone, mobileNavOpen]);
//   // #endregion

//   // If no active role selected and on landing page '/', return standalone view without shell
//   if (isStandalone) {
//     // #region agent log
//     fetch('http://127.0.0.1:7715/ingest/69a774dc-9dd4-4874-aa14-461272b168d1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8fb8b9'},body:JSON.stringify({sessionId:'8fb8b9',location:'AppShell.jsx:standalone-branch',message:'Rendering WITHOUT sidebar shell',data:{role,pathname:location.pathname,reason:!role?'no-role':'home-path'},timestamp:Date.now(),hypothesisId:'A-E'})}).catch(()=>{});
//     // #endregion
//     return <>{children}</>;
//   }

//   const cfg = roleConfig[role] || roleConfig.student;

//   return (
//     <div className="min-h-screen bg-surface-muted flex flex-col lg:flex-row">
//       {/* Desktop Sidebar */}
//       <div ref={sidebarWrapRef} className="hidden lg:block">
//         <Sidebar role={role} onSwitchRole={handleSwitchRole} />
//       </div>

//       {/* Mobile Drawer Overlay */}
//       {mobileNavOpen && (
//         <div className="lg:hidden fixed inset-0 z-50 flex">
//           <div
//             className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
//             onClick={() => setMobileNavOpen(false)}
//           />
//           <div className="relative z-10 w-64 max-w-full bg-surface h-full shadow-2xl flex flex-col">
//             <Sidebar
//               role={role}
//               onSwitchRole={handleSwitchRole}
//               onItemClick={() => setMobileNavOpen(false)}
//             />
//           </div>
//         </div>
//       )}

//       {/* Main Content Area */}
//       <div className="flex-1 min-w-0 flex flex-col">
//         <Header
//           role={role}
//           onSwitchRole={handleSwitchRole}
//           onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
//           mobileNavOpen={mobileNavOpen}
//         />

//         {/* Mobile secondary navigation pill bar */}
//         <div className="lg:hidden flex gap-1.5 overflow-x-auto px-4 py-2.5 bg-surface border-b border-border/70 scrollbar-none">
//           {cfg.items.map((item) => {
//             const Icon = item.icon;
//             const active = location.pathname === item.path;
//             return (
//               <button
//                 key={item.label}
//                 onClick={() => navigate(item.path)}
//                 className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
//                   active
//                     ? 'bg-royal-50 text-royal-700 font-semibold shadow-xs'
//                     : 'text-fg-secondary bg-surface-muted hover:bg-surface-hover'
//                 }`}
//               >
//                 <Icon className="h-3.5 w-3.5" />
//                 {item.label}
//               </button>
//             );
//           })}
//           <button
//             onClick={handleSwitchRole}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap text-fg-muted bg-surface-muted hover:bg-surface-hover"
//           >
//             <LogOut className="h-3.5 w-3.5" />
//             Switch
//           </button>
//         </div>

//         <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-6xl w-full mx-auto animate-fade-in">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AppShell;



//version 2 


// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Sidebar, roleConfig } from './Sidebar';
// import { Header } from './Header';
// import { LogOut } from 'lucide-react';

// export function AppShell({ children, role, setRole }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [mobileNavOpen, setMobileNavOpen] = useState(false);

//   /**
//    * Switch back to the role selection / landing page.
//    */
//   function handleSwitchRole() {
//     setRole(null);
//     setMobileNavOpen(false);
//     navigate('/');
//   }

//   /**
//    * The application shell should ONLY be removed when:
//    * 1. We are on the landing page "/"
//    * 2. No role has been selected
//    *
//    * Previously this was:
//    *
//    * const isStandalone = !role || location.pathname === '/';
//    *
//    * That caused the sidebar to disappear whenever role became null,
//    * even if the user was already inside the application.
//    */
//   const isStandalone = location.pathname === '/' && !role;

//   /**
//    * If there is no role on a non-home route, use student as a safe
//    * fallback so the application shell does not disappear.
//    *
//    * This protects the layout from suddenly becoming full-width.
//    */
//   const activeRole = role || 'student';
//   const cfg = roleConfig[activeRole] || roleConfig.student;

//   /**
//    * Standalone landing page.
//    */
//   if (isStandalone) {
//     return <>{children}</>;
//   }

//   return (
//     <div className="min-h-screen bg-surface-muted flex flex-col lg:flex-row">

//       {/* =========================================================
//           DESKTOP SIDEBAR
//           ========================================================= */}
//       <div className="hidden lg:block shrink-0">
//         <Sidebar
//           role={activeRole}
//           onSwitchRole={handleSwitchRole}
//         />
//       </div>

//       {/* =========================================================
//           MOBILE DRAWER OVERLAY
//           ========================================================= */}
//       {mobileNavOpen && (
//         <div className="lg:hidden fixed inset-0 z-50 flex">

//           {/* Overlay */}
//           <div
//             className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
//             onClick={() => setMobileNavOpen(false)}
//           />

//           {/* Drawer */}
//           <div className="relative z-10 w-64 max-w-full bg-surface h-full shadow-2xl flex flex-col">
//             <Sidebar
//               role={activeRole}
//               onSwitchRole={handleSwitchRole}
//               onItemClick={() => setMobileNavOpen(false)}
//             />
//           </div>
//         </div>
//       )}

//       {/* =========================================================
//           MAIN APPLICATION AREA
//           ========================================================= */}
//       <div className="flex-1 min-w-0 flex flex-col">

//         {/* Header */}
//         <Header
//           role={activeRole}
//           onSwitchRole={handleSwitchRole}
//           onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
//           mobileNavOpen={mobileNavOpen}
//         />

//         {/* =======================================================
//             MOBILE SECONDARY NAVIGATION
//             ======================================================= */}
//         <div className="lg:hidden flex gap-1.5 overflow-x-auto px-4 py-2.5 bg-surface border-b border-border/70 scrollbar-none">

//           {cfg.items.map((item) => {
//             const Icon = item.icon;

//             const active =
//               location.pathname === item.path ||
//               (
//                 item.path !== '/dashboard' &&
//                 location.pathname.startsWith(item.path)
//               );

//             return (
//               <button
//                 key={item.label}
//                 onClick={() => {
//                   navigate(item.path);
//                   setMobileNavOpen(false);
//                 }}
//                 className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
//                   active
//                     ? 'bg-royal-50 text-royal-700 font-semibold shadow-xs'
//                     : 'text-fg-secondary bg-surface-muted hover:bg-surface-hover'
//                 }`}
//               >
//                 <Icon className="h-3.5 w-3.5" />
//                 {item.label}
//               </button>
//             );
//           })}

//           {/* Switch Role */}
//           <button
//             onClick={handleSwitchRole}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap text-fg-muted bg-surface-muted hover:bg-surface-hover"
//           >
//             <LogOut className="h-3.5 w-3.5" />
//             Switch
//           </button>
//         </div>

//         {/* =======================================================
//             PAGE CONTENT
//             ======================================================= */}
//         <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-6xl w-full mx-auto animate-fade-in">
//           {children}
//         </main>

//       </div>
//     </div>
//   );
// }

// export default AppShell;



//version 3 

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, roleConfig } from './Sidebar';
import { Header } from './Header';
import { LogOut } from 'lucide-react';

export function AppShell({ children, role, setRole }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  /**
   * Change Role
   *
   * Clear the current role and return to the homepage.
   */
  function handleSwitchRole() {
    setRole(null);
    setMobileNavOpen(false);
    navigate('/', { replace: true });
  }

  /**
   * IMPORTANT:
   *
   * The homepage is always standalone.
   *
   * This means:
   * - Selecting a role -> application shell appears
   * - Clicking Change Role -> homepage without sidebar
   * - Browser Back to "/" -> homepage without sidebar
   *
   * We intentionally do NOT check !role here.
   */
  const isStandalone = location.pathname === '/';

  /**
   * Always render the homepage without AppShell UI.
   */
  if (isStandalone) {
    return <>{children}</>;
  }

  /**
   * If an application route somehow has no role,
   * don't show another role's sidebar.
   *
   * This prevents the accidental Student fallback.
   */
  if (!role) {
    return null;
  }

  /**
   * Current role configuration.
   */
  const cfg = roleConfig[role] || roleConfig.student;

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col lg:flex-row">

      {/* =========================================================
          DESKTOP SIDEBAR
          ========================================================= */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          role={role}
          onSwitchRole={handleSwitchRole}
        />
      </div>

      {/* =========================================================
          MOBILE DRAWER
          ========================================================= */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">

          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />

          {/* Drawer */}
          <div className="relative z-10 w-64 max-w-full bg-surface h-full shadow-2xl flex flex-col">
            <Sidebar
              role={role}
              onSwitchRole={handleSwitchRole}
              onItemClick={() => setMobileNavOpen(false)}
            />
          </div>

        </div>
      )}

      {/* =========================================================
          MAIN CONTENT
          ========================================================= */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Header */}
        <Header
          role={role}
          onSwitchRole={handleSwitchRole}
          onToggleMobileNav={() =>
            setMobileNavOpen((prev) => !prev)
          }
          mobileNavOpen={mobileNavOpen}
        />

        {/* =======================================================
            MOBILE SECONDARY NAVIGATION
            ======================================================= */}
        <div className="lg:hidden flex gap-1.5 overflow-x-auto px-4 py-2.5 bg-surface border-b border-border/70 scrollbar-none">

          {cfg.items.map((item) => {
            const Icon = item.icon;

            const active =
              item.path === '/dashboard'
                ? location.pathname === '/dashboard'
                : location.pathname.startsWith(item.path);

            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setMobileNavOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-royal-50 text-royal-700 font-semibold shadow-xs'
                    : 'text-fg-secondary bg-surface-muted hover:bg-surface-hover'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}

          {/* Change Role */}
          <button
            onClick={handleSwitchRole}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap text-fg-muted bg-surface-muted hover:bg-surface-hover"
          >
            <LogOut className="h-3.5 w-3.5" />
            Switch
          </button>

        </div>

        {/* =======================================================
            PAGE CONTENT
            ======================================================= */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-6xl w-full mx-auto animate-fade-in">
          {children}
        </main>

      </div>
    </div>
  );
}

export default AppShell;