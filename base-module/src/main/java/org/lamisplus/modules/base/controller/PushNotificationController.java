package org.lamisplus.modules.base.controller;

import org.lamisplus.modules.base.domain.entities.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class PushNotificationController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

//    @MessageMapping("/chat.sendMessage")
//    @SendTo("/topic/public")
//    public ChatMessage sendMessage (
//            @Payload ChatMessage chatMessage
//    ){
//        return chatMessage;
//    }
//
//    @MessageMapping("/chat.addUser")
//    @SendTo("/topic/public")
//    public ChatMessage getChatMessage(
//            @Payload ChatMessage chatMessage,
//            SimpMessageHeaderAccessor headerAccessor
//    ){
//        //add username in websocket session
//        headerAccessor.getSessionAttributes().put("username",chatMessage.getSender());
//        return chatMessage;
//    }
//
//    @MessageMapping("/private")
//    public void sendToSpecificUser (@Payload ChatMessage chatMessage){
//        simpMessagingTemplate.convertAndSendToUser(chatMessage.getSender(),"/specific",chatMessage);
//    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage chatMessage) {
        chatMessage.setDate(LocalDateTime.now().toLocalDate().toString());
        chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
        return chatMessage; // ✅ now includes sender, content, date, time
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(ChatMessage chatMessage) {
        chatMessage.setContent(chatMessage.getSender() + " joined the chat");
        chatMessage.setDate(LocalDateTime.now().toLocalDate().toString());
        chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
        return chatMessage;
    }
}
