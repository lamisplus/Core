package org.lamisplus.modules.base.domain.entities;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

    private String content;
    private String sender;
    private String receiver;
    private String date;
    private String time;
    private MessageType type;

}