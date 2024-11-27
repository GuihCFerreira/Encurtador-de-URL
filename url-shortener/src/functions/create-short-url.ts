import { CreateShortURLRequest } from "@/model/short-url-request";
import { ShortUrlResponse } from "@/model/short-url-response";

export async function createShortUrl(request: CreateShortURLRequest): Promise<ShortUrlResponse> {
    return await fetch(`${import.meta.env.VITE_BASE_API_URL}/create` , {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    }).then((response) => response.json());
}