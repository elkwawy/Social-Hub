import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AiOutlineSend } from "react-icons/ai";
import { API } from "../../Api/Api";

const BetaBotAI = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false); 

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      sender: "user",
      text: userInput,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setUserInput(""); // مسح حقل الإدخال فورًا بعد إرسال الرسالة

    setIsTyping(true); // تعيين حالة الكتابة إلى true عند إرسال الرسالة

    try {
      const response = await axios.post(API.sendMasgageToChatGPT, {
        prompt: userInput,
      });

      const botResponse = {
        sender: "bot",
        text: response.data.output,
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Oops! Something went wrong." },
      ]);
    } finally {
      setIsTyping(false); 
    }
  };

  const chatScreenRef = useRef(null);

  useEffect(() => {
      if (chatScreenRef.current) {
        chatScreenRef.current.scrollTo({
          top: chatScreenRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, [messages]);

  return (
    <div className="relative">
      <h1 className="text-3xl font-bold text-gray-800 mb-5 relative">
        Beta Bot AI{" "}
        <span className="text-main-color italic absolute left-28 -top-6">
          New
        </span>
      </h1>
      <div className="w-full bg-white border border-gray-300 shadow-sm rounded-lg flex flex-col h-[74.5vh]">
        <div ref={chatScreenRef} className="flex-1 overflow-y-auto p-6 rounded-lg bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-main-color text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="max-w-[70%] p-4 rounded-lg bg-gray-300 text-gray-800">
                Typing...
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center p-4 rounded-lg bg-white border-t">
          <input
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 px-4 max-md:px-0 max-md:pl-1 py-2 border rounded-lg focus:outline-none focus:ring-1 ring-gray-400"
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 p-3 bg-main-color text-white rounded-lg hover:bg-sec-color focus:outline-none focus:ring focus:ring-main-color"
          >
            <AiOutlineSend size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetaBotAI;
