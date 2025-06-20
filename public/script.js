document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    // Function to append messages to the chat box
    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        // Add a general 'message' class and a specific sender class
        messageElement.classList.add('message', sender.toLowerCase() + '-message');

        const senderStrong = document.createElement('strong');
        senderStrong.textContent = sender + ': ';

        const messageText = document.createElement('span');
        messageText.textContent = message;

        messageElement.appendChild(senderStrong);
        messageElement.appendChild(messageText);

        chatBox.appendChild(messageElement);
        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default page reload

        const userMessage = userInput.value.trim();

        if (!userMessage) {
            return; // Don't send empty messages
        }

        // Display user's message immediately
        appendMessage('User', userMessage);
        userInput.value = ''; // Clear the input field

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ reply: 'Server returned an error.' }));
                appendMessage('Error', errorData.reply || `Error: ${response.status}`);
                return;
            }

            const data = await response.json();
            appendMessage('AI', data.reply);

        } catch (error) {
            console.error('Error sending message:', error);
            appendMessage('Error', 'Failed to connect to the AI. Please check your connection or try again later.');
        }
    });
});