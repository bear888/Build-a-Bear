# Build-a-Bear
Build-A-Bear is an open-source web app for creating custom 3D friends. Using Three.js and simple HTML, users customize fur, outfits, and features in real-time. With dynamic rendering and GLTF support, it’s a great project for learning WebGL and state management. Let's make the web cuddly! 🧸
## Features
- **3D Bear Customization**: Customize fur color, body proportions, hair styles, and eye styles
- **Interactive Animations**: Wave, dance, and idle animations with keyboard shortcuts
- **Play Features**: Pet and surprise interactions with sound effects
- **Save/Load**: Export and import custom bears as GLTF files
- **Presets**: Quick-start with Teddy, Panda, and Unicorn presets
- **Responsive Design**: Works on desktop and mobile devices
- **Performance Optimized**: Cross-browser compatible with mobile optimizations

## How to Use
1. Open `index.html` in a modern web browser
2. Use the customization panel to change your bear's appearance
3. Try different animations with the animation buttons or keyboard shortcuts:
   - W: Wave animation
   - D: Dance animation
   - I: Idle animation
   - P: Pet interaction
   - Ctrl+S: Save bear
   - Ctrl+R: Reset bear
4. Save your creation as a GLTF file or load existing bears
5. Try the preset configurations for quick customization

## Technical Details
- Built with Three.js for 3D rendering
- Modular Bear class for easy customization
- GLTF export/import for model persistence
- Web Audio API for sound effects
- Responsive CSS with mobile optimizations
- Cross-browser compatibility checks

## Development
To run locally:
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.

## Browser Support
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

Requires WebGL support.