package org.example.case_study_module_6.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleTokenVerifierService {
    private static final String CLIENT_ID =
            "239106531712-f1if0c9rnbcnimm30vbumnj7cr6abk0b.apps.googleusercontent.com";

    public GoogleIdToken.Payload verify(String token) throws Exception {

        System.out.println("VERIFY GOOGLE TOKEN...");
        System.out.println("CLIENT_ID = " + CLIENT_ID);

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                new JacksonFactory()
        )
                .setAudience(Collections.singletonList(CLIENT_ID))
                .build();

        GoogleIdToken idToken = verifier.verify(token);
        if (idToken == null) {
            System.out.println("GOOGLE TOKEN VERIFY FAILED");
            throw new RuntimeException("Invalid Google token");
        }

        return idToken.getPayload();
    }
}
