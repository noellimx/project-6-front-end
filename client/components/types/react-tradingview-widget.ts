import { MAny } from "../../utils/my-types";




// config.d.ts
declare module "react-tradingview-widget" {

  // This nested namespace 'config' will merge with the enclosing 
  // declared namespace 'config'.
  // https://www.typescriptlang.org/docs/handbook/declaration-merging.html
  namespace config {
    interface AppConfig {
      TradingViewWidget : MAny; // MAny
    }

    interface MyInterface {}

  }

  const config: AppConfig;
  export = config;
}

