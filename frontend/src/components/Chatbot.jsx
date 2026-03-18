// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import "../CustomeCss/Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const companyInfo = {
    name: "Stone Crafts",
    owner: "Stone Crafts Team",
    phone: "+91 90251 53037",
    whatsapp: "919025153037",
    email: "info@stonecrafts.com",
    address: "Chennai, Tamil Nadu, India",
    workingHours: "Monday - Saturday, 9:00 AM - 6:00 PM",
    description:
      "Stone Crafts is a premium manufacturer of handcrafted stone sculptures, temple statues, custom carvings, and architectural stone works.",
    paymentMethods: "UPI, Bank Transfer, Cash, and Online Payments",
  };
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: `Hello! 👋 Welcome to ${companyInfo.name}. 
        We specialize in premium handcrafted stone sculptures and custom carvings. 
        How can I assist you today?`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Predefined responses with keywords
  const botResponses = {
    greeting: {
      keywords: [
        "hello",
        "hi",
        "hey",
        "good morning",
        "good afternoon",
        "good evening",
        "namaste",
      ],
      responses: [
        "Hello! 😊 How can I assist you today?",
        "Hi there! 👋 What can I help you with?",
        "Hey! Welcome to our store. How may I help you?",
      ],
    },
    products: {
      keywords: [
        "product",
        "products",
        "item",
        "items",
        "what do you sell",
        "catalogue",
        "catalog",
        "details",
        "product details",
      ],
      responses: [
        "We manufacture premium handcrafted stone sculptures including:\n• Temple Idols 🛕\n• Buddha & Ganesha Statues 🗿\n• Decorative Pillars 🏛️\n• Name Boards 🪧\n• Custom Carvings 🎨\n\nWould you like details about a specific product?",
      ],
    },
    price: {
      keywords: [
        "price",
        "cost",
        "how much",
        "rate",
        "pricing",
        "expensive",
        "cheap",
        "affordable",
      ],
      responses: [
        "Our prices vary based on size, design, and customization. You can check specific product prices in our collection, or contact us for a custom quote! 💰",
        "Prices range from ₹10,000 to ₹1,00,000+ depending on the product. Would you like to see our products?",
      ],
    },
    company: {
      keywords: [
        "company name",
        "your company",
        "who are you",
        "about company",
        "about you",
        "business name",
      ],
      responses: [
        `Our company name is ${companyInfo.name}. ${companyInfo.description}`,
        `We are ${companyInfo.name}, based in ${companyInfo.address}. We specialize in premium handcrafted stone works.`,
      ],
    },
    address: {
      keywords: [
        "office address",
        "address",
        "location details",
        "where is your office",
        "company address",
      ],
      responses: [
        `Our office is located in ${companyInfo.address}. Please contact us on WhatsApp for exact map location and visit scheduling. 📍`,
      ],
    },
    hours: {
      keywords: [
        "working hours",
        "timing",
        "open time",
        "close time",
        "business hours",
      ],
      responses: [
        `Our working hours are: ${companyInfo.workingHours}. We respond quickly on WhatsApp as well!`,
      ],
    },
    payment: {
      keywords: [
        "payment",
        "how to pay",
        "payment methods",
        "upi",
        "cash",
        "bank transfer",
      ],
      responses: [
        `We accept ${companyInfo.paymentMethods}. Contact us for payment details after placing your order.`,
      ],
    },
    bulk: {
      keywords: [
        "bulk",
        "wholesale",
        "many pieces",
        "large quantity",
        "reseller",
      ],
      responses: [
        "Yes, we accept bulk and wholesale orders. Please contact us directly on WhatsApp for special pricing and discounts.",
      ],
    },
    order: {
      keywords: [
        "order",
        "buy",
        "purchase",
        "want to order",
        "how to order",
        "place order",
      ],
      responses: [
        'You can order directly through WhatsApp by clicking the "Order on WhatsApp" button, or add items to your cart and checkout! 📦',
        'To place an order, simply click on any product and hit "Order on WhatsApp" or "Add to Cart". We\'ll guide you through! 🛒',
      ],
    },
    delivery: {
      keywords: [
        "delivery",
        "shipping",
        "deliver",
        "ship",
        "how long",
        "when will i get",
        "courier",
      ],
      responses: [
        "We offer nationwide delivery! Standard delivery takes 7-15 days depending on your location. Express delivery available on request. 🚚",
        "Delivery time varies by location - typically 1-2 weeks. We use professional courier services to ensure safe delivery. 📦",
      ],
    },
    custom: {
      keywords: [
        "custom",
        "customization",
        "personalized",
        "design",
        "special order",
        "specific",
      ],
      responses: [
        "Yes! We specialize in custom stone work. Share your requirements via WhatsApp and we'll create something unique for you! 🎨",
        "Absolutely! We can create custom designs based on your specifications. Contact us on WhatsApp to discuss your vision! ✨",
      ],
    },
    contact: {
      keywords: [
        "contact",
        "phone",
        "number",
        "whatsapp",
        "email",
        "reach",
        "call",
      ],
      responses: [
        "You can reach us on WhatsApp at +91 90251 53037. Click the WhatsApp button to chat with us directly! 📱",
        "Contact us via WhatsApp: +91 90251 53037 or use the WhatsApp button on our website for instant support! 💬",
      ],
    },
    location: {
      keywords: ["location", "address", "where", "visit", "showroom", "office"],
      responses: [
        "We're based in Chennai, Tamil Nadu. For exact location and visiting hours, please contact us on WhatsApp! 📍",
        "Our workshop is in Chennai. Contact us for address details and appointment! 🏢",
      ],
    },
    material: {
      keywords: [
        "material",
        "stone",
        "granite",
        "marble",
        "what material",
        "quality",
      ],
      responses: [
        "We work with premium stones including granite, marble, sandstone, and limestone. Each piece is carefully crafted with the finest materials! 🪨",
        "We use high-quality natural stones like granite, marble, and sandstone. All materials are sourced from trusted suppliers! ✨",
      ],
    },
    thanks: {
      keywords: ["thank", "thanks", "thank you", "appreciate", "helpful"],
      responses: [
        "You're welcome! 😊 Feel free to ask if you need anything else!",
        "Happy to help! 🌟 Don't hesitate to reach out if you have more questions!",
        "My pleasure! Contact us anytime! 💚",
      ],
    },
    help: {
      keywords: ["help", "support", "assist", "question", "query"],
      responses: [
        "I'm here to help! You can ask me about:\n• Products & Prices 💎\n• Orders & Delivery 📦\n• Custom Designs 🎨\n• Contact Info 📱\nWhat would you like to know?",
      ],
    },
  };

  // Quick reply suggestions
  const quickReplies = [
    { icon: "🛍️", text: "View Products", action: "products" },
    { icon: "💰", text: "Pricing", action: "price" },
    { icon: "📦", text: "How to Order", action: "order" },
    { icon: "🎨", text: "Custom Design", action: "custom" },
    { icon: "📱", text: "Contact Us", action: "contact" },
  ];

  // Get bot response based on user input
  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();

    // Exact phrase priority check
    if (input.includes("company name")) {
      return `Our company name is ${companyInfo.name}.`;
    }

    if (input.includes("office address")) {
      return `Our office is located in ${companyInfo.address}.`;
    }

    // Keyword matching
    for (const [category, data] of Object.entries(botResponses)) {
      if (data.keywords.some((keyword) => input.includes(keyword))) {
        const responses = data.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    // Smart fallback response
    return `I'm here to assist you with:\n• Products & Pricing 💎\n• Orders & Delivery 📦\n• Custom Designs 🎨\n• Company Information 🏢\n\nFor detailed assistance, you can also contact us on WhatsApp: ${companyInfo.phone}`;
  };

  // Handle send message
  const handleSendMessage = (messageText = null) => {
    const text = messageText || inputMessage.trim();

    if (!text) return;

    // Add user message
    const userMessage = {
      type: "user",
      text: text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(
      () => {
        const botResponse = {
          type: "bot",
          text: getBotResponse(text),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000,
    ); // Random delay between 1-2 seconds
  };

  // Handle quick reply
  const handleQuickReply = (action) => {
    const quickReplyTexts = {
      products: "Show me your products",
      price: "What are your prices?",
      order: "How do I place an order?",
      custom: "I want a custom design",
      contact: "How can I contact you?",
    };

    handleSendMessage(quickReplyTexts[action]);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Open WhatsApp
  const openWhatsApp = () => {
    const number = "919025153037";
    window.open(`https://wa.me/${number}`, "_blank");
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div
        className={`chatbot-toggle ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <>
            <i className="fas fa-comments"></i>
            <span className="chat-badge">1</span>
            <span className="chat-pulse"></span>
          </>
        )}
      </div>

      {/* Chatbot Window */}
      <div className={`chatbot-window ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="header-content">
            <div className="bot-avatar">
              <i className="fas fa-robot"></i>
              <span className="status-indicator"></span>
            </div>
            <div className="bot-info">
              <h4>Stone Crafts Assistant</h4>
              <p>
                <span className="status-dot"></span>
                Online - Instant replies
              </p>
            </div>
          </div>
          <button className="minimize-btn" onClick={() => setIsOpen(false)}>
            <i className="fas fa-minus"></i>
          </button>
        </div>

        {/* Messages Area */}
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.type === "bot" && (
                <div className="message-avatar">
                  <i className="fas fa-robot"></i>
                </div>
              )}
              <div className="message-content">
                <div className="message-bubble">{message.text}</div>
                <span className="message-time">{message.time}</span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="message bot">
              <div className="message-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && (
          <div className="quick-replies">
            <p className="quick-replies-title">Quick Options:</p>
            <div className="quick-replies-grid">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply.action)}
                >
                  <span className="reply-icon">{reply.icon}</span>
                  <span className="reply-text">{reply.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="chatbot-input">
          <button
            className="whatsapp-direct-btn"
            onClick={openWhatsApp}
            title="Chat on WhatsApp"
          >
            <i className="fab fa-whatsapp"></i>
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim()}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>

        {/* Powered By */}
        <div className="chatbot-footer">
          <span>Powered by AI Assistant</span>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
