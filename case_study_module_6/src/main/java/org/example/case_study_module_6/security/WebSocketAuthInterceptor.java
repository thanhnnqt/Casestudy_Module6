package org.example.case_study_module_6.security;

import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.service.impl.JwtService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader =
                    accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                String token = authHeader.substring(7);

                String username = jwtService.getUsernameFromToken(token);
                String role = jwtService.getRoleFromToken(token);

                var claims = jwtService.extractClaims(token);
                Long profileId = claims.get("profileId", Long.class);
                Long userId = claims.get("userId", Long.class);

                // ⭐ KEY QUAN TRỌNG: Gán username cho STOMP Principal
                accessor.setUser(() -> username);

                accessor.getSessionAttributes().put("role", role);
                accessor.getSessionAttributes().put("profileId", profileId);
                accessor.getSessionAttributes().put("userId", userId);
            }
        }
        return message;
    }
}