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

  const handleGenerate = async () => {
    if (!query) return;
    setResult(<p style={{ color: "#555" }}>Загрузка...</p>);

    let refinedQuery = query;
    if (tab === "photo") {
      if (color) refinedQuery += ` ${color}`;
      if (style) refinedQuery += ` ${style}`;
      if (format) refinedQuery += ` ${format}`;
      const res = await fetch(`https://api.unsplash.com/photos/random?query=${refinedQuery}&client_id=8cpeaCQVAas_R9dj2jFSjvr4mNdUkLBScIAgD42MA40`);
      const data = await res.json();
      setResult(
        <img
          src={data.urls.regular}
          alt="Generated"
          style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)", maxWidth: "100%" }}
        />
      );
    } else {
      if (tone) refinedQuery += ` ${tone}`;
      if (videoType) refinedQuery += ` ${videoType}`;
      const randomPage = Math.floor(Math.random() * 5) + 1;
      const res = await fetch(`https://api.pexels.com/videos/search?query=${refinedQuery}&per_page=15&page=${randomPage}`, {
        headers: { Authorization: "EEIgUvHI3PaFPjWgujahHCfbhYDg0L1PRJA3P0Owf9DfOHDTSvBlLds0" }
      });
      const data = await res.json();

      // 🎯 Фильтр по длительности с границами 1–10, 11–19, 20+
      let filteredVideos = data.videos;
      if (duration === "short") {
        filteredVideos = filteredVideos.filter(v => v.duration >= 1 && v.duration <= 10);
      } else if (duration === "medium") {
        filteredVideos = filteredVideos.filter(v => v.duration >= 11 && v.duration <= 19);
      } else if (duration === "long") {
        filteredVideos = filteredVideos.filter(v => v.duration >= 20);
      }

      if (filteredVideos.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredVideos.length);
        const randomVideo = filteredVideos[randomIndex];
        setResult(
          <video controls style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)", maxWidth: "100%" }}>
            <source src={randomVideo.video_files[0].link} type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>
        );
      } else {
        setResult(<p style={{ color: "red" }}>Видео с такой длительностью не найдено.</p>);
      }
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f0f4f8", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ color: "#1d4ed8" }}>
        Генерация {tab === "photo" ? "фото" : "видео"}
      </h1>

      <div>
        <button onClick={() => setTab("photo")} style={{
          backgroundColor: tab === "photo" ? "#1d4ed8" : "#fff",
          color: tab === "photo" ? "#fff" : "#1d4ed8",
          border: "1px solid #1d4ed8",
          padding: "10px",
          borderRadius: "5px 0 0 5px"
        }}>
          Фото
        </button>
        <button onClick={() => setTab("video")} style={{
          backgroundColor: tab === "video" ? "#1d4ed8" : "#fff",
          color: tab === "video" ? "#fff" : "#1d4ed8",
          border: "1px solid #1d4ed8",
          padding: "10px",
          borderRadius: "0 5px 5px 0"
        }}>
          Видео
        </button>
      </div>

      <div style={{ marginTop: "15px" }}>
        <input
          type="text"
          placeholder="Введите основной запрос..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "300px", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      </div>

      {tab === "photo" && (
        <>
          <div style={{ marginTop: "10px" }}>
            <select value={color} onChange={(e) => setColor(e.target.value)} style={{ padding: "8px", borderRadius: "5px", width: "300px" }}>
              <option value="">Выберите цвет</option>
              <option value="red">Красный</option>
              <option value="blue">Синий</option>
              <option value="green">Зелёный</option>
              <option value="black and white">Чёрно-белый</option>
              <option value="yellow">Жёлтый</option>
              <option value="purple">Фиолетовый</option>
            </select>
          </div>
          <div style={{ marginTop: "10px" }}>
            <select value={style} onChange={(e) => setStyle(e.target.value)} style={{ padding: "8px", borderRadius: "5px", width: "300px" }}>
              <option value="">Выберите стиль</option>
              <option value="realism">Реализм</option>
              <option value="cartoon">Мультяшный</option>
              <option value="watercolor">Акварель</option>
              <option value="minimalist">Минимализм</option>
              <option value="sketch">Скетч</option>
              <option value="abstract">Абстракция</option>
            </select>
          </div>
          <div style={{ marginTop: "10px" }}>
            <select value={format} onChange={(e) => setFormat(e.target.value)} style={{ padding: "8px", borderRadius: "5px", width: "300px" }}>
              <option value="">Выберите формат</option>
              <option value="square">Квадрат</option>
              <option value="portrait">Портрет</option>
              <option value="landscape">Пейзаж</option>
              <option value="panorama">Панорама</option>
            </select>
          </div>
        </>
      )}

      {tab === "video" && (
        <>
          <div style={{ marginTop: "10px" }}>
            <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ padding: "8px", borderRadius: "5px", width: "300px" }}>
              <option value="">Выберите цветовую гамму</option>
              <option value="warm">Тёплые</option>
              <option value="cool">Холодные</option>
              <option value="black and white">Чёрно-белые</option>
              <option value="bright">Яркие</option>
              <option value="pastel">Пастельные</option>
            </select>
          </div>
          <div style={{ marginTop: "10px" }}>
            <select value={videoType} onChange={(e) => setVideoType(e.target.value)} style={{ padding: "8px", borderRadius: "5px", width: "300px" }}>
              <option value="">Выберите тип видео</option>
              <option value="nature">Природа</option>
              <option value="city">Город</option>
              <option value="people">Люди</option>
              <option value="abstract">Абстракция</option>
              <option value="animals">Животные</option>
              <option value="sports">Спорт</option>
              <option value="technology">Технологии</option>
            </select>
          </div>
          <div style={{ marginTop: "10px" }}>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} style={{ padding: "8px", borderRadius: "5px", width: "300px" }}>
              <option value="">Выберите продолжительность</option>
              <option value="short">Короткое (1–10 сек)</option>
              <option value="medium">Среднее (11–19 сек)</option>
              <option value="long">Длинное (20+ сек)</option>
            </select>
          </div>
        </>
      )}

      <div style={{ marginTop: "15px" }}>
        <button onClick={handleGenerate} style={{
          backgroundColor: "#1d4ed8",
          color: "#fff",
          padding: "10px 15px",
          borderRadius: "5px",
          border: "none"
        }}>
          Сгенерировать
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {result}
      </div>
    </div>
  );
}

export default App;
