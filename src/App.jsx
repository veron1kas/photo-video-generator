import React, { useState } from "react";

function App() {
  const [tab, setTab] = useState("photo");
  const [query, setQuery] = useState("");
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");
  const [format, setFormat] = useState("");
  const [tone, setTone] = useState("");
  const [videoType, setVideoType] = useState("");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Перевод текста на английский
  const translateText = async (text) => {
    try {
      const res = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        body: JSON.stringify({
          q: text,
          source: "auto",
          target: "en",
          format: "text",
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      return data.translatedText;
    } catch (error) {
      console.error("Ошибка перевода:", error);
      return text; // если перевод не сработал, отправляем оригинал
    }
  };

  const handleGenerate = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);

    // 🔥 Переводим запрос
    let refinedQuery = await translateText(query);

    if (tab === "photo") {
      if (color) refinedQuery += ` ${color}`;
      if (style) refinedQuery += ` ${style}`;
      if (format) refinedQuery += ` ${format}`;
      const res = await fetch(
        `https://api.unsplash.com/photos/random?query=${refinedQuery}&client_id=8cpeaCQVAas_R9dj2jFSjvr4mNdUkLBScIAgD42MA40`
      );
      const data = await res.json();
      setResult(
        <img
          src={data.urls.regular}
          alt="Generated"
          style={{
            borderRadius: "15px",
            boxShadow: darkMode ? "0 0 20px #000" : "0 0 20px #aaa",
            maxWidth: "100%",
            transition: "0.3s",
          }}
        />
      );
    } else {
      if (tone) refinedQuery += ` ${tone}`;
      if (videoType) refinedQuery += ` ${videoType}`;
      const randomPage = Math.floor(Math.random() * 5) + 1;
      const res = await fetch(
        `https://api.pexels.com/videos/search?query=${refinedQuery}&per_page=15&page=${randomPage}`,
        {
          headers: {
            Authorization: "EEIgUvHI3PaFPjWgujahHCfbhYDg0L1PRJA3P0Owf9DfOHDTSvBlLds0",
          },
        }
      );
      const data = await res.json();

      let filteredVideos = data.videos;
      if (duration === "short") {
        filteredVideos = filteredVideos.filter(
          (v) => v.duration >= 1 && v.duration <= 10
        );
      } else if (duration === "medium") {
        filteredVideos = filteredVideos.filter(
          (v) => v.duration >= 11 && v.duration <= 19
        );
      } else if (duration === "long") {
        filteredVideos = filteredVideos.filter((v) => v.duration >= 20);
      }

      if (filteredVideos.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredVideos.length);
        const randomVideo = filteredVideos[randomIndex];
        setResult(
          <video
            controls
            style={{
              borderRadius: "15px",
              boxShadow: darkMode ? "0 0 20px #000" : "0 0 20px #aaa",
              maxWidth: "100%",
              transition: "0.3s",
            }}
          >
            <source src={randomVideo.video_files[0].link} type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>
        );
      } else {
        setResult(
          <p style={{ color: "red" }}>⚠ Видео с такой длительностью не найдено.</p>
        );
      }
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: darkMode
          ? "linear-gradient(135deg, #000000, #1f1f1f, #2c2c2c)"
          : "linear-gradient(135deg, #dbeafe, #f0f4f8, #ffffff)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        color: darkMode ? "#f5f5f5" : "#1f1f1f",
        minHeight: "100vh",
        padding: "20px",
        transition: "0.3s",
      }}
    >
      {/* Шапка */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          padding: "10px 20px",
          background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
          borderRadius: "10px",
          color: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <h1 style={{ margin: 0 }}>📸 Генерация фото и видео</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            background: darkMode ? "#f0f4f8" : "#1f1f1f",
            color: darkMode ? "#1f1f1f" : "#f0f4f8",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {darkMode ? "🌞 Светлая" : "🌙 Тёмная"}
        </button>
      </header>

      {/* Переключатель фото/видео */}
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={() => setTab("photo")}
          style={{
            backgroundColor: tab === "photo" ? "#3b82f6" : "#e5e7eb",
            color: tab === "photo" ? "#fff" : "#1f2937",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px 0 0 5px",
            cursor: "pointer",
          }}
        >
          Фото
        </button>
        <button
          onClick={() => setTab("video")}
          style={{
            backgroundColor: tab === "video" ? "#3b82f6" : "#e5e7eb",
            color: tab === "video" ? "#fff" : "#1f2937",
            border: "none",
            padding: "10px 15px",
            borderRadius: "0 5px 5px 0",
            cursor: "pointer",
          }}
        >
          Видео
        </button>
      </div>

      {/* Поле ввода */}
      <input
        type="text"
        placeholder="🔎 Введите запрос (любой язык)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "300px",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
      />

      {/* Dropdown для фото */}
      {tab === "photo" && (
        <>
          {/* dropdown для фото */}
        </>
      )}

      {/* Dropdown для видео */}
      {tab === "video" && (
        <>
          {/* dropdown для видео */}
        </>
      )}

      {/* Кнопка */}
      <button
        onClick={handleGenerate}
        style={{
          background: "#3b82f6",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          marginTop: "15px",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          fontWeight: "bold",
        }}
      >
        🚀 Сгенерировать
      </button>

      {/* Загрузка или результат */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        {loading ? (
          <div style={{ fontSize: "1.2rem" }}>
            <div
              style={{
                border: "6px solid #f3f3f3",
                borderTop: "6px solid #3b82f6",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                animation: "spin 1s linear infinite",
                margin: "auto",
              }}
            />
            <p style={{ marginTop: "10px" }}>⏳ Перевод и загрузка...</p>
          </div>
        ) : (
          result
        )}
      </div>
    </div>
  );
}

export default App;
