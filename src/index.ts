import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { geocodeCity, getDailyWeatherByDate, formatWeatherSummary } from "./openmeteo.js";

const server = new McpServer({
    name: "mcp-weather-server",
    version: "1.0.0"
});

// Basit sağlık kontrolü aracı
server.registerTool(
    "health_check",
    {
        title: "Health Check",
        description: "Sunucunun çalıştığını doğrular",
        inputSchema: {}
    },
    async () => {
        return { content: [{ type: "text", text: "OK" }] };
    }
);

// Hava durumu: şehir, ülke (opsiyonel), tarih(YYYY-MM-DD)
server.registerTool(
    "get_weather_by_date",
    {
        title: "Günlük hava durumu (tarihe göre)",
        description: "Belirli bir şehir ve tarih için günlük özet döndürür",
        inputSchema: {
            city: z.string().describe("Şehir adı. Örn: İstanbul"),
            country: z.string().optional().describe("Ülke kodu ya da adı. Örn: TR"),
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Tarih YYYY-MM-DD")
        }
    },
    async ({ city, country, date }) => {
        console.log('\n🌤️ **MCP Server Tool Call Başlıyor**');
        console.log('   City:', city);
        console.log('   Country:', country || 'Belirtilmemiş');
        console.log('   Date:', date);

        console.log('\n🔍 **Geocoding Süreci**');
        const geo = await geocodeCity(city, country);
        console.log('   Geocoding sonucu:');
        console.log('     Latitude:', geo.latitude);
        console.log('     Longitude:', geo.longitude);
        console.log('     Name:', geo.name);
        console.log('     Country:', geo.country || 'Belirtilmemiş');

        console.log('\n🌡️ **Weather API Çağrısı**');
        const weather = await getDailyWeatherByDate(geo.latitude, geo.longitude, date);
        console.log('   Weather API sonucu:');
        console.log('     Max Temp:', weather.daily.temperature_2m_max[0], '°C');
        console.log('     Min Temp:', weather.daily.temperature_2m_min[0], '°C');
        console.log('     Precipitation:', weather.daily.precipitation_sum[0], 'mm');
        console.log('     Weather Code:', weather.daily.weather_code[0]);

        console.log('\n📝 **Response Formatting**');
        const text = formatWeatherSummary(geo.name, date, weather);
        console.log('   Formatted response:', text);

        console.log('✅ MCP Server tool call tamamlandı\n');

        return { content: [{ type: "text", text }] };
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
}); 