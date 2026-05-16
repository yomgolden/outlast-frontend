import { useNavigate } from "react-router-dom";

export default function ProfileBar({ user }) {
const navigate = useNavigate();

return (
<>
<style>{`
@import url(‘https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Space+Mono:wght@400;700&display=swap’);

```
    .profile-bar {
      font-family: 'Rajdhani', sans-serif;
      margin-bottom: 16px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      border-radius: 14px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(120deg, #080e1f 0%, #0b1428 60%, #0a1220 100%);
      border: 1px solid rgba(99, 160, 255, 0.12);
      box-shadow:
        0 2px 0 rgba(99,160,255,0.06) inset,
        0 8px 32px rgba(0,0,0,0.5),
        0 1px 0 rgba(255,255,255,0.03) inset;
      transition: border-color 0.25s, box-shadow 0.25s;
    }

    .profile-bar:hover {
      border-color: rgba(99, 160, 255, 0.28);
      box-shadow:
        0 2px 0 rgba(99,160,255,0.08) inset,
        0 12px 40px rgba(59,130,246,0.12),
        0 1px 0 rgba(255,255,255,0.04) inset;
    }

    .profile-bar::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(99,160,255,0.4), transparent);
    }

    .profile-bar::after {
      content: '';
      position: absolute;
      top: -60px; right: -40px;
      width: 140px; height: 140px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .pb-avatar-wrap {
      position: relative;
      flex-shrink: 0;
    }

    .pb-avatar {
      width: 46px;
      height: 46px;
      border-radius: 10px;
      object-fit: cover;
      display: block;
      border: 1.5px solid rgba(99,160,255,0.2);
      box-shadow: 0 0 16px rgba(59,130,246,0.15);
    }

    .pb-avatar-placeholder {
      width: 46px;
      height: 46px;
      border-radius: 10px;
      background: linear-gradient(135deg, rgba(30,60,120,0.8), rgba(20,40,90,0.8));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      color: rgba(99,160,255,0.9);
      border: 1.5px solid rgba(99,160,255,0.2);
      font-family: 'Rajdhani', sans-serif;
    }

    .pb-online {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #22d3a5;
      border: 2px solid #080e1f;
      box-shadow: 0 0 6px rgba(34,211,165,0.7);
    }

    .pb-info {
      flex: 1;
      min-width: 0;
    }

    .pb-name {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 17px;
      color: #e8f0ff;
      letter-spacing: 0.5px;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pb-handle {
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      color: rgba(99,160,255,0.5);
      margin-top: 2px;
      letter-spacing: 0.3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pb-gold {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 6px 12px;
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(30,20,5,0.9), rgba(40,25,5,0.9));
      border: 1px solid rgba(251,191,36,0.2);
      box-shadow:
        0 0 16px rgba(251,191,36,0.06),
        0 1px 0 rgba(255,215,100,0.08) inset;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }

    .pb-gold::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(251,191,36,0.3), transparent);
    }

    .pb-gold-icon {
      font-size: 15px;
      line-height: 1;
      filter: drop-shadow(0 0 4px rgba(251,191,36,0.4));
    }

    .pb-gold-value {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 15px;
      color: #fbbf24;
      letter-spacing: 0.5px;
      text-shadow: 0 0 12px rgba(251,191,36,0.3);
    }

    .pb-divider {
      width: 1px;
      height: 28px;
      background: linear-gradient(to bottom, transparent, rgba(99,160,255,0.15), transparent);
      flex-shrink: 0;
    }
  `}</style>

  <div
    className="profile-bar"
    onClick={() => navigate("/profile")}
  >
    {/* AVATAR */}
    <div className="pb-avatar-wrap">
      {user?.photoUrl ? (
        <img
          src={user.photoUrl}
          alt={user.username}
          className="pb-avatar"
        />
      ) : (
        <div className="pb-avatar-placeholder">
          {(user?.username || "?")[0].toUpperCase()}
        </div>
      )}
      <div className="pb-online" />
    </div>

    {/* NAME + HANDLE */}
    <div className="pb-info">
      <div className="pb-name">{user?.firstName || "Survivor"}</div>
      <div className="pb-handle">@{user?.username || "username"}</div>
    </div>

    {/* DIVIDER */}
    <div className="pb-divider" />

    {/* GOLD */}
    <div className="pb-gold">
      <span className="pb-gold-icon">🪙</span>
      <span className="pb-gold-value">{(user?.gold || 0).toLocaleString()}</span>
    </div>
  </div>
</>
```

);
}
