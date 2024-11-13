import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import RINGS from 'vanta/dist/vanta.rings.min.js';
import CLOUDS2 from 'vanta/dist/vanta.clouds2.min.js';
import FOG from 'vanta/dist/vanta.fog.min.js';
import WAVES from 'vanta/dist/vanta.waves.min.js';
import NET from 'vanta/dist/vanta.net.min.js';
import BIRDS from 'vanta/dist/vanta.birds.min.js';
import HALO from 'vanta/dist/vanta.halo.min.js';

const VANTA_EFFECTS = {
  RINGS,
  CLOUDS2,
  FOG,
  WAVES,
  NET,
  BIRDS,
  HALO,
};

const VantaBackground = ({ effect }) => {
  const vantaRef = useRef(null);
  const vantaEffectInstance = useRef(null);

  useEffect(() => {
    const effectFunction = VANTA_EFFECTS[effect];
    if (!effectFunction) return;

    const initEffect = () => {
      // Cleanup the previous effect if it exists
      if (vantaEffectInstance.current && typeof vantaEffectInstance.current.destroy === 'function') {
        vantaEffectInstance.current.destroy();
      }

      try {
        // Initialize the new effect
        vantaEffectInstance.current = effectFunction({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          THREE,
          backgroundColor: 0x00000000,
        });
      } catch (error) {
        console.error('Vanta.js initialization error:', error);
      }
    };

    initEffect();

    const handleResize = () => {
      if (vantaEffectInstance.current) {
        vantaEffectInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup on component unmount
      if (vantaEffectInstance.current && typeof vantaEffectInstance.current.destroy === 'function') {
        vantaEffectInstance.current.destroy();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [effect]); // Re-run effect when `effect` changes

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    >
      <div
        ref={vantaRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default VantaBackground;
