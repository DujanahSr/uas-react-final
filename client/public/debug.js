// FORCE CONSOLE OUTPUT - SELALU TAMPIL
console.log('🚀 =======================================');
console.log('🚀 FLIGHT BOOKING APP - ERROR DEBUGGING');
console.log('🚀 =======================================');
console.log('📅 Timestamp:', new Date().toLocaleString());
console.log('🔗 URL:', window.location.href);
console.log('📱 User Agent:', navigator.userAgent);
console.log('🌐 Platform:', navigator.platform);

// Force immediate error test
console.error('🔥 FORCED ERROR #1: Testing immediate error output');

// Force another error
setTimeout(() => {
  console.error('🔥 FORCED ERROR #2: Delayed error test');
}, 100);

// Force error every 2 seconds to ensure output shows
let errorCount = 0;
const forceErrors = () => {
  errorCount++;
  console.error(`🔥 REPEATED ERROR #${errorCount}: Force error test at ${new Date().toLocaleTimeString()}`);
  
  if (errorCount < 10) {
    setTimeout(forceErrors, 2000);
  }
};

// Start forcing errors
setTimeout(forceErrors, 500);

// Override console.error to ensure all errors show
const originalError = console.error;
console.error = function(...args) {
  originalError.apply(console, ['🚨 ERROR CAPTURED:', ...args]);
};

// Log all console activities
const originalLog = console.log;
console.log = function(...args) {
  originalLog.apply(console, ['📝 LOG:', ...args]);
};

const originalWarn = console.warn;
console.warn = function(...args) {
  originalWarn.apply(console, ['⚠️  WARN:', ...args]);
};

// Make sure errors are visible
window.addEventListener('error', (event) => {
  console.error('🚨 UNHANDLED ERROR:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 UNHANDLED PROMISE REJECTION:', event.reason);
});

console.log('✅ Force console setup complete - errors will be logged!');
