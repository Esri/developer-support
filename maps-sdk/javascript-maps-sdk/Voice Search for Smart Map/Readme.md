# Voice Search for Smart Map

**Voice Search for Smart Map** is a single‑page web application that helps users discover nearby places in **Charlotte, North Carolina** using an interactive map enhanced with **voice commands**, **live weather data**, and **smart time‑based recommendations**.

The app integrates the **ArcGIS Maps SDK for JavaScript**, **Calcite Design System**, and the **Web Speech API** to create an intuitive, hands‑free map exploration experience.

---

## Features

### 🗺️ Interactive Smart Map
- Built with **ArcGIS Maps SDK for JavaScript (v5 components)**
- Centered on **Charlotte, NC**
- Pan and zoom support
- Multiple basemap options

### 📍 Place Search by Category
Users can search for nearby locations by selecting a category:
- Parks & Outdoors
- Coffee Shops
- Gas Stations
- Food
- Hotels

Search results update automatically when:
- The map becomes stationary
- A new category is selected
- A voice command is used

### 🎤 Voice Search
Hands‑free searching using natural speech:
- “Find coffee”
- “Show parks”
- “I want food”
- “Find a hotel”

Spoken keywords are intelligently mapped to supported place categories.

### 🌦️ Live Weather Information
Each location popup includes:
- Current temperature (°C)
- Wind speed
- Weather condition
- Local time
- 3‑hour temperature forecast

Weather data is powered by **Open‑Meteo**.

### 🎯 Smart Time‑Based Recommendations
Locations may display **“🌟 Recommended now!”** depending on the time of day:
- Morning → Coffee shops
- Midday / Evening → Food
- Afternoon → Parks & Outdoors

### 🎨 Temperature‑Aware Map Symbols
Markers automatically change color based on temperature:
- 🔵 Cool


<img width="1409" height="747" alt="Screenshot 2026-02-24 123105" src="https://github.com/user-attachments/assets/c05f97c1-ec59-4605-8d48-927f3b3f0491" />
