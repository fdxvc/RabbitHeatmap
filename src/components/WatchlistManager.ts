export class WatchlistManager {
  private app: any;
  private watchlist: string[];
  private selectedIndex: number = 0;
  private inputMode: boolean = false;
  private newSymbol: string = '';

  constructor(app: any, watchlist: string[]) {
    this.app = app;
    this.watchlist = [...watchlist];
  }

  render() {
    const container = document.getElementById('app-container');
    if (!container) return;

    if (this.inputMode) {
      this.renderInputMode(container);
    } else {
      this.renderListMode(container);
    }
  }

  private renderListMode(container: HTMLElement) {
    const items = this.watchlist.map((sym, idx) => `
      <div class="watchlist-item ${idx === this.selectedIndex ? 'selected' : ''}" data-index="${idx}">
        <span class="sym-name">${sym}</span>
        <button class="delete-btn" onclick="event.stopPropagation(); window.deleteSymbol(${idx})">×</button>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="manager-container">
        <h3>📊 Ma Watchlist</h3>
        <div class="watchlist-list">
          ${items}
        </div>
        <div class="manager-actions">
          <button class="action-btn primary" id="add-btn">+ Ajouter</button>
          <button class="action-btn" id="save-btn">✓ Sauver</button>
        </div>
        <div class="hint">Scroll: Naviguer | Click: Select | Hold: Retour</div>
      </div>
    `;

    // Event listeners
    document.getElementById('add-btn')?.addEventListener('click', () => {
      this.inputMode = true;
      this.newSymbol = '';
      this.render();
    });

    document.getElementById('save-btn')?.addEventListener('click', () => {
      this.app.saveWatchlist(this.watchlist);
      this.app.state.currentView = 'charts';
      this.app.render();
    });

    // Exposer deleteSymbol globalement
    (window as any).deleteSymbol = (idx: number) => {
      this.watchlist.splice(idx, 1);
      if (this.selectedIndex >= this.watchlist.length) {
        this.selectedIndex = Math.max(0, this.watchlist.length - 1);
      }
      this.render();
    };
  }

  private renderInputMode(container: HTMLElement) {
    container.innerHTML = `
      <div class="input-container">
        <h3>➕ Nouveau Titre</h3>
        <div class="input-display">
          <span class="input-prefix">${this.getPrefix()}</span>
          <span class="input-value">${this.newSymbol || '___'}</span>
        </div>
        <div class="keyboard-hint">
          Scroll: A-Z | Click: Valider lettre | Hold: Espace | Double Hold: Suppr
        </div>
        <div class="input-actions">
          <button class="action-btn" id="cancel-input">Annuler</button>
          <button class="action-btn primary" id="confirm-input">Ajouter</button>
        </div>
      </div>
    `;

    document.getElementById('cancel-input')?.addEventListener('click', () => {
      this.inputMode = false;
      this.render();
    });

    document.getElementById('confirm-input')?.addEventListener('click', () => {
      this.addSymbol();
    });
  }

  private getPrefix(): string {
    // Détection automatique du marché
    if (/^\d/.test(this.newSymbol)) return 'XPAR:'; // Euronext Paris (ISIN numérique)
    if (/^[A-Z]{1,5}$/.test(this.newSymbol)) return 'NASDAQ:'; // US stocks
    return '';
  }

  private addSymbol() {
    if (this.newSymbol.trim()) {
      const formatted = this.formatSymbol(this.newSymbol.trim().toUpperCase());
      if (!this.watchlist.includes(formatted)) {
        this.watchlist.push(formatted);
      }
    }
    this.inputMode = false;
    this.render();
  }

  private formatSymbol(input: string): string {
    // Si déjà formaté avec exchange
    if (input.includes(':')) return input;
    
    // ISIN (12 caractères alphanumériques)
    if (input.length === 12 && /^[A-Z0-9]+$/.test(input)) {
      return `XPAR:${input}`; // Par défaut Euronext Paris
    }
    
    // Symbole simple -> NASDAQ par défaut
    return `NASDAQ:${input}`;
  }

  scroll(direction: 'up' | 'down') {
    if (this.inputMode) {
      // Mode saisie: alphabet virtuel
      this.scrollAlphabet(direction);
    } else {
      // Mode liste
      if (direction === 'down') {
        this.selectedIndex = (this.selectedIndex + 1) % (this.watchlist.length + 1);
      } else {
        this.selectedIndex = (this.selectedIndex - 1 + this.watchlist.length + 1) % (this.watchlist.length + 1);
      }
      this.render();
    }
  }

  private scrollAlphabet(direction: 'up' | 'down') {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:';
    const lastChar = this.newSymbol.slice(-1) || 'A';
    const currentIdx = alphabet.indexOf(lastChar);
    const newIdx = direction === 'down' 
      ? (currentIdx + 1) % alphabet.length
      : (currentIdx - 1 + alphabet.length) % alphabet.length;
    
    this.newSymbol = this.newSymbol.slice(0, -1) + alphabet[newIdx];
    this.render();
  }

  select() {
    if (this.inputMode) {
      // Ajouter le caractère sélectionné
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:';
      const currentChar = alphabet[0]; // Simplifié pour l'exemple
      this.newSymbol += currentChar;
      this.render();
    }
  }
}
