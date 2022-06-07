import { createTheme } from "@mui/material/styles";

// allow configuration using `createTheme`
interface ThemeOptions {
  palette: {
    type: string;
    primary: {
      main: string;
    };
    secondary: {
      main: string;
    };
    background: {
      default: string;
      paper: string;
    };
    text: {
      primary: string;
    };
  };
  typography: {
    fontFamily: string;
  };
}

const themeOptions: ThemeOptions = {
  palette: {
    type: "light",
    primary: {
      main: "#0a81ab",
    },
    secondary: {
      main: "#ff5252",
    },
    background: {
      default: "#0c4271",
      paper: "#ffffff",
    },
    text: {
      primary: "#4e342e",
    },
  },
  typography: {
    fontFamily: "Raleway, Arial",
  },
};

const theme = createTheme(themeOptions);

export default theme;
