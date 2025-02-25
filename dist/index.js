"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const console_1 = require("console");
const climaService_1 = require("./climaService");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3001"
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.get("/weather/city", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const data = yield (0, climaService_1.getWeatherByCity)(city.toString(), numDays);
        if (!data) {
            res.status(500).json({ error: "Erro ao buscar previsão" });
            return;
        }
        res.json({
            cidade: data.city.name,
            pais: data.city.country,
            timezone: data.city.timezone,
            previsao: data.list.map((dia) => ({
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
    }
    catch (error) {
        console.error("Erro ao buscar dados:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
}));
app.get("/weather/coordinates", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const data = yield (0, climaService_1.getWeatherByCoordinates)(latitude, longitude, numDays);
        if (!data) {
            res.status(500).json({ error: "Erro ao buscar previsão" });
            return;
        }
        res.json({
            cidade: data.city.name,
            pais: data.city.country,
            timezone: data.city.timezone,
            previsao: data.list.map((dia) => ({
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
    }
    catch (error) {
        console.error("Erro ao buscar dados:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
}));
app.listen(PORT, () => {
    (0, console_1.log)(`Servidor ouvindo na porta ${PORT}`);
});
