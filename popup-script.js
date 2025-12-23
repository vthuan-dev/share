// Popup functionality
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('closeBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const registerBtn = document.getElementById('registerBtn');

    // Close popup function
    function closePopup() {
        popup.style.animation = 'popupExit 0.3s forwards';
        overlay.style.animation = 'fadeOut 0.3s forwards';
        
        setTimeout(() => {
            // In a real application, you would hide or remove the popup
            console.log('Popup closed');
        }, 300);
    }

    // Register function
    function handleRegister() {
        console.log('Navigating to registration page...');
        // In a real application, navigate to the account/registration page
        // window.location.href = '/account';
        
        // Add a nice transition effect
        popup.style.animation = 'popupExit 0.3s forwards';
        overlay.style.animation = 'fadeOut 0.3s forwards';
        
        setTimeout(() => {
            alert('Chuyển đến trang Tài khoản để đăng ký gói...');
        }, 300);
    }

    // Event listeners
    closeBtn.addEventListener('click', closePopup);
    cancelBtn.addEventListener('click', closePopup);
    registerBtn.addEventListener('click', handleRegister);
    
    // Close on overlay click
    overlay.addEventListener('click', closePopup);
    
    // Prevent closing when clicking inside popup
    popup.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Keyboard support (ESC to close)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
});

// Add exit animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes popupExit {
        to {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
