"use client";

import React, { useState, useEffect } from 'react';
import { Zap, Battery, Settings, Check, Info } from 'lucide-react';

// ============================================================
// 1. ESTRUCTURA DE DATOS BASE
// ============================================================
// IMPORTANTE: las imágenes se cargan desde /public/cars/
// Descárgalas de https://press.lynkco.com/en-WW/assets/
// y guárdalas con este naming exacto:
//   /public/cars/{modelId}-{colorId}.jpg
// Ej: /public/cars/02-red.jpg, /public/cars/01-black.jpg
//
// Si falta la foto de un color concreto, el componente cae
// automáticamente en la foto base (colorId "black") de ese
// modelo, así que nunca se rompe el layout aunque aún no
// hayas subido todas las combinaciones.

const carData = {
  "01": {
    id: "01",
    name: "Lynk & Co 01",
    type: "PHEV",
    hp: "276 CV",
    range: { Core: "75 km", More: "75 km" },
    colors: [
      { id: "black", name: "Ionic Black", hex: "#0b0b0d", price: 0 },
      { id: "white", name: "Crystal White", hex: "#f2f2f0", price: 1000 },
      { id: "grey", name: "Cosmic Grey", hex: "#5a5c60", price: 1000 },
      { id: "orange", name: "Sunrise Orange", hex: "#c9531f", price: 1000 },
    ],
    trims: {
      Core: {
        price: 40995,
        features: ["Llantas de aleación estándar", "Audio de serie", "Techo panorámico", "ADAS Nivel 2"]
      },
      More: {
        price: 44995,
        features: ["Llantas deportivas de mayor diámetro", "Sistema de sonido premium", "Detalles estéticos exclusivos exteriores e interiores"]
      }
    }
  },
  "02": {
    id: "02",
    name: "Lynk & Co 02",
    type: "BEV 100% Eléctrico",
    hp: "272 CV",
    range: { Core: "435 km", More: "445 km" },
    colors: [
      { id: "black", name: "Eclipse Black", hex: "#111113", price: 0 },
      { id: "white", name: "Moon White", hex: "#f4f4f4", price: 1000 },
      { id: "blue", name: "Sapphire Blue", hex: "#1e3a8a", price: 1000 },
      { id: "red", name: "Lava Red", hex: "#a31f26", price: 1000 },
    ],
    trims: {
      Core: {
        price: 35495,
        features: ["Cargador de a bordo de 11 kW", "Llantas de 19 pulgadas", "Cámara trasera de aparcamiento"]
      },
      More: {
        price: 39495,
        features: ["Sonido Harman Kardon 14 altavoces", "Cargador interno de 22 kW", "Techo solar panorámico", "Cámara de visión 360º", "Puertas sin marco"]
      }
    }
  },
  "08": {
    id: "08",
    name: "Lynk & Co 08",
    type: "PHEV",
    hp: "Híbrido Avanzado",
    range: { Core: "200 km", More: "200 km" },
    colors: [
      { id: "black", name: "Black Ocean", hex: "#0c0c10", price: 0 },
      { id: "beige", name: "Sahara Dune", hex: "#9c8062", price: 1000 },
      { id: "blue", name: "Deep Blue", hex: "#1c2d4a", price: 1000 },
      { id: "white", name: "Crystal White", hex: "#f2f2f0", price: 1000 },
    ],
    trims: {
      Core: {
        price: 47400,
        features: ["Interior oscuro Black Ocean", "Sistema de audio de 8 altavoces", "Llantas de 19 pulgadas", "Faros LED estándar"]
      },
      More: {
        price: 51000,
        features: ["Faros LED-Matrix con iluminación en curva", "Llantas de 21 pulgadas", "Audio Harman Kardon 23 altavoces", "Interior Sahara Dune", "Colores de carrocería exclusivos"]
      }
    }
  }
};

// ============================================================
// 2. COMPONENTE DE IMAGEN CON FALLBACK
// ============================================================
// Intenta cargar /cars/{model}-{colorId}.jpg. Si esa combinación
// no existe todavía (404), cae a /cars/{model}-black.jpg.
function CarPhoto({ model, colorId }) {
  const primarySrc = `/cars/${model}-${colorId}.jpg`;
  const fallbackSrc = `/cars/${model}-black.jpg`;
  const [src, setSrc] = useState(primarySrc);

  // Si cambia el modelo o el color, reintenta con la ruta primaria
  useEffect(() => {
    setSrc(primarySrc);
  }, [primarySrc]);

  return (
    <img
      key={primarySrc}
      src={src}
      alt={`Lynk & Co ${model}`}
      onError={() => {
        if (src !== fallbackSrc) setSrc(fallbackSrc);
      }}
      className="w-full h-full object-contain drop-shadow-2xl transition-opacity duration-300"
    />
  );
}

// ============================================================
// 3. COMPONENTE PRINCIPAL
// ============================================================
export default function LynkCoConfigurator() {
  const [model, setModel] = useState("02");
  const [trim, setTrim] = useState("Core");
  const [colorId, setColorId] = useState("black");
  const [hasTow, setHasTow] = useState(false);

  const currentCar = carData[model];
  const currentTrimData = currentCar.trims[trim];
  const selectedColorData = currentCar.colors.find(c => c.id === colorId) || currentCar.colors[0];

  const basePrice = currentTrimData.price;
  const colorPrice = selectedColorData.price;
  const towPrice = hasTow ? 1040 : 0;
  const totalPrice = basePrice + colorPrice + towPrice;

  const formatPrice = (price) => new Intl.NumberFormat('es-ES').format(price) + " €";

  // Al cambiar de modelo: reset trim/extras y color base de ESE modelo
  useEffect(() => {
    setTrim("Core");
    setHasTow(false);
    setColorId(carData[model].colors[0].id);
  }, [model]);

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-white font-sans overflow-hidden">

      {/* BARRA SUPERIOR */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-[#30363d] bg-[#161b22] shrink-0">
        <div className="text-xl font-bold tracking-widest text-[#58a6ff]">LYNK & CO</div>
        <div className="flex space-x-2">
          {Object.keys(carData).map(m => (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                model === m ? "bg-[#58a6ff] text-[#0d1117]" : "bg-transparent text-gray-400 hover:text-white"
              }`}
            >
              Modelo {m}
            </button>
          ))}
        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <div className="flex flex-1 overflow-hidden">

        {/* PANEL IZQUIERDO: Visualizador */}
        <div className="w-2/3 relative flex flex-col p-8 justify-between">
          <div className="z-20">
            <h1 className="text-6xl font-bold mb-2">{currentCar.name}</h1>
            <p className="text-gray-400 text-xl">{currentCar.type}</p>
          </div>

          <div className="relative flex-1 flex items-center justify-center px-6 py-4">
            <div className="w-full h-full max-w-3xl">
              <CarPhoto model={model} colorId={colorId} />
            </div>
          </div>

          {/* Tarjeta de Especificaciones */}
          <div className="z-20 grid grid-cols-3 gap-6 bg-[#161b22]/80 backdrop-blur-md border border-[#30363d] rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <Battery className="text-[#58a6ff] w-8 h-8 shrink-0" />
              <div>
                <p className="text-gray-400 text-sm">Autonomía</p>
                <p className="text-2xl font-semibold">{currentCar.range[trim]}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Zap className="text-[#58a6ff] w-8 h-8 shrink-0" />
              <div>
                <p className="text-gray-400 text-sm">Potencia</p>
                <p className="text-2xl font-semibold">{currentCar.hp}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Settings className="text-[#58a6ff] w-8 h-8 shrink-0" />
              <div>
                <p className="text-gray-400 text-sm">Motorización</p>
                <p className="text-lg font-semibold">{currentCar.type.split(" ")[0]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: Configurador */}
        <div className="w-1/3 bg-[#161b22] border-l border-[#30363d] flex flex-col relative">

          <div className="flex-1 overflow-y-auto p-8 pb-32">

            {/* Toggle Trim */}
            <div className="mb-10">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Acabado</h3>
              <div className="flex bg-[#0d1117] p-1 rounded-lg">
                {["Core", "More"].map(t => (
                  <button
                    key={t}
                    onClick={() => setTrim(t)}
                    className={`flex-1 py-3 text-center rounded-md font-medium transition-all duration-300 ${
                      trim === t ? "bg-[#21262d] text-white shadow-md" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipamiento Dinámico */}
            <div className="mb-10">
              <div className="flex items-center space-x-2 mb-4">
                <Info className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm uppercase tracking-wider text-gray-400">Incluido en {trim}</h3>
              </div>
              <ul className="space-y-3">
                {currentTrimData.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm text-gray-300 bg-[#21262d]/50 p-3 rounded-lg">
                    <Check className="w-5 h-5 text-green-400 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Selector de Color — paleta propia del modelo */}
            <div className="mb-10">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Color Exterior</h3>
              <div className="flex space-x-4">
                {currentCar.colors.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setColorId(c.id)}
                    title={`${c.name} (+${c.price}€)`}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                      colorId === c.id ? "border-[#58a6ff] scale-110 shadow-[0_0_15px_rgba(88,166,255,0.4)]" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
              <p className="text-sm mt-3 text-gray-400">
                {selectedColorData.name} {selectedColorData.price > 0 && <span className="text-[#58a6ff]">(+{formatPrice(selectedColorData.price)})</span>}
              </p>
            </div>

            {/* Extras */}
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Accesorios y Extras</h3>
              <label className="flex items-center justify-between p-4 bg-[#0d1117] border border-[#30363d] rounded-xl cursor-pointer hover:border-[#58a6ff] transition-colors">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={hasTow}
                    onChange={(e) => setHasTow(e.target.checked)}
                    className="w-5 h-5 accent-[#58a6ff] rounded bg-gray-700 border-gray-600"
                  />
                  <span className="font-medium text-gray-200">Bola de Remolque</span>
                </div>
                <span className="text-sm text-[#58a6ff]">+1.040 €</span>
              </label>
            </div>

          </div>

          {/* Pie Fijo: Calculadora en Tiempo Real */}
          <div className="absolute bottom-0 left-0 w-full p-6 bg-[#161b22] border-t border-[#30363d] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-end mb-2">
              <span className="text-gray-400 font-medium">Precio Final (PVP)</span>
              <span className="text-3xl font-bold text-white transition-all duration-300">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <div className="flex justify-between text-xs text-gray-500 border-t border-[#30363d] pt-2 mt-2">
              <span>Base: {formatPrice(basePrice)}</span>
              {(colorPrice > 0 || towPrice > 0) && (
                <span>Extras: {formatPrice(colorPrice + towPrice)}</span>
              )}
            </div>

            <button className="w-full mt-4 bg-[#58a6ff] hover:bg-[#4a8fe0] text-gray-900 font-bold py-4 rounded-xl transition-colors">
              Guardar Configuración
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
