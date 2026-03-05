export class ChartScroller {
  private app: any;
  private watchlist: string[];
  private currentWidget: any;

  constructor(app: any, watchlist: string[]) {
    this.app = app;
    this.watchlist = watchlist;
  }

  render(index: number) {
    const container = document.getElementById('app-container');
    if (!container) return;

    const symbol = this.watchlist[index] || 'NASDAQ:NVDA';
    
    container.innerHTML = `
      <div class="chart-container">
        <div class="symbol-header">
          <span class="symbol-badge">${symbol}</span>
          <span class="counter">${index + 1}/${this.watchlist.length}</span>
        </div>
        <div class="tv-chart-widget" id="chart-widget">
          <!-- TradingView Advanced Chart -->
          <div class="tradingview-widget-container">
            <div class="tradingview-widget-container__widget"></div>
            <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js" async>
            {
              "allow_symbol_change": false,
              "calendar": false,
              "details": false,
              "hide_side_toolbar": true,
              "hide_top_toolbar": true,
              "hide_legend": false,
              "hide_volume": true,
              "hotlist": false,
              "interval": "15",
              "locale": "fr",
              "save_image": false,
              "style": "0",
              "symbol": "${symbol}",
              "theme": "dark",
              "timezone": "Europe/Paris",
              "backgroundColor": "rgba(0, 0, 0, 1)",
              "gridColor": "rgba(128, 128, 128, 0.07)",
              "withdateranges": false,
              "width": 240,
              "height": 280
            }
            </script>
          </div>
        </div>
        <div class="scroll-indicator">
          <div class="scroll-bar">
            <div class="scroll-progress" style="width: ${((index + 1) / this.watchlist.length) * 100}%"></div>
          </div>
        </div>
      </div>
    `;
  }

  updateSymbol(index: number) {
    this.render(index);
  }

  updateWatchlist(newList: string[]) {
    this.watchlist = newList;
  }
}
