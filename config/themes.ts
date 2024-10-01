// themes.ts
const themes = {
    space: {
      backgroundImage: '/images/space-theme.jpg',
      fallingObject: {
        type: 'asteroid',
        objectColor: '#8B4513',
        subObjectColor: '#A0522D',
        objectSVG: (size: number) => `
          <circle cx="50" cy="50" r="50" fill="#8B4513" />
          <circle cx="35" cy="35" r="15" fill="#A0522D" />
          <circle cx="65" cy="65" r="12" fill="#A0522D" />
          <circle cx="75" cy="25" r="10" fill="#A0522D" />
        `,
      },
    },
    forest: {
      backgroundImage: '/images/forest-theme.jpg',
      fallingObject: {
        type: 'leaf',
        objectColor: '#FFA500',
        subObjectColor: '#32CD32',
        objectSVG: (size: number) => `
          <ellipse cx="50" cy="50" rx="30" ry="15" fill="#FFA500" />
          <ellipse cx="70" cy="40" rx="10" ry="5" fill="#32CD32" />
        `,
      },
    },
  };
  
  export default themes.forest;
  