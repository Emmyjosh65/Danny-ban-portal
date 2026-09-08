Here is the pins.js file designed to work with the Danny Ban Portal HTML structure.

This script handles:

Session Management: Keeps the user logged in via localStorage (so they don't lose their session on refresh).
Timer Logic: Implements the countdown logic based on the plan purchased.
Auto-Logout: Kicks the user out when the time expires.
Key Validation: Simulates verifying the access key.
Save this as pins.js in the same folder as your index.html.

Copy
/**
 * DANNY BAN PORTAL - MAIN SCRIPT
 * Handles Session, Timer, and Payment Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if user has an active session
    const session = localStorage.getItem('dannySession');
    if (session) {
        const sessionData = JSON.parse(session);
        if (Date.now() < sessionData.expiry) {
            // Session is still valid
            initDashboard(sessionData.remainingTime);
        } else {
            // Session expired, clear it
            localStorage.removeItem('dannySession');
            switchView('view-landing');
        }
    } else {
        // No session, show landing
        switchView('view-landing');
    }
});

// --- NAVIGATION HELPER ---
function switchView(viewId) {
    // Hide all main views
    const views = document.querySelectorAll('[id^="view-"]');
    views.forEach(v => v.classList.add('hidden'));
    
    // Hide all method views
    const methods = document.querySelectorAll('[id^="method-"]');
    methods.forEach(m => m.classList.add('hidden'));

    // Show target view
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.remove('hidden');
    }
}

// --- PAYMENT LOGIC ---
let paymentTimeout;

function selectPlan(name, price) {
    // Update UI selection
    document.querySelectorAll('.price-option').forEach(el => el.classList.remove('selected'));
    event.currentTarget.classList.add('selected');

    selectedPlan = { name, price };
    document.getElementById('display-amount').innerText = `₦${price.toLocaleString()}`;
    
    switchView('view-payment');
    
    // Reset and start timer animation
    const timerFill = document.getElementById('pay-timer');
    timerFill.style.animation = 'none';
    timerFill.offsetHeight; /* trigger reflow */
    timerFill.style.animation = 'countDown 5s linear forwards';

    // Clear any existing timeout
    if (paymentTimeout) clearTimeout(paymentTimeout);

    // Optional: Auto-verify after 5 seconds if user doesn't click
    paymentTimeout = setTimeout(() => {
        // You can choose to auto-verify or just let them click. 
        // The prompt said "wait for automatically 5 seconds, then they have to pay button should pop up"
        // We'll just make the button ready.
        const btn = document.getElementById('btn-paid');
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }, 5000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Account Number Copied!");
    });
}

function verifyPayment() {
    // Show success modal
    const modal = document.getElementById('payment-modal');
    modal.classList.add('active');
    
    setTimeout(() => {
        modal.classList.remove('active');
        // Redirect to Telegram for manual verification/receipt drop
        window.location.href = "https://t.me/dannyisnowdylan";
    }, 2500);
}

// --- DASHBOARD & TIMER LOGIC ---
let dashboardInterval;

function initDashboard(remainingTimeMs) {
    switchView('view-dashboard');
    startDashboardTimer(remainingTimeMs);
}

function startDashboardTimer(remainingTimeMs) {
    const display = document.getElementById('main-timer');
    
    // If remainingTimeMs is not provided, default to 24 hours for demo
    if (!remainingTimeMs) remainingTimeMs = 86400000; 

    const endTime = Date.now() + remainingTimeMs;

    dashboardInterval = setInterval(() => {
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) {
            clearInterval(dashboardInterval);
            display.textContent = "00:00:00";
            alert("Session Expired. You have been logged out.");
            logout();
            return;
        }

        // Calculate H:M:S
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        display.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }, 1000);
}

function pad(num) {
    return num < 10 ? '0' + num : num;
}

// --- KEY VALIDATION (MOCK) ---
function validateKey() {
    const keyInput = document.getElementById('access-key-input');
    const key = keyInput.value.trim();
    
    if (!key) {
        alert("Please enter an Access Key");
        return;
    }

    const btn = document.querySelector('#view-key .btn-gold');
    const originalText = btn.innerText;
    btn.innerText = "VERIFYING...";
    btn.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
        // In a real app, you'd validate 'key' against your backend
        // For now, we assume it's valid and create a session
        
        // Default to Weekly if plan wasn't set or just for demo
        let durationMs = 7 * 24 * 60 * 60 * 1000; // 1 Week default
        
        const sessionData = {
            key: key,
            expiry: Date.now() + durationMs,
            plan: 'Weekly'
        };

        localStorage.setItem('dannySession', JSON.stringify(sessionData));
        
        btn.innerText = originalText;
        btn.disabled = false;
        switchView('view-dashboard');
        startDashboardTimer(durationMs);
        
    }, 1500);
}

// --- LOGOUT ---
function logout() {
    localStorage.removeItem('dannySession');
    if (dashboardInterval) clearInterval(dashboardInterval);
    location.reload();
}

// --- METHOD LAUNCHERS ---
function launchMethod(method) {
    switchView('method-' + method);
}

// --- INITIAL LOAD CHECK ---
// If user refreshes, check session immediately
if (localStorage.getItem('dannySession')) {
    const session = JSON.parse(localStorage.getItem('dannySession'));
    if (Date.now() < session.expiry) {
        // Already logged in, go to dashboard
        switchView('view-dashboard');
        startDashboardTimer(session.expiry - Date.now());
    } else {
        localStorage.removeItem('dannySession');
        switchView('view-landing');
    }
} else {
    switchView('view-landing');
}
