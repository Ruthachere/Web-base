
const sendChatBtn = document.querySelector('.chat-input span');
const chatInput = document.querySelector('.chat-input textarea');
const chatBox = document.querySelector('.chatbox');

let userMessage;

const createChatLi = (message, className) => {
  // Create a chat <li> element with passed message and className
  const chatLi = document.createElement('li');
  chatLi.classList.add("chat", className);

  let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined"> smart_toy </span><p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
}

const generateResponse = (incomingChatLi) => {
  const apiKey = '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';

  // Define the API endpoint and request headers
  const url = 'https://api.openai.com/v1/chat/completions';
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${apiKey}'
  };

  // Define the request payload
  const data = {
      model: "gpt-3.5-turbo",
      messages: [

          {
              role: "user",
              content: "Hello!"
          }
      ]
  };

  // Make the POST request using fetch
  fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
      // Handle the response data here
      console.log(data);
  })
  .catch(error => {
      // Handle any errors here
      console.error('Error:', error);
  });
}

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  // Append the user's message to the chat box
  chatBox.appendChild(createChatLi(userMessage, 'outgoing'));

  setTimeout(() => {
    // Display "Thinking..." while waiting for the response
    const incomingChatLi = createChatLi("Thinking.....", "incoming");
    chatBox.appendChild(incomingChatLi);
    generateResponse(incomingChatLi);
  }, 600);
}

sendChatBtn.addEventListener('click', handleChat);
