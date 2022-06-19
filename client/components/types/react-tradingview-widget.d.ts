import { MAny } from "../../utils/my-types";

// config.d.ts
declare module "react-tradingview-widget" {
  export default interface AppConfig {
    TradingViewWidget: MAny | React.FC; // MAny
  }

  export const TradingViewWidget: MAny | React.FC;
}
