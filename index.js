const sendChatBtn = document.querySelector('.chat-input span');
const chatInput = document.querySelector('.chat-input textarea');
const chatBox = document.querySelector('.chatbox');

let userMessage;

const createChatLi = (message, className) => {
  const chatLi = document.createElement('li');
  chatLi.classList.add("chat", className);

  //const chatContent = className === "outgoing" ? <p>${message}</p> : <span class="material-symbols-outlined"> smart_toy </span><p>${message}</p>;
  const chatContent = className === "outgoing" ? {__html: `<p>${message}</p>`} : `<span class="material-symbols-outlined"> smart_toy </span><p>${message}</p>`;

  chatLi.innerHTML = chatContent;
  return chatLi;
}

// const fetchWithRetry = async (url, options, retries = 5, backoff = 3000) => {
//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         if (response.status === 429) { // Too Many Requests
//           const retryAfter = response.headers.get('Retry-After') || backoff;
//           console.warn(Rate limit exceeded. Retrying in ${retryAfter} ms...);
//           await new Promise(resolve => setTimeout(resolve, retryAfter));
//         } else {
//           throw new Error(HTTP error! status: ${response.status});
//         }
//       } else {
//         return response.json();
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//     }
//   }
//   throw new Error('Max retries reached');
// }
const fetchWithRetry = async (url, options, retries = 5, backoff = 3000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          if (response.status === 429) { // Too Many Requests
            const retryAfter = response.headers.get('Retry-After') || backoff;
            console.warn(`Rate limit exceeded. Retrying in ${retryAfter} ms...`);
            await new Promise(resolve => setTimeout(resolve, retryAfter));
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          return response.json();
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
    throw new Error('Max retries reached');
  }

const generateResponse = async (incomingChatLi) => {
//   const API_URL = "https://api.openai.com/v1/chat/completions";
//   const apiKey = 'YOUR_API_KEY'; // Replace with your API key securely

//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": Bearer ${apiKey}
//     },
//     body: JSON.stringify({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: userMessage }]
//     })
//   };
const API_URL = "https://api.openai.com/v1/chat/completions";
  const apiKey = "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";

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }]
    })
  };
  try {
    const data = await fetchWithRetry(API_URL, requestOptions);
    incomingChatLi.querySelector('p').textContent = data.choices[0].message.content;
  } catch (error) {
    incomingChatLi.querySelector('p').textContent = "Oops! Something went wrong. Please try again.";
  }
}

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatBox.appendChild(createChatLi(userMessage, 'outgoing'));

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking.....", "incoming");
    chatBox.appendChild(incomingChatLi);
    generateResponse(incomingChatLi);
  }, 600);
}

sendChatBtn.addEventListener('click', handleChat);