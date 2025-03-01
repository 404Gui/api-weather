import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { log } from "console";
import { getWeatherByCity, getWeatherByCoordinates } from "./climaService";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: process.env.FRONTEND_URL
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/weather/city", async (req: Request, res: Response) => {
    const { city, days } = req.query;

    if (!city) {
        res.status(400).json({ error: "Nome da cidade é obrigatório" });
        return;
    }

    try {
        const numDays = days ? Number(days) : 7;

        if (isNaN(numDays)) {
            res.status(400).json({ error: "Número de dias inválido" });
            return;
        }

        const data = await getWeatherByCity(city.toString(), numDays);
        if (!data) {
            res.status(500).json({ error: "Erro ao buscar previsão" });
            return;
        }

        res.json({
            cidade: data.city.name,
            pais: data.city.country,
            timezone: data.city.timezone,
            previsao: data.list.map((dia: any) => ({
                data: dia.dt,
                temperatura: {
                    minima: dia.temp.min,
                    maxima: dia.temp.max,
                },
                sensacao: dia.feels_like.day,
                descricao: dia.weather[0].description,
                icone: dia.weather[0].icon,
                umidade: dia.humidity,
                vento: dia.speed,
                nascerDoSol: new Date(dia.sunrise * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                porDoSol: new Date(dia.sunset * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
            }))
        });
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

app.get("/weather/coordinates", async (req: Request, res: Response) => {
    const { lat, lon, days } = req.query;

    if (!lat || !lon) {
        res.status(400).json({ error: "Latitude e longitude são obrigatórias" });
        return;
    }

    try {
        const numDays = days ? Number(days) : 7;

        if (isNaN(numDays)) {
            res.status(400).json({ error: "Número de dias inválido" });
            return;
        }

        const latitude = parseFloat(lat.toString());
        const longitude = parseFloat(lon.toString());

        const data = await getWeatherByCoordinates(latitude, longitude, numDays);
        if (!data) {
            res.status(500).json({ error: "Erro ao buscar previsão" });
            return;
        }

        res.json({
            cidade: data.city.name,
            pais: data.city.country,
            timezone: data.city.timezone,
            previsao: data.list.map((dia: any) => ({
                data: dia.dt,
                temperatura: {
                    minima: dia.temp.min,
                    maxima: dia.temp.max,
                },
                sensacao: dia.feels_like.day,
                descricao: dia.weather[0].description,
                icone: dia.weather[0].icon,
                umidade: dia.humidity,
                vento: dia.speed,
                nascerDoSol: new Date(dia.sunrise * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                porDoSol: new Date(dia.sunset * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
            }))
        });
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

const getPlacesAutocomplete = async (req: Request, res: Response) => {
    try {
        const input = req.query.input as string;

        if (!input) {
            res.status(400).json({ error: "O parâmetro 'input' é obrigatório." });
            return;
        }

        const API_KEY = process.env.GOOGLE_API_KEY;
        const API_URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(cities)&key=${API_KEY}`;

        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.status !== "OK") {
            res.status(400).json({ error: "Erro ao buscar sugestões", details: data });
            return;
        }

        const suggestions = data.predictions.map((place: any) => ({
            name: place.description,
        }));

        res.json(suggestions);
        return;
    } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
        res.status(500).json({ error: "Erro ao buscar sugestões." });
        return;
    }
};

app.get("/places/autocomplete", getPlacesAutocomplete);



app.listen(PORT, () => {
    log(`Servidor ouvindo na porta ${PORT}`);
});