import React, { useEffect, useState } from 'react';

/**
 * Fader component.
 *
 * @param {Object} props - Component props.
 * @returns {HTMLElement}
 */
const Fader = ({ children, when = true }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!when) return;

    setVisible(true);
  }, [when]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: '0.5s',
      }}>
      {children}
    </div>
  );
};

export default Fader;
