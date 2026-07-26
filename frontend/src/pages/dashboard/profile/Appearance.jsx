
import { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function Appearance() {
  const { theme, setTheme, colorPreset, setColorPreset, colorPresets, applyTheme } = useContext(ThemeContext);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('theme', theme)
    localStorage.setItem('colorPreset', colorPreset)
    applyTheme(theme, colorPreset)
    setSaved(true);
    setTimeout(() => setSaved(false), 1800 );
  };

  return (
    <div className="profile-tab appearance-page page-fade">
      <div className="appearance-hero">
        <div>
          <h2>Appearance Settings</h2>
          <p>Choose your theme and color palette to personalize the app. 🌈</p>
        </div>
        <div className="illustration">🎨</div>
      </div>

      <div className="appearance-content">
        <label>
          Theme preference:
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System (preferred color scheme)</option>
          </select>
        </label>

        <label>
          Accent color:
          <select value={colorPreset} onChange={e => setColorPreset(e.target.value)}>
            {Object.keys(colorPresets).map(key => (
              <option value={key} key={key}>{key}</option>
            ))}
          </select>
        </label>

        <div className="preset-preview">
          <span>Preview</span>
          <div style={{ backgroundColor: colorPresets[colorPreset] || colorPresets.teal }}></div>
        </div>

        <button className='ghost-btn' onClick={handleSave}>Save Appearance</button>
        {saved && <p className='hint'>Theme saved successfully! ✔</p>}
      </div>

      <div className="appearance-tips">
        <h3>Quick UX Tip</h3>
        <p>Use <strong>System</strong> to follow your OS dark/light preference automatically.</p>
      </div>
    </div>
  );
}

