document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const strengthBar = document.getElementById('strength-bar');
    const feedbackContainer = document.getElementById('feedback');
    const summaryMessage = document.getElementById('summary-message');

    const checks = {
        length: document.getElementById('length-check'),
        lowercase: document.getElementById('lowercase-check'),
        uppercase: document.getElementById('uppercase-check'),
        number: document.getElementById('number-check'),
        symbol: document.getElementById('symbol-check'),
        common: document.getElementById('common-check')
    };

    const commonPatterns = [
        'password', '123456', 'qwerty', 'admin', 'iloveyou'
    ];

    function getStrength(password) {
        const results = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
            common: !commonPatterns.some(pattern => password.toLowerCase().includes(pattern))
        };

        let score = 0;
        if (results.length) score++;
        if (results.lowercase) score++;
        if (results.uppercase) score++;
        if (results.number) score++;
        if (results.symbol) score++;
        if (results.common) score++;

        return { score, results };
    }

    function updateUI(strength) {
        const { score, results } = strength;
        const totalChecks = Object.keys(results).length;
        const percentage = (score / totalChecks) * 100;

        let barColor = '';
        if (score <= 2) {
            barColor = 'bg-red-400';
        } else if (score <= 4) {
            barColor = 'bg-yellow-400';
        } else {
            barColor = 'bg-green-400';
        }

        strengthBar.className = `strength-bar transition-all duration-300 ${barColor}`;
        strengthBar.style.width = `${percentage}%`;

        // Update feedback icons and colors
        for (const key in checks) {
            if (results[key]) {
                checks[key].innerHTML = '&#x2713;';
                checks[key].classList.replace('text-red-500', 'text-green-500');
            } else {
                checks[key].innerHTML = '&#x2717;';
                checks[key].classList.replace('text-green-500', 'text-red-500');
            }
        }

        // Update summary message
        let message = '';
        if (score === 0) {
            message = 'Start typing to analyze your password.';
        } else if (score <= 2) {
            message = 'Weak password. Try adding more characters and types.';
        } else if (score <= 4) {
            message = 'Medium password. Add more complexity to make it stronger.';
        } else if (score <= 5) {
            message = 'Strong password!';
        } else {
            message = 'Excellent password! Very secure.';
        }
        summaryMessage.textContent = message;
    }

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strength = getStrength(password);
        updateUI(strength);
    });

    // Initial state
    updateUI(getStrength(''));

    // New Gemini API Functionality
    const geminiButton = document.getElementById('gemini-analysis-btn');
    const geminiResponseContainer = document.getElementById('gemini-response-container');
    const geminiResponseText = document.getElementById('gemini-response-text');
    const geminiLoading = document.getElementById('gemini-loading');

    geminiButton.addEventListener('click', async () => {
        const password = passwordInput.value;
        if (!password) {
            geminiResponseText.textContent = "Please enter a password to analyze.";
            geminiResponseContainer.classList.remove('hidden');
            return;
        }

        // Show loading state and disable button
        geminiButton.disabled = true;
        geminiResponseContainer.classList.remove('hidden');
        geminiLoading.classList.remove('hidden');
        geminiResponseText.textContent = '';

        try {
            const systemPrompt = "You are a password security expert. Analyze the provided password and provide a brief, friendly, and educational breakdown of its security strengths and weaknesses. Be encouraging and provide 3-5 actionable tips to improve its security. Use a clear, concise format with bullet points for the tips.";
            const userQuery = `Analyze the password: "${password}"`;
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const payload = {
                contents: [{ parts: [{ text: userQuery }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                geminiResponseText.textContent = text;
            } else {
                geminiResponseText.textContent = "Sorry, I couldn't get an analysis at this time. Please try again.";
            }

        } catch (error) {
            console.error('Error fetching Gemini response:', error);
            geminiResponseText.textContent = `An error occurred: ${error.message}`;
        } finally {
            // Hide loading state and re-enable button
            geminiLoading.classList.add('hidden');
            geminiButton.disabled = false;
        }
    });
});
