import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import EmojiPicker from "emoji-picker-react";
import { wsUrl } from "../../../api";

let stompClient = null;

const COLORS = ["#007bff", "#6610f2", "#28a745", "#ffc107", "#e83e8c", "#17a2b8"];

const ChatWidget = ({ username }) => {
    const [open, setOpen] = useState(false);
    const [connected, setConnected] = useState(false);
    const [users, setUsers] = useState({});
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [typingUsers, setTypingUsers] = useState([]);
    const [showEmoji, setShowEmoji] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Connect to socket
    useEffect(() => {
        if (open && !connected) {
            const socket = new SockJS(`${wsUrl}`);
            stompClient = over(socket);
            stompClient.connect({}, onConnected, onError);
        }
        return () => {
            if (stompClient && connected) {
                stompClient.disconnect();
                setConnected(false);
            }
        };
    }, [open]);

    useEffect(() => {
        if (messagesEndRef.current)
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onConnected = () => {
        setConnected(true);
        stompClient.subscribe("/topic/public", onMessageReceived);
        stompClient.send(
            "/app/chat.addUser",
            {},
            JSON.stringify({ sender: username, type: "JOIN" })
        );
    };

    const onError = (err) => console.error("WebSocket Error:", err);

    const onMessageReceived = (payload) => {
        const msg = JSON.parse(payload.body);
        if (msg.type === "JOIN") {
            setUsers((prev) => ({
                ...prev,
                [msg.sender]: {
                    color: COLORS[Object.keys(prev).length % COLORS.length],
                },
            }));
            setMessages((prev) => [
                ...prev,
                { content: `${msg.sender} joined the chat`, type: "SYSTEM" },
            ]);
        } else if (msg.type === "LEAVE") {
            setMessages((prev) => [
                ...prev,
                { content: `${msg.sender} left the chat`, type: "SYSTEM" },
            ]);
        } else if (msg.type === "TYPING") {
            handleTypingIndicator(msg.sender);
        } else {
            setMessages((prev) => [...prev, msg]);
        }
    };

    const handleTypingIndicator = (sender) => {
        if (sender === username) return;
        setTypingUsers((prev) =>
            prev.includes(sender) ? prev : [...prev, sender]
        );
        setTimeout(() => {
            setTypingUsers((prev) => prev.filter((u) => u !== sender));
        }, 1500);
    };

    const sendTypingNotification = () => {
        if (stompClient)
            stompClient.send(
                "/app/chat.typing",
                {},
                JSON.stringify({ sender: username, type: "TYPING" })
            );
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);
        clearTimeout(typingTimeoutRef.current);
        sendTypingNotification();
        typingTimeoutRef.current = setTimeout(() => {}, 1000);
    };

    const sendMessage = () => {
        if (stompClient && message.trim() !== "") {
            const chatMessage = {
                sender: username,
                content: message,
                type: "CHAT",
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            setMessage("");
            setShowEmoji(false);
        }
    };

    const getInitials = (name) =>
        name
            .split(" ")
            .map((n) => n[0].toUpperCase())
            .join("");

    return (
        <>
            {/* Floating Chat Button */}
            {!open && (
                <Button
                    onClick={() => setOpen(true)}
                    style={{
                        position: "fixed",
                        bottom: "25px",
                        right: "25px",
                        borderRadius: "50%",
                        width: "60px",
                        height: "60px",
                        background: "linear-gradient(135deg, #007bff, #6610f2)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                        fontSize: "26px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    💬
                </Button>
            )}

            {/* Chat Box */}
            {open && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "25px",
                        right: "25px",
                        width: "370px",
                        height: "520px",
                        background: "#fff",
                        borderRadius: "16px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        animation: "slideUp 0.3s ease",
                        zIndex: 10000,
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, #007bff, #6610f2)",
                            color: "white",
                            padding: "10px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <b>Chat Room</b>
                            <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                                {connected ? `${Object.keys(users).length} online` : "Connecting..."}
                            </div>
                        </div>
                        <Button
                            size="sm"
                            variant="light"
                            style={{
                                borderRadius: "50%",
                                padding: "5px 10px",
                                fontSize: "14px",
                            }}
                            onClick={() => {
                                setOpen(false);
                                if (stompClient)
                                    stompClient.send(
                                        "/app/chat.leave",
                                        {},
                                        JSON.stringify({ sender: username, type: "LEAVE" })
                                    );
                            }}
                        >
                            ✖
                        </Button>
                    </div>

                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "10px",
                            background: "#f1f3f6",
                        }}
                    >
                        {messages.map((msg, i) => {
                            if (msg.type === "SYSTEM")
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            textAlign: "center",
                                            color: "#666",
                                            fontSize: "0.8rem",
                                            margin: "8px 0",
                                        }}
                                    >
                                        {msg.content}
                                    </div>
                                );

                            const isMine = msg.sender === username;
                            const userColor = users[msg.sender]?.color || "#007bff";
                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        justifyContent: isMine ? "flex-end" : "flex-start",
                                        marginBottom: "10px",
                                        alignItems: "flex-end",
                                    }}
                                >
                                    {!isMine && (
                                        <div
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "50%",
                                                backgroundColor: userColor,
                                                color: "white",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold",
                                                marginRight: "6px",
                                            }}
                                        >
                                            {getInitials(msg.sender)}
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            backgroundColor: isMine ? userColor : "#fff",
                                            color: isMine ? "white" : "black",
                                            borderRadius: "18px",
                                            padding: "8px 12px",
                                            maxWidth: "70%",
                                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                        }}
                                    >
                                        {msg.content}
                                        <div
                                            style={{
                                                fontSize: "0.7rem",
                                                textAlign: "right",
                                                opacity: 0.7,
                                            }}
                                        >
                                            {msg.time}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {typingUsers.length > 0 && (
                            <div
                                style={{
                                    fontStyle: "italic",
                                    color: "#666",
                                    fontSize: "0.85rem",
                                    marginLeft: "8px",
                                }}
                            >
                                {typingUsers.join(", ")} typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: "10px", background: "#fff", borderTop: "1px solid #ddd" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Button
                                variant="light"
                                style={{
                                    borderRadius: "50%",
                                    width: "40px",
                                    height: "40px",
                                    fontSize: "20px",
                                    marginRight: "5px",
                                }}
                                onClick={() => setShowEmoji(!showEmoji)}
                            >
                                😊
                            </Button>
                            <Form.Control
                                type="text"
                                placeholder="Type a message..."
                                value={message}
                                onChange={handleTyping}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                style={{
                                    borderRadius: "25px",
                                    padding: "10px 15px",
                                    border: "1px solid #ccc",
                                    flex: 1,
                                }}
                            />
                            <Button
                                variant="primary"
                                onClick={sendMessage}
                                style={{
                                    borderRadius: "25px",
                                    marginLeft: "5px",
                                    padding: "8px 15px",
                                }}
                            >
                                ➤
                            </Button>
                        </div>

                        {showEmoji && (
                            <div style={{ position: "absolute", bottom: "70px", right: "25px" }}>
                                <EmojiPicker onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
        </>
    );
};

export default ChatWidget;