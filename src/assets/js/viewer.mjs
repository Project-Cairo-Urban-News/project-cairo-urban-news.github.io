import Mirador from 'mirador/dist/mirador.min.js';

const manifest = document.getElementById('viewer').getAttribute('data-manifest-id');
const config = {
  id: 'viewer',
  selectedTheme: 'light',
  themes: {
    light: {
      palette: {
        type: 'light',
        primary: {
          main: '#507F93'
        },
        secondary: {
          main: '#07DEDA'
        }
      }
    }
  },
  windows: [{
    loadedManifest: manifest
  }],
  window: {
    allowClose: false,
    allowWindowSideBar: true,
    allowTopMenuButton: false,
    defaultSideBarPanel: 'info',
    hideWindowTitle: true,
    sideBarOpenByDefault: false,
    views: [
      { key: 'single' },
      { key: 'book' },
      { key: 'gallery' },
      { key: 'thumbnails' }
    ]
  },
  workspace: {
    showZoomControls: true
  },
  workspaceControlPanel: {
    enabled: false
  }
};
Mirador.viewer(config);