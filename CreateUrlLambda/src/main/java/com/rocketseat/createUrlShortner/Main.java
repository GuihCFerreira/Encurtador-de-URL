package com.rocketseat.createUrlShortner;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

public class Main implements RequestHandler <Map<String, Object>, Map<String, Object>>{

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final S3Client s3Client = S3Client.builder().build();
    private final Map<String, String> errorMessage = new HashMap<>();
    private final Map<String, Object> response = new HashMap<>();

    @Override
    public Map<String, Object> handleRequest(Map<String, Object> input, Context context) {

        String body = (String) input.get("body");

        Map<String, String> bodyMap;
        try {
            bodyMap = objectMapper.readValue(body, Map.class);
        }catch (Exception exception) {
//            throw new RuntimeException("Error parsing JSON body: " + exception.getMessage(), exception);
            response.put("statusCode", 400);
            errorMessage.put("message", "Error parsing JSON body: " + exception.getMessage());
            response.put("body", errorMessage);
            return response;
        }

        String originalUrl = bodyMap.get("originalUrl");
        String expirationTime = bodyMap.get("expirationTime");
        long expirationTimeInSeconds = Long.parseLong(expirationTime);

        String shortUrlCode = UUID.randomUUID().toString().substring(0,8);

        UrlData urlData = new UrlData(originalUrl, expirationTimeInSeconds);

        try {

            String urlDataJson = objectMapper.writeValueAsString(urlData);

            PutObjectRequest request = PutObjectRequest.builder()
                .bucket("url-shortener-storage-lambda-guih-05-11")
                .key(shortUrlCode + ".json")
                .build();

            s3Client.putObject(request, RequestBody.fromString(urlDataJson));

        }catch (Exception exception) {
            //throw new RuntimeException("Error saving data to S3: " + exception.getMessage(), exception);
            response.put("statusCode", 500);
            errorMessage.put("message", "Error saving data to S3: " + exception.getMessage());
            response.put("body", errorMessage);
            return response;
        }

        response.put("code", shortUrlCode);

        return response;
    }
}