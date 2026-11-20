/* Theme presets. A preset is plain data (same shape as an exported theme.json):
   { name, tokens:{'--color-*': value}, fonts:{heading,body,rate}, geometry:{button,card}, org:{name,routing,nmls} }
   Colour tokens are the exact names in tokens.css. Org data here is fictional apart from Granite (the engineer's copy). */
export const FONT_LISTS = {
  heading: [['Source Sans 3', 'sans-serif'], ['Source Serif 4', 'serif'], ['Merriweather', 'serif'], ['Playfair Display', 'serif'], ['Lora', 'serif'], ['Poppins', 'sans-serif'], ['Montserrat', 'sans-serif'], ['DM Serif Display', 'serif'], ['Roboto Slab', 'serif'], ['Libre Baskerville', 'serif'], ['Raleway', 'sans-serif'], ['Work Sans', 'sans-serif']],
  body: [['Source Sans 3', 'sans-serif'], ['Inter', 'sans-serif'], ['Open Sans', 'sans-serif'], ['Nunito Sans', 'sans-serif'], ['DM Sans', 'sans-serif'], ['Lato', 'sans-serif'], ['Roboto', 'sans-serif'], ['Public Sans', 'sans-serif'], ['IBM Plex Sans', 'sans-serif']],
  rate: [['Source Serif 4', 'serif'], ['DM Serif Display', 'serif'], ['Playfair Display', 'serif'], ['Merriweather', 'serif'], ['Lora', 'serif'], ['Fraunces', 'serif'], ['Roboto Slab', 'serif'], ['Poppins', 'sans-serif'], ['Source Sans 3', 'sans-serif']],
};
export const BUTTON_SHAPES = { pill: '50px', soft: '5px', square: '0px' };
export const CARD_RADII = { rounded: { '--radius-card': '16px', '--radius-lg': '20px', '--radius-md': '12px' }, sharp: { '--radius-card': '0px', '--radius-lg': '0px', '--radius-md': '0px' } };

const base = { '--color-tint': '#dddddc', '--color-tertiary-light': '#838DDD', '--color-accent-dark': '#C12000' };
export const PRESETS = {
  granite: { name: 'Granite Credit Union', tokens: { ...base, '--color-accent': '#F94D2B', '--color-secondary': '#45bfe5', '--color-tertiary': '#4b56a8', '--color-surface': '#F5F5F5', '--color-highlight': '#fdb913', '--color-dark': '#1c2b39', '--color-white': '#FFFFFF' },
    fonts: { heading: ['Source Sans 3', 'sans-serif'], body: ['Source Sans 3', 'sans-serif'], rate: ['Source Serif 4', 'serif'] }, geometry: { button: 'soft', card: 'rounded' },
    org: { name: 'Granite Credit Union', routing: '324078721', nmls: '582825' } },
  layout02: { name: 'Layout 02 (Indigo & Gold)', tokens: { ...base, '--color-accent': '#F94D2B', '--color-secondary': '#45bfe5', '--color-tertiary': '#4B56A8', '--color-surface': '#F5F5F5', '--color-highlight': '#FFE299', '--color-dark': '#1C2B39', '--color-white': '#FFFFFF' },
    fonts: { heading: ['Source Serif 4', 'serif'], body: ['Source Sans 3', 'sans-serif'], rate: ['Source Serif 4', 'serif'] }, geometry: { button: 'soft', card: 'sharp' },
    org: { name: 'Finalytics.ai', routing: '324078721', nmls: '582825', logo: 'assets/uploads/finalytics-logo.png' } },
  ironbridge: { name: 'Ironbridge Members CU (Layout 03)', tokens: { ...base, '--color-tint': '#DCE8F0', '--color-tertiary-light': '#4F78B5', '--color-accent': '#C2410C', '--color-accent-dark': '#8F2E08', '--color-secondary': '#2F6F89', '--color-tertiary': '#0E2A52', '--color-surface': '#F3F6F9', '--color-highlight': '#F4B942', '--color-dark': '#0A1B33', '--color-white': '#FFFFFF' },
    fonts: { heading: ['Roboto Slab', 'serif'], body: ['Roboto', 'sans-serif'], rate: ['Roboto Slab', 'serif'] }, geometry: { button: 'soft', card: 'sharp' },
    org: { name: 'Ironbridge Members Credit Union', routing: '253177049', nmls: '1048213', logo: '' } },
  harbor: { name: 'Harbor Federal Credit Union', tokens: { '--color-tint': '#E3EAF1', '--color-tertiary-light': '#5C7DB0', '--color-accent': '#0A6C8F', '--color-accent-dark': '#074E67', '--color-secondary': '#8DB4D1', '--color-tertiary': '#13315C', '--color-surface': '#F3F6F9', '--color-highlight': '#F6C453', '--color-dark': '#0B2545', '--color-white': '#FFFFFF' },
    fonts: { heading: ['Merriweather', 'serif'], body: ['Inter', 'sans-serif'], rate: ['DM Serif Display', 'serif'] }, geometry: { button: 'soft', card: 'rounded' },
    org: { name: 'Harbor Federal Credit Union', routing: '221473889', nmls: '410227' } },
  evergreen: { name: 'Evergreen Community CU', tokens: { '--color-tint': '#E7E3D4', '--color-tertiary-light': '#B58F52', '--color-accent': '#2E7D32', '--color-accent-dark': '#1B5E20', '--color-secondary': '#A3C9A8', '--color-tertiary': '#7A5C2E', '--color-surface': '#F6F4EC', '--color-highlight': '#F2C14E', '--color-dark': '#12372A', '--color-white': '#FFFFFF' },
    fonts: { heading: ['Lora', 'serif'], body: ['Nunito Sans', 'sans-serif'], rate: ['Lora', 'serif'] }, geometry: { button: 'square', card: 'sharp' },
    org: { name: 'Evergreen Community Credit Union', routing: '123008810', nmls: '776104' } },
  summit: { name: 'Summit Members CU', tokens: { '--color-tint': '#EDE7F6', '--color-tertiary-light': '#F06292', '--color-accent': '#6B2FA0', '--color-accent-dark': '#4A1D73', '--color-secondary': '#B8A1E3', '--color-tertiary': '#C2185B', '--color-surface': '#F7F4FB', '--color-highlight': '#FFD166', '--color-dark': '#231942', '--color-white': '#FFFFFF' },
    fonts: { heading: ['Poppins', 'sans-serif'], body: ['DM Sans', 'sans-serif'], rate: ['Poppins', 'sans-serif'] }, geometry: { button: 'pill', card: 'rounded' },
    org: { name: 'Summit Members Credit Union', routing: '307086642', nmls: '903318' } },
};
