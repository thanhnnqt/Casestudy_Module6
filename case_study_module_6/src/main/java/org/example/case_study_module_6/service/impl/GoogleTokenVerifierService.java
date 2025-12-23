// service/impl/GoogleTokenVerifierService.java
package org.example.case_study_module_6.service.impl;

import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleTokenVerifierService {

    // 🔥 ĐỔI CLIENT ID CỦA BẠN
    private static final String CLIENT_ID =
            "239106531712-f1if0c9rnbcnimm30vbumnj7cr6abk0b.apps.googleusercontent.com";

    public GoogleIdToken.Payload verify(String token) {

        try {
            GoogleIdTokenVerifier verifier =
                    new GoogleIdTokenVerifier.Builder(
                            new com.google.api.client.http.javanet.NetHttpTransport(),
                            JacksonFactory.getDefaultInstance()
                    )
                            .setAudience(Collections.singletonList(CLIENT_ID))
                            .build();

            GoogleIdToken idToken = verifier.verify(token);

            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }

            return idToken.getPayload();

        } catch (Exception e) {
            throw new RuntimeException("Google token verify failed");
        }
    }
}
