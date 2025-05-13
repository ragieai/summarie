import { Ragie } from "ragie"

export function getRagie() {
    return new Ragie({
        auth: process.env.RAGIE_API_KEY,
        serverURL: process.env.RAGIE_BASE_URL,
      });
}