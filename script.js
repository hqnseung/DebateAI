let chatMessages = [];

// Function to display messages in the chat box
function displayMessages(messages) {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = ''; // Clear previous messages

    messages.forEach(({ sender, message }) => {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${sender}: </strong>${message}`;
        chatBox.appendChild(messageElement);
    });
 
    // Scroll to the bottom of the chat box to see the latest message
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function postDataToAPI(data) {
    try {
        const url = 'https://b26t5txooylku6i2r2f7t4k3va0lnqbx.lambda-url.us-east-2.on.aws/debate'; // Replace with your API endpoint

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const jsonData = await response.json();

        // Assuming the API returns a response in the format { assistantReply: "Chatbot's reply" }
        const assistantReply = jsonData.assistantReply;

        return assistantReply;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Function to handle user input and display chatbot's response
async function sendMessage() {
    const topicInput = document.getElementById('topic-input').value;
    const userInput = document.getElementById('user-input').value;

    if (userInput.trim() === '') return; // Ignore empty messages

    const data = {
        topic: topicInput,
        userMessage: userInput, // 전체 대화를 이어나가기 위해 마지막 메시지만 전달
    };

    try {
        // Show user message in chat
        chatMessages.push({ sender: 'User', message: userInput });
        displayMessages(chatMessages);

        const assistantReply = await postDataToAPI(data);

        // Show AI's reply in chat
        chatMessages.push({ sender: 'Chatbot', message: assistantReply });
        displayMessages(chatMessages);

        // Clear the user input after sending the message
        document.getElementById('user-input').value = '';

    } catch (error) {
        console.error('Error:', error);
    }
}

// Trigger sendMessage function when Enter key is pressed in the user input
document.getElementById('user-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
