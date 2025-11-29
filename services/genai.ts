
import { GoogleGenAI } from "@google/genai";

// Initialize the client
// Note: In a production frontend environment, use a proxy backend to hide the API KEY.
// Following instructions to use process.env.API_KEY directly.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface MapPlace {
  title: string;
  formattedAddress: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
  sourceUri?: string;
  rating?: string; // Sometimes inferred or simulated if not directly in grounding chunk
}

export async function searchRealWorldPlaces(query: string, userLat?: number, userLng?: number): Promise<MapPlace[]> {
  if (!apiKey) {
    console.warn("API Key not found for Google GenAI");
    return [];
  }

  try {
    const model = 'gemini-2.5-flash';
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    // If user location is available, bias the search results
    if (userLat && userLng) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLat,
            longitude: userLng
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents: `Find real-world places matching this query: "${query}". Prioritize music studios, art schools, performance venues, and artist agencies if relevant.`,
      config
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract map data from grounding chunks
    const places = chunks
      .map((chunk: any) => {
        if (chunk.maps) {
          const mapData = chunk.maps;
          return {
            title: mapData.title || "Unknown Place",
            formattedAddress: mapData.formattedAddress || "Address not available",
            latitude: mapData.point?.latitude,
            longitude: mapData.point?.longitude,
            placeId: mapData.placeId,
            sourceUri: mapData.googleMapsUri || mapData.uri
          } as MapPlace;
        }
        return null;
      })
      .filter((p: any): p is MapPlace => p !== null);

    // Deduplicate based on placeId or title
    const uniquePlaces = Array.from(new Map(places.map((item: any) => [item.title, item])).values());

    return uniquePlaces as MapPlace[];

  } catch (error) {
    console.error("Error searching places with GenAI:", error);
    return [];
  }
}
