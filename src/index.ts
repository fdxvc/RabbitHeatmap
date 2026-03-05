import { RabbitApp, ScrollDirection, ButtonEvent } from '@rabbit-r1/sdk';
import { HeatmapView } from './components/HeatmapView';
import { ChartScroller } from './components/ChartScroller';
import { WatchlistManager } from './components/WatchlistManager';

interface AppState {
  currentView: 'heatmap' | 'charts' | 'manager';
  watchlist: string[];
  currentIndex: number;
}

class TradingRabbit extends RabbitApp {
  private state: AppState = {
    currentView: 'heatmap',
    watchlist: ['NASDAQ:NVDA', 'NASDAQ:AAPL', 'NASDAQ:TSLA', 'NYSE:MSFT', 'NASDAQ:AMZN'],
    currentIndex: 0
  };

  private heatmapView: HeatmapView;
  private chartScroller: ChartScroller;
  private watchlistManager: WatchlistManager;

  async onInit() {
    // Charger la watchlist sauvegardée
    const saved = await this.storage.get('watchlist');
    if (saved) {
      this.state.watchlist = JSON.parse(saved);
    }

    this.heatmapView = new HeatmapView(this);
    this.chartScroller = new ChartScroller(this, this.state.watchlist);
    this.watchlistManager = new WatchlistManager(this, this.state.watchlist);

    this.render();
  }

  render() {
    switch (this.state.currentView) {
      case 'heatmap':
        this.heatmapView.render();
        this.showStatus('🌡️ Heatmap US | ↓ Charts | Hold + Edit');
        break;
      case 'charts':
        this.chartScroller.render(this.state.currentIndex);
        this.showStatus(`${this.state.currentIndex + 1}/${this.state.watchlist.length} | ↓ Heatmap | Hold Manage`);
        break;
      case 'manager':
        this.watchlistManager.render();
        this.showStatus('✏️ Edit Mode | Click Select');
        break;
    }
  }

  onScroll(direction: ScrollDirection) {
    if (this.state.currentView === 'charts') {
      if (direction === 'down') {
        this.state.currentIndex = (this.state.currentIndex + 1) % this.state.watchlist.length;
      } else {
        this.state.currentIndex = (this.state.currentIndex - 1 + this.state.watchlist.length) % this.state.watchlist.length;
      }
      this.chartScroller.updateSymbol(this.state.currentIndex);
      this.render();
    } else if (this.state.currentView === 'manager') {
      this.watchlistManager.scroll(direction);
    }
  }

  onButtonPress(event: ButtonEvent) {
    if (event.type === 'click') {
      // Navigation entre vues
      if (this.state.currentView === 'heatmap') {
        this.state.currentView = 'charts';
      } else if (this.state.currentView === 'charts') {
        this.state.currentView = 'heatmap';
      } else if (this.state.currentView === 'manager') {
        this.watchlistManager.select();
      }
      this.render();
    } else if (event.type === 'hold' && event.duration > 1000) {
      // Appui long pour mode édition
      if (this.state.currentView !== 'manager') {
        this.state.currentView = 'manager';
      } else {
        this.state.currentView = 'charts';
      }
      this.render();
    }
  }

  async saveWatchlist(newList: string[]) {
    this.state.watchlist = newList;
    await this.storage.set('watchlist', JSON.stringify(newList));
    this.chartScroller.updateWatchlist(newList);
  }

  getWatchlist() {
    return this.state.watchlist;
  }
}

export default TradingRabbit;
