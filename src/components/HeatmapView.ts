export class HeatmapView {
  private app: any;

  constructor(app: any) {
    this.app = app;
  }

  render() {
    const container = document.getElementById('app-container');
    if (!container) return;

    container.innerHTML = `
      <div class="heatmap-container">
        <div class="tv-widget">
          <!-- TradingView Heatmap Widget -->
          <div class="tradingview-widget-container">
            <div class="tradingview-widget-container__widget"></div>
            <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js" async>
            {
              "exchanges": ["US"],
              "dataSource": "SPX500",
              "grouping": "sector",
              "blockSize": "market_cap_basic",
              "blockColor": "change",
              "locale": "en",
              "symbolUrl": "",
              "colorTheme": "dark",
              "hasTopBar": false,
              "isDataSetEnabled": false,
              "isZoomEnabled": false,
              "hasSymbolTooltip": true,
              "width": "240",
              "height": "320"
            }
            </script>
          </div>
        </div>
        <div class="overlay-hint">
          <span>↓ Scroll for Charts</span>
        </div>
      </div>
    `;
  }
}
