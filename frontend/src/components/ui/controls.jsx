import { useState } from "react"

export function useControls() {
    const [cameraPos, setCameraPos] = useState(5)
    
    const Controls = () => (
      <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white' }}>
        <label>
          Camera Position:
          <input
            type="range"
            min="2"
            max="10"
            step="0.1"
            value={cameraPos}
            onChange={(e) => setCameraPos(parseFloat(e.target.value))}
          />
          {cameraPos.toFixed(1)}
        </label>
      </div>
    )
  
    return { cameraPos, Controls }
  }