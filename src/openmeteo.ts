import { z } from "zod";
import { fetch } from "undici";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export const GeocodeSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    name: z.string(),
    country: z.string().optional(),
    timezone: z.string().optional()
});

const GeocodeApiResponseSchema = z.object({
    results: z.array(GeocodeSchema).optional()
});

export type GeocodeResult = z.infer<typeof GeocodeSchema>;

export async function geocodeCity(query: string, country?: string): Promise<GeocodeResult> {
    console.log(`   🔍 Geocoding API çağrısı: "${query}"${country ? `, ${country}` : ''}`);

    const url = new URL(GEOCODING_URL);
    url.searchParams.set("name", query);
    url.searchParams.set("count", "1");
    url.searchParams.set("language", "tr");
    if (country) url.searchParams.set("country", country);

    console.log(`   📡 API URL: ${url.toString()}`);

    const res = await fetch(url, { headers: { "accept": "application/json" } });
    if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);

    const json = (await res.json()) as unknown;
    console.log(`   📥 API Response:`, JSON.stringify(json, null, 2));

    const parsed = GeocodeApiResponseSchema.safeParse(json);
    if (!parsed.success) throw new Error("Geocoding parse hatası");

    const first = parsed.data.results?.[0];
    if (!first) throw new Error("Şehir bulunamadı");

    console.log(`   ✅ Geocoding başarılı: ${first.name} (${first.latitude}, ${first.longitude})`);
    return first;
}

export async function getDailyWeatherByDate(lat: number, lon: number, dateISO: string) {
    console.log(`   🌡️ Weather API çağrısı: ${lat}, ${lon} tarih: ${dateISO}`);

    // Open-Meteo: daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code
    const url = new URL(WEATHER_URL);
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lon));
    url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code");
    url.searchParams.set("timezone", "Europe/Istanbul");
    url.searchParams.set("start_date", dateISO);
    url.searchParams.set("end_date", dateISO);

    console.log(`   📡 Weather API URL: ${url.toString()}`);

    const res = await fetch(url, { headers: { "accept": "application/json" } });
    if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);

    const data = await res.json();
    console.log(`   📥 Weather API Response:`, JSON.stringify(data, null, 2));

    console.log(`   ✅ Weather API başarılı: ${dateISO} tarihi için veri alındı`);
    return data as {
        daily: {
            time: string[];
            temperature_2m_max: number[];
            temperature_2m_min: number[];
            precipitation_sum: number[];
            weather_code: number[];
        };
    };
}

export function formatWeatherSummary(city: string, dateISO: string, payload: Awaited<ReturnType<typeof getDailyWeatherByDate>>) {
    const idx = 0;
    const d = payload.daily;
    const code = d.weather_code[idx];
    const summary = `Şehir: ${city}\nTarih: ${dateISO}\nEn yüksek: ${d.temperature_2m_max[idx]}°C\nEn düşük: ${d.temperature_2m_min[idx]}°C\nYağış toplamı: ${d.precipitation_sum[idx]} mm\nKod: ${code}`;
    return summary;
} 