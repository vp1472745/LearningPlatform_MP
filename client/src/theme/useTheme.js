import { useContext } from "react";
import { ThemeContext } from "./themeProvider"; // ✅ correct

const useTheme = () => {
  return useContext(ThemeContext);
};

export default useTheme;