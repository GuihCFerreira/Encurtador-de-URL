package com.rocketseat.redirectUrlShortner;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class Main implements RequestHandler<Map<String, Object>, Map<String, Object>> {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final S3Client s3Client = S3Client.builder().build();
    private Map<String, Object> response = new HashMap<>();
    Map<String, String> errorMessage = new HashMap<>();

    @Override
    public Map<String, Object> handleRequest(Map<String, Object> input, Context context) {

        String pathParameters = (String) input.get("rawPath");
        String shortUrlCode = pathParameters.replace("/","");

        if (shortUrlCode == null || shortUrlCode.isEmpty()) {
            //throw new IllegalArgumentException("Invalid input: Short URL code is required");
            response.put("statusCode", 400);
            errorMessage.put("message", "Invalid input: Short URL code is required in URL Path");
            response.put("body", errorMessage);

            return response;
        }

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
            .bucket("url-shortener-storage-lambda-guih-05-11")
            .key(shortUrlCode + ".json")
            .build();

        InputStream s3objectStream;

        try {
            s3objectStream = s3Client.getObject(getObjectRequest);
        } catch (Exception exception) {
            //throw new RuntimeException("Error getting data from S3: " + exception.getMessage(), exception);
            response.put("statusCode", 404);
            errorMessage.put("message", "Error getting data from S3: " + exception.getMessage());
            response.put("body", errorMessage);

            return response;

        }

        UrlData urlData;
        try {
            urlData = objectMapper.readValue(s3objectStream, UrlData.class);
        } catch (Exception exception) {
            //throw new RuntimeException("Error parsing data from S3: " + exception.getMessage(), exception);
            response.put("statusCode", 500);
            errorMessage.put("message", "Error parsing data from S3: " + exception.getMessage());
            response.put("body", errorMessage);

            return response;
        }

        long currentTimeInSeconds = System.currentTimeMillis() / 1000;

        if(currentTimeInSeconds > urlData.getExpirationTime()){

            response.put("statusCode", 410);
            errorMessage.put("message",  "This URL has expired");
            response.put("body", errorMessage);

            return response;
        }

        response.put("statusCode", 302);
        Map<String, String> headers = new HashMap<>();
        headers.put("Location", urlData.getOriginalUrl());
        response.put("headers", headers);

        return response;
    }
}