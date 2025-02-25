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
exports.getWeatherByCoordinates = exports.getWeatherByCity = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast/daily";
const getWeatherByCity = (city_1, ...args_1) => __awaiter(void 0, [city_1, ...args_1], void 0, function* (city, days = 7) {
    try {
        const response = yield axios_1.default.get(BASE_URL, {
            params: {
                q: city,
                cnt: days,
                appid: API_KEY,
                units: "metric",
                lang: "pt"
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Erro ao buscar dados:", error);
        return null;
    }
});
exports.getWeatherByCity = getWeatherByCity;
const getWeatherByCoordinates = (lat_1, lon_1, ...args_1) => __awaiter(void 0, [lat_1, lon_1, ...args_1], void 0, function* (lat, lon, days = 7) {
    try {
        const response = yield axios_1.default.get(BASE_URL, {
            params: {
                lat: lat,
                lon: lon,
                cnt: days,
                appid: API_KEY,
                units: "metric",
                lang: "pt"
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Erro ao buscar dados:", error);
        return null;
    }
});
exports.getWeatherByCoordinates = getWeatherByCoordinates;
