import React, { useState } from 'react';
import './YouTubeEmbed.css';

// 클릭 전에는 썸네일만 노출하고, 클릭 시 iframe(자동재생)으로 교체하는 경량 파사드 방식
function YouTubeEmbed({ videoId, title = 'YouTube 영상' }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const fallback = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="yt-embed">
      {playing ? (
        <iframe
          className="yt-embed-frame"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button type="button" className="yt-embed-poster" onClick={() => setPlaying(true)} aria-label={`${title} 재생`}>
          <img
            src={thumb}
            alt={title}
            loading="lazy"
            onError={(e) => { if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback; }}
          />
          <span className="yt-embed-play" aria-hidden="true">
            <svg viewBox="0 0 68 48" width="68" height="48">
              <path className="yt-embed-play-bg" d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" />
              <path d="M45 24 27 14v20" fill="#fff" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

export default YouTubeEmbed;
