const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
let userMessage = null; // Variable to store user's message
let chatHistory = []; // Array to store chat history
const inputInitHeight = chatInput.scrollHeight;

// API configuration
const API_KEY =
  "b4efd2ab20fb90065f27bf60b159a06decd32f8805345e7290c8e12d8b901ab1"; // Your AIXPLAIN API key here
const API_URL =
  "https://models.aixplain.com/api/v1/execute/640b517694bf816d35a59125"; // Update with your AIXPLAIN model URL

// Custom responses object
const customResponses = {
  "What is the function of the kidneys?":
    "Kidneys filter waste and excess fluids from the blood, which are excreted as urine. They also help regulate blood pressure, maintain electrolyte balance, and produce hormones that support red blood cell production and bone health.",
  "What are the symptoms of kidney disease?":
    "Early-stage kidney disease often has no symptoms. As it progresses, symptoms can include fatigue, swelling in the legs and ankles, changes in urination, high blood pressure, nausea, and difficulty concentrating. Many symptoms are often mistaken for other conditions.",
  "How can I keep my kidneys healthy?":
    "To keep kidneys healthy, maintain a balanced diet, stay hydrated, exercise regularly, manage blood pressure, avoid smoking, and reduce salt intake. It's also important to get regular check-ups if you have diabetes or high blood pressure, as these conditions can damage kidneys.",
  "What causes kidney disease?":
    "Kidney disease can be caused by diabetes, high blood pressure, infections, or genetic conditions. Long-term use of certain medications or exposure to toxins can also lead to kidney problems. Early detection and lifestyle changes can help manage and prevent further complications.",
  "Can kidney disease be cured?":
    "Chronic kidney disease (CKD) has no cure, but its progression can be slowed down with lifestyle changes and treatment. Early detection and proper management are key to preventing further damage. In advanced cases, dialysis or a kidney transplant may be necessary.",
  "What is acute kidney injury?":
    "Acute kidney injury (AKI) occurs when the kidneys suddenly stop working properly, often due to injury, severe dehydration, or infections. AKI is typically reversible with prompt treatment, unlike chronic kidney disease, which is a long-term condition.",
  "How can I reduce the risk of developing kidney disease?":
    "Reducing the risk involves controlling blood sugar if you have diabetes, keeping blood pressure in check, avoiding excessive use of painkillers, maintaining a healthy diet, and staying hydrated. Regular medical check-ups are also important for early detection.",
  "What foods are good for kidney health?":
    "Foods rich in antioxidants, such as berries, leafy greens, apples, and cauliflower, are great for kidney health. Limiting salt, processed foods, and animal protein can also help protect the kidneys from damage and support overall function.",
  "Can drinking too much water harm my kidneys?":
    "While staying hydrated is important, drinking excessive amounts of water can overwhelm the kidneys, especially in individuals with kidney problems. Moderation is key, and it's best to drink water according to your body's needs to avoid overhydration.",
  "Is high blood pressure related to kidney disease?":
    "Yes, high blood pressure is a major cause of kidney disease. It damages the blood vessels in the kidneys, reducing their ability to filter waste. Managing blood pressure is crucial to maintaining kidney health and preventing further complications.",
  "What is chronic kidney disease (CKD)?":
    "CKD is a long-term condition where the kidneys gradually lose their ability to filter waste from the blood. It can lead to kidney failure if untreated. It is often caused by high blood pressure or diabetes, and early diagnosis is crucial to slow its progression.",
  "How is CKD diagnosed?":
    "CKD is diagnosed through blood tests (to check for creatinine levels), urine tests (to detect protein), and imaging tests like ultrasounds. A biopsy may be performed in some cases to determine the underlying cause and assess the level of damage.",
  "What are the stages of CKD?":
    "CKD has five stages, ranging from mild (Stage 1) to kidney failure (Stage 5). Stages are based on how well the kidneys are filtering blood, measured by the glomerular filtration rate (GFR). The higher the stage, the more severe the kidney damage.",
  "Can CKD lead to kidney failure?":
    "Yes, CKD can progress to kidney failure if untreated. In kidney failure, dialysis or a kidney transplant may be required for survival. Early treatment can slow the progression of CKD and may delay or prevent the need for dialysis or transplant.",
  "How is CKD treated?":
    "Treatment for CKD involves managing underlying conditions like high blood pressure or diabetes, dietary changes, and sometimes medications. In advanced stages, dialysis or a kidney transplant may be necessary to replace kidney function and improve quality of life.",
  "What are the symptoms of late-stage CKD?":
    "Late-stage CKD may cause symptoms like swelling in the feet and ankles, fatigue, frequent urination, loss of appetite, muscle cramps, and shortness of breath. At this stage, kidney function is significantly impaired, and dialysis or a kidney transplant may be required.",
  "What is the glomerular filtration rate (GFR)?":
    "GFR is a measure of how well your kidneys are filtering blood. It is used to assess the stage of CKD. A GFR below 60 for three months or more indicates chronic kidney disease, while a GFR below 15 may indicate kidney failure.",
  "How does CKD affect other parts of the body?":
    "CKD can lead to complications in other parts of the body, including heart disease, anemia, bone disease, and nerve damage. It also increases the risk of cardiovascular problems, making overall health management important in CKD patients.",
  "Is there a specific diet for people with CKD?":
    "Yes, people with CKD are often advised to follow a kidney-friendly diet, which involves limiting salt, potassium, and phosphorus. Protein intake may also be reduced to prevent strain on the kidneys. A dietitian can help tailor the diet to individual needs.",
  "Can CKD be reversed?":
    "CKD cannot be fully reversed, but its progression can be slowed down or halted with proper management, especially if detected early. Managing underlying conditions like diabetes and hypertension is crucial for preventing further kidney damage.",
  "What is a kidney cyst?":
    "A kidney cyst is a fluid-filled sac that forms on or in the kidney. Most kidney cysts are non-cancerous and cause no symptoms, but large cysts may cause pain or interfere with kidney function, requiring monitoring or treatment.",
  "What are the symptoms of a kidney tumor?":
    "Kidney tumors may not show symptoms in the early stages. As the tumor grows, symptoms can include blood in urine, back pain, unexplained weight loss, and fatigue. Some tumors can be cancerous, and early detection is key for effective treatment.",
  "How are kidney stones formed?":
    "Kidney stones form when minerals in urine crystallize and stick together. They can cause intense pain, especially when passing through the urinary tract, and may lead to infection if untreated. Factors like diet, dehydration, and genetic predisposition can increase the risk.",
  "What is the treatment for kidney stones?":
    "Small kidney stones may pass on their own with increased fluid intake and pain management. Larger stones may require medical procedures like lithotripsy (shock waves) or surgery to remove them. It's important to address stones early to avoid complications.",
  "Can kidney cysts turn into cancer?":
    "Most simple kidney cysts are benign and do not turn into cancer. However, complex cysts with irregularities may require monitoring or further testing to ensure they are not cancerous. Regular follow-up imaging is recommended in such cases.",
  "Can kidney tumors be treated without surgery?":
    "Treatment for kidney tumors depends on their size and type. Some small tumors can be treated with active surveillance, while larger or cancerous tumors may require surgery, radiation, or targeted therapy. Early detection improves treatment outcomes.",
  "What causes kidney cysts?":
    "Kidney cysts can occur due to age, and the cause is often unknown. They are common in people over 50. Polycystic kidney disease, a genetic disorder, can also cause multiple cysts to form in the kidneys and may lead to kidney dysfunction over time.",
  "How can I prevent kidney stones?":
    "Drinking plenty of water, reducing salt intake, and eating a diet low in oxalates (found in spinach, nuts, and chocolate) can help prevent kidney stones. Limiting animal protein may also reduce the risk, and maintaining a balanced diet is essential.",
  "Are kidney tumors always cancerous?":
    "No, not all kidney tumors are cancerous. Some benign tumors, like angiomyolipomas, do not spread and may not require treatment. However, all tumors should be evaluated to determine their nature and the appropriate course of action.",
  "What happens if a kidney stone is left untreated?":
    "If left untreated, kidney stones can cause severe pain, infection, and kidney damage. Large stones may obstruct the urinary tract, leading to infection or decreased kidney function. Medical intervention is necessary to prevent long-term complications.",
  "How does a normal kidney function look in an X-ray?":
    "A normal kidney on an X-ray shows a clear, bean-shaped organ without any abnormal masses, stones, or irregularities. The size and position of the kidneys can also indicate their health, and any deviations may suggest underlying problems.",
  "What is the difference between a normal kidney and a diseased kidney in an X-ray?":
    "In a diseased kidney, the X-ray may show cysts, tumors, or stones. The shape may be distorted, or the kidney may appear enlarged or shriveled, depending on the condition. These abnormalities can indicate underlying health issues that require further investigation.",
  "How often should I get my kidneys checked?":
    "If you are at risk for kidney disease (due to diabetes, high blood pressure, or family history), you should have regular kidney function tests, typically annually. For healthy individuals, routine check-ups every few years are recommended, especially as you age or if symptoms arise.",
  "What imaging techniques are used to examine kidney health?":
    "Common imaging techniques include ultrasound, CT scans, MRIs, and X-rays. These are used to detect structural abnormalities like cysts, tumors, or kidney stones. Each method provides different insights into kidney health and helps in diagnosing potential issues.",
  "Can kidney disease be detected early through imaging?":
    "Yes, imaging techniques like ultrasound, CT scans, and MRIs can detect structural abnormalities in the kidneys that may indicate disease, such as cysts, stones, or tumors. Early detection through imaging is crucial for effective management and treatment of kidney conditions.",
};

// Function to create chat <li> elements
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);

  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;

  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;

  // Custom logic to modify HTML without affecting the UI
  if (className === "incoming" && message === "Thinking...") {
    chatLi.querySelector("p").innerHTML = `<div class="dots"></div>`;
  }

  return chatLi;
};

// Function to generate response from the API or custom responses
const generateResponse = async (chatElement) => {
  const messageElement = chatElement.querySelector("p");

  // Check for "what did I ask earlier?" to reference previous conversation
  if (userMessage.toLowerCase().includes("what did i ask earlier")) {
    if (chatHistory.length > 0) {
      // Fetch the last question the user asked
      const lastUserMessage = chatHistory
        .slice()
        .reverse()
        .find((item) => item.role === "user")?.message;
      messageElement.textContent = `You asked: "${lastUserMessage}"`;
    } else {
      messageElement.textContent =
        "I don't have any records of what you asked earlier.";
    }
    chatbox.scrollTo(0, chatbox.scrollHeight);
    return;
  }

  // Check for custom responses first
  if (customResponses[userMessage.toLowerCase()]) {
    messageElement.textContent = customResponses[userMessage.toLowerCase()];
    chatbox.scrollTo(0, chatbox.scrollHeight);
    return; // Stop further processing
  }

  // Define the properties and message for the API request
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify({
      text: userMessage,
    }),
  };

  // Send POST request to API, get response and set the response as paragraph text
  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    // Poll for the response until it's completed
    const urlToPoll = data.data; // URL to poll for the response

    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await fetch(urlToPoll, {
          method: "get",
          headers: { "x-api-key": API_KEY },
        });

        const result = await statusResponse.json();
        if (result.completed) {
          clearInterval(pollInterval);
          // Update the message element with the final response
          messageElement.textContent = result.data;
        }
      } catch (error) {
        clearInterval(pollInterval);
        messageElement.classList.add("error");
        messageElement.textContent = "Error fetching the response.";
      }
    }, 5000); // Poll every 5 seconds
  } catch (error) {
    messageElement.classList.add("error");
    messageElement.textContent = error.message;
  } finally {
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
};

const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
  if (!userMessage) return;

  // Example restriction: Disallow certain words
  const restrictedWords = [
    "spam",
    "scam",
    "offensive",
    "fake",
    "phishing",
    "harmful",
    "illegal",
    "abusive",
    "fraud",
    "violent",
    "explicit",
    "malware",
    "hacking",
    "virus",
    "hoax",
    "porn",
    "racist",
    "hate speech",
    "threat",
    "misleading",
  ];
  for (const word of restrictedWords) {
    if (userMessage.toLowerCase().includes(word)) {
      chatbox.appendChild(
        createChatLi("Your message contains restricted words.", "incoming")
      );
      chatbox.scrollTo(0, chatbox.scrollHeight);
      return; // Stop further processing
    }
  }

  // Store user message in chat history
  chatHistory.push({ role: "user", message: userMessage });

  // Clear the input textarea and set its height to default
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    // Display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);

    // Store chatbot response in chat history
    chatHistory.push({
      role: "bot",
      message: incomingChatLi.querySelector("p").textContent,
    });
  }, 600);
};

chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  // If Enter key is pressed without Shift key and the window
  // width is greater than 800px, handle the chat
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
