import React from 'react';

interface LogoColorProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const LogoColor: React.FC<LogoColorProps> = ({ className = '', width = 300, height = 300 }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 300 300"
      width={width}
      height={height}
      className={className}
    >
      <path d="M217.02 158.49c-2.35.01-1.53 4.83-2.29 9.73-.43 2.81-.69 5.59-1.52 8.34-.44 10.71 15.11 27.49 1.52 57.71-19.83 44.13-83.63 55.22-128.23 38.71-12.06-4.46-21.78-12.46-14.98-4.87 6.76 7.55 21.34 16.77 30.98 21.09 24.41 10.94 66.15 8.86 91.92.93 2.34-.72-.1.05 0 0 42.77-12.36 59.43-60.12 44.69-96.19-1.68-4.12-19.84-35.48-22.09-35.46Z" fill="#ff9f1c"/>
      <path d="M95.39 145.05c8.71-1.06 16.24-1.95 25.14-.93 16.35 1.89 20.59 9.59 32.5 7.88 6.35-.91 13.97-11 46.98-7.42-4.6-23.78-11.93-47.27-24.38-68.61-7.59-5.19-19.15-7.97-20.06-7.42-.83.5.46 4.06-.76 5.33.87 1.15.91.14 2.03.23 1.29.11 6.84-.45 6.09 2.55-.95 3.82-27.92 5.8-28.44-1.16 2.3-.83 2.27-.78 4.57-1.39.84-.22 2.49.46 3.05-.7 2.72-5.64-2.45-4.74-6.35-3.94-34.73 7.15-33.4 51.98-48.5 76.26l.76.7c2.34-.82 4.9-1.09 7.36-1.39Zm76.43-12.98c-6.86 3.33-10.84-4.86-4.57-6.03 4.91-.92 8.5 4.12 4.57 6.03Zm-9.14-17.16c2.57-.5 4.05 2.25 2.79 3.94-2.74 3.67-7.2-3.07-2.79-3.94Zm-38.09 15.76c-8.45 1.97-8.63-13.63-3.05-14.83 8.66-1.86 8.49 13.57 3.05 14.83Z" fill="#ffbf69"/>
      <path d="m209.4 146.44.76-.7c-12.45-20.29-14.08-55.77-34.53-69.77 12.45 21.34 19.78 44.83 24.38 68.61 3.18.34 6.45.58 9.4 1.85Zm-46.47-69.77c.75-3-4.8-2.44-6.09-2.55 4.12 4.49-19.51 5.53-17.77 0-2.3.61-2.27.56-4.57 1.39.52 6.96 27.49 4.98 28.44 1.16Zm-41.39 39.17c-5.58 1.2-5.4 16.8 3.05 14.83 5.45-1.27 5.61-16.7-3.05-14.83Zm50.28 16.23c3.93-1.91.34-6.94-4.57-6.03-6.27 1.17-2.29 9.35 4.57 6.03Zm-6.35-13.22c1.26-1.69-.23-4.44-2.79-3.94-4.4.87.05 7.61 2.79 3.94Zm-19.8-45.89c.36 1.13.97.21 1.02.23.73.3 2.99.81 3.55.23 1.01-1.03.33-13.84 0-16.22-.99-7.06-10.31-30.2-11.68-31.52-1.69-1.62-4.27 1.65-6.09-.46 1.29-.45 5-4.54 5.08-4.87 1.51-6.04-10.46-.91-10.16 4.64.08 1.44 3.67 4.3 4.57 5.56 19.86 27.67 11.06 34.19 13.71 42.42Z" fill="#ff9f1c"/>
      <path d="M204.58 12.47c-3.42 3.6-17.87 12.69-23.36 16.92l11.43.23v.93l-14.22.93c-5.13 4.07-10.75 7.65-16 11.59-2.55 1.91-5.2 3.73-7.62 5.79 22.75 4.48 44.53 1.21 54.34-19.93 2.03-4.37 5.95-18.17 5.08-22.48-.13-.63.27-1.44-.25-1.85-16.59-1-39.16 2.16-49.51 15.3-8.17 8.12-11.97 24.85-10.41 25.96l22.6-15.07c4.48-16.4 6.97-25.18 2.29-1.62 7.15-3.9 22.43-15.67 25.65-16.69" fill="#2ec4b6"/>
      <path d="M71.52 268.12c-6.8-7.59 2.93.4 14.98 4.87 44.6 16.52 108.4 5.42 128.23-38.71 13.58-30.22-1.96-47.01-1.52-57.71-2.48 5.72-5.39 9.81-11.68 12.52 12.87 8.54-22.66 13.32-24.88 2.78-22.15-2.36-23.34-26.36-24.38-28.05-1.96-3.2-5.73-2.11-7.11.93-.79 1.73-2.37 24.63-23.87 27.12-.78 9.9-36.8 6.71-25.39-2.78-9.71-4.38-11.93-13.45-13.2-22.25-.24-1.68.76-8.8-2.29-8.81-2.56 0-22.27 35.47-24.12 41.03-7.33 22.01-4.18 48.43 11.17 66.99 7.87 9.51 22.43 19.74 35.04 23.18-9.63-4.32-24.22-13.54-30.98-21.09Zm26.15-43.34c5.92-1.57 6.15 7.87 1.52 8.34-4.52.46-4.95-7.43-1.52-8.34Zm-21.83-35.23c8.07-1.77 6.78 6.7 2.54 8.34-8.49 3.3-7.76-7.2-2.54-8.34Zm11.68 22.71c3.03-.6 4.74 4.12 2.03 5.1-4.42 1.6-4.85-4.54-2.03-5.1Zm-8.64-.46c-7.62.95-8.04-10.31-2.03-11.13 7.24-.98 8.47 10.32 2.03 11.13Z" fill="#ffbf69"/>
      <path d="M76.85 200.67c-6.01.81-5.59 12.07 2.03 11.13 6.44-.8 5.21-12.11-2.03-11.13Zm1.53-2.78c4.24-1.65 5.53-10.11-2.54-8.34-5.22 1.15-5.95 11.64 2.54 8.34Zm20.82 35.23c4.63-.47 4.39-9.92-1.52-8.34-3.43.91-3 8.81 1.52 8.34Zm-9.65-15.76c2.71-.98 1-5.7-2.03-5.1-2.82.56-2.39 6.7 2.03 5.1Zm31.74-25.49c-5.89.68-20.03-.36-25.39-2.78-11.41 9.49 24.61 12.68 25.39 2.78Zm80.24-2.79c-5.98 2.57-18.33 3.48-24.88 2.78 2.23 10.54 37.76 5.75 24.88-2.78Z" fill="#ff9f1c"/>
      <path d="M181.98 150.61c-3.44.22-18.22 3-20.06 5.33-3.92 4.96-.39 18.8 3.55 23.64 8.43 10.34 33.88 6.19 38.09.93 2.45-3.07 4.12-11.95 4.06-15.76-.16-11.99-3.03-12.54-11.43-13.68-3.57-.48-10.62-.7-14.22-.46Zm-73.89 0c-2.04.08-13.82 1.56-14.47 1.85-3.97 1.81-5.89 25.09 3.55 30.6 2.78 1.62 31.34 9.31 38.34-9.04 6.94-18.19-2.61-22.52-20.82-23.41-2.12-.1-4.48-.08-6.6 0Z" fill="#ffbf69"/>
    </svg>
  );
};

export default LogoColor;