export const prerender = false;

const apiKey = import.meta.env.OPENWEATHER_API_KEY;

export async function GET({ url }) {
  try {
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Weather API key is not configured."
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const city = url.searchParams.get("city");
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");

    let apiUrl = "";

    if (city) {
      apiUrl =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?q=${encodeURIComponent(city)}` +
        `&appid=${apiKey}` +
        `&units=metric`;
    } else if (lat && lon) {
      apiUrl =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?lat=${lat}` +
        `&lon=${lon}` +
        `&appid=${apiKey}` +
        `&units=metric`;
    } else {
      return new Response(
        JSON.stringify({
          error: "City or location is required."
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: data.message || "Unable to get weather."
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error("Weather API error:", error);

    return new Response(
      JSON.stringify({
        error: "Weather service is currently unavailable."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}