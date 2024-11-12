import React, { useState, useEffect, useRef } from 'react';
import { FaPhoneAlt, FaVideo, FaEllipsisV, FaSmile, FaPaperclip, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { SlOptionsVertical } from "react-icons/sl";
import EmojiPicker from 'emoji-picker-react';
import MessageStore from '../../Store/MessageStore';
import { useAuth } from '../../Store/AuthStore';

const Chat = ({ selectedUser, setShowChatOnMobile }) => {
  const { user } = useAuth();
  const messages = MessageStore((state) => state.messages);
  const fetchMessages = MessageStore((state) => state.fetchMessages);
  const sendMessage = MessageStore((state) => state.sendMessage);

  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(null); // To track which message has an open menu
  const menuRef = useRef(null); // Ref for context menu
  const buttonRef = useRef(null); // Ref for the options button

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && selectedUser?._id) {
      sendMessage(selectedUser._id, message, user._id);
      setMessage('');
      inputRef.current.innerText = '';
      scrollToBottom();
    }
  };



  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    inputRef.current.innerText += emoji;
    setMessage(inputRef.current.innerText);
    setShowEmojiPicker(false);
  };

  const toggleMenu = (index) => {
    setMenuVisible(menuVisible === index ? null : index);
  };

  const closeMenu = () => setMenuVisible(null);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen">
      {selectedUser ? (
        <>
          <div className="flex items-center justify-between p-4 text-white shadow-sm">
            <button className="lg:hidden p-2 rounded-full hover:bg-gray-700" onClick={() => setShowChatOnMobile(null)}>
              <FaArrowLeft />
            </button>
            <div className="flex items-center">
              <img src={`${process.env.REACT_APP_BACKEND_URL}/${selectedUser.profilePicture}`} alt="profile" className="w-10 h-10 rounded-full mr-4" />
              <div>
                <h2 className="text-lg font-bold">{selectedUser.name}</h2>
                <p className={`font-semibold ${selectedUser.active ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedUser.active ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-700"><FaPhoneAlt /></button>
              <button className="p-2 rounded-full hover:bg-gray-700"><FaVideo /></button>
              <button className="p-2 rounded-full hover:bg-gray-700"><FaEllipsisV /></button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender._id === selectedUser._id ? 'justify-start' : 'justify-end'} my-2`}>
                  <div style={{ position: 'relative', maxWidth: '70%' }}>
                    <p className={`inline-block p-2 rounded-xl ${msg.sender._id === selectedUser._id ? 'bg-blue-400' : 'bg-green-400'}`}
                      style={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', maxWidth: '100%' }}>
                      {msg.content}
                    </p>

                    <button ref={buttonRef} onClick={() => toggleMenu(index)}
                      style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                      <SlOptionsVertical />
                    </button>

                    {menuVisible === index && (
                      <div ref={menuRef} className="absolute z-20 bg-gray-800 text-white rounded-lg shadow-md p-2">
                        <ul>
                          <li className="p-2 hover:bg-gray-700 cursor-pointer" onClick={closeMenu}>Reply</li>
                          <li className="p-2 hover:bg-gray-700 cursor-pointer" onClick={closeMenu}>Copy</li>
                          <li className="p-2 hover:bg-gray-700 cursor-pointer" onClick={closeMenu}>Forward</li>
                          <li className="p-2 hover:bg-gray-700 cursor-pointer" onClick={closeMenu}>Delete</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center my-5">No messages yet. Start the conversation!</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 flex items-center space-x-4 w-full max-w-4xl mx-auto">
            <div className="relative flex items-center rounded-xl p-2 w-full">
              <button className="absolute left-2 p-2 rounded-full hover:bg-gray-600 text-white" onClick={() => setShowEmojiPicker((prev) => !prev)}>
                <FaSmile />
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0"><EmojiPicker onEmojiClick={handleEmojiClick} /></div>
              )}

              <div ref={inputRef} className="flex-1 mx-12 p-2 text-white bg-transparent resize-none outline-none"
                contentEditable suppressContentEditableWarning={true} onInput={(e) => setMessage(e.target.innerText)}
                onKeyDown={handleKeyDown} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
                style={{ whiteSpace: 'pre-wrap' }}>
                {!isFocused && !message && <div className="absolute top-2 left-12 text-gray-400 pointer-events-none">Type a message...</div>}
              </div>

              <button className="absolute right-2 p-2 rounded-full hover:bg-gray-600 text-white"
                onClick={() => setShowAttachmentOptions((prev) => !prev)}><FaPaperclip /></button>

              {showAttachmentOptions && (
                <div className="absolute bottom-12 right-0 bg-gray-800 p-2 rounded-md">
                  {/* Attachment options */}
                </div>
              )}
            </div>

            <button className="p-2 rounded-full hover:bg-gray-700" onClick={handleSendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 text-center text-gray-500 mt-20">Select a conversation</div>
      )}
    </div>
  );
};

export default Chat;
