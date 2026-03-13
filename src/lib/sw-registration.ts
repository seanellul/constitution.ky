/**
 * Service Worker Registration for Constitution.mt
 * Handles PWA installation and offline capabilities
 */

import { isBrowser } from './utils';

let swRegistration: ServiceWorkerRegistration | null = null;

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isBrowser() || !('serviceWorker' in navigator)) {
    console.log('[SW] Service Worker not supported');
    return null;
  }

  try {
    console.log('[SW] Registering service worker...');
    
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    });

    swRegistration = registration;

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        console.log('[SW] New service worker installing...');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available; please refresh
            showUpdateAvailableNotification();
          }
        });
      }
    });

    // Handle activation
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW] Service worker controller changed');
      window.location.reload();
    });

    console.log('[SW] Service worker registered successfully:', registration);
    return registration;
    
  } catch (error) {
    console.error('[SW] Service worker registration failed:', error);
    return null;
  }
}

export async function unregisterServiceWorker(): Promise<boolean> {
  if (!swRegistration) {
    return false;
  }

  try {
    const result = await swRegistration.unregister();
    console.log('[SW] Service worker unregistered:', result);
    return result;
  } catch (error) {
    console.error('[SW] Service worker unregistration failed:', error);
    return false;
  }
}

export function getServiceWorkerRegistration(): ServiceWorkerRegistration | null {
  return swRegistration;
}

// Check if app is running in standalone mode (PWA installed)
export function isStandalone(): boolean {
  if (!isBrowser()) return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

// Show PWA install prompt
export function showInstallPrompt(): void {
  if (!isBrowser()) return;
  
  // This would typically be triggered by a beforeinstallprompt event
  // For now, show a simple message
  if (isStandalone()) {
    console.log('[PWA] Already installed');
    return;
  }
  
  // Check if installation is possible
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('[PWA] Installation available');
    
    // You could show a custom install banner here
    showCustomInstallBanner();
  }
}

function showCustomInstallBanner(): void {
  // Create a simple banner encouraging installation
  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: #003DA5;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    ">
      <div>
        <strong>Install Constitution.ky</strong><br>
        <small>Get offline access and faster loading</small>
      </div>
      <div>
        <button onclick="document.getElementById('pwa-install-banner').remove()" style="
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          margin-left: 12px;
          cursor: pointer;
        ">Maybe Later</button>
      </div>
    </div>
  `;
  
  // Remove existing banner if any
  const existing = document.getElementById('pwa-install-banner');
  if (existing) {
    existing.remove();
  }
  
  document.body.appendChild(banner);
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (document.getElementById('pwa-install-banner')) {
      banner.remove();
    }
  }, 10000);
}

function showUpdateAvailableNotification(): void {
  // Show a notification that an update is available
  const notification = document.createElement('div');
  notification.id = 'sw-update-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      max-width: 300px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    ">
      <div style="margin-bottom: 12px;">
        <strong>Update Available</strong><br>
        <small>A new version of Constitution.ky is ready</small>
      </div>
      <button onclick="window.location.reload()" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 8px;
      ">Update Now</button>
      <button onclick="document.getElementById('sw-update-notification').remove()" style="
        background: transparent;
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      ">Later</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-hide after 30 seconds
  setTimeout(() => {
    if (document.getElementById('sw-update-notification')) {
      notification.remove();
    }
  }, 30000);
}

// Initialize service worker registration
export function initServiceWorker(): void {
  if (!isBrowser()) return;
  
  // Register on page load
  window.addEventListener('load', () => {
    registerServiceWorker();
    
    // Show install prompt after a delay
    setTimeout(() => {
      if (!isStandalone()) {
        showInstallPrompt();
      }
    }, 5000);
  });
}

// Handle beforeinstallprompt event
let deferredPrompt: any = null;

if (isBrowser()) {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] beforeinstallprompt event fired');
    
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show custom install button
    showCustomInstallBanner();
  });

  // Handle successful installation
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App was installed');
    
    // Remove install banner
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.remove();
    }
    
    // Track installation in analytics
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'pwa_install', {
        event_category: 'PWA',
        event_label: 'App Installed'
      });
    }
  });
}

// Trigger install prompt
export async function triggerInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.log('[PWA] No install prompt available');
    return false;
  }

  try {
    // Show the prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`[PWA] User response to install prompt: ${outcome}`);
    
    // Clear the deferred prompt
    deferredPrompt = null;
    
    return outcome === 'accepted';
  } catch (error) {
    console.error('[PWA] Error triggering install prompt:', error);
    return false;
  }
}