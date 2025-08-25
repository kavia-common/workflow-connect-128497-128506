import React from 'react';

function Svg({ children, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

// PUBLIC_INTERFACE
export function HomeIcon({ size=16 }) {
  /** Home icon */
  return (
    <Svg size={size}>
      <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z"/>
    </Svg>
  );
}

// PUBLIC_INTERFACE
export function BoltIcon({ size=16 }) {
  /** Lightning bolt icon */
  return (
    <Svg size={size}>
      <path d="m13 2-9 13h7l-1 7 9-13h-7l1-7z"/>
    </Svg>
  );
}

// PUBLIC_INTERFACE
export function CableIcon({ size=16 }) {
  /** Cable/plug icon */
  return (
    <Svg size={size}>
      <path d="M8 7v6a4 4 0 1 0 8 0V7"/>
      <path d="M6 3h12"/>
      <path d="M6 3v4"/>
      <path d="M18 3v4"/>
    </Svg>
  );
}

// PUBLIC_INTERFACE
export function ListIcon({ size=16 }) {
  /** List icon */
  return (
    <Svg size={size}>
      <path d="M8 6h12M8 12h12M8 18h12"/>
      <path d="M3 6h.01M3 12h.01M3 18h.01"/>
    </Svg>
  );
}

// PUBLIC_INTERFACE
export function PlusIcon({ size=16 }) {
  /** Plus icon */
  return (
    <Svg size={size}>
      <path d="M12 5v14M5 12h14"/>
    </Svg>
  );
}

// PUBLIC_INTERFACE
export function TrashIcon({ size=16 }) {
  /** Trash icon */
  return (
    <Svg size={size}>
      <path d="M3 6h18"/>
      <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/>
      <path d="M10 10v8M14 10v8"/>
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
    </Svg>
  );
}

// PUBLIC_INTERFACE
export function EditIcon({ size=16 }) {
  /** Pencil/edit icon */
  return (
    <Svg size={size}>
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
    </Svg>
  );
}

// PUBLIC_INTERFACE
export function PlayIcon({ size=16 }) {
  /** Play icon */
  return (
    <Svg size={size}>
      <path d="M5 3l14 9-14 9V3z"/>
    </Svg>
  );
}
