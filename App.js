import { PaperProvider } from "react-native-paper";
import BottomNavComponent from "./src/components/BottomNavComponent"

export default function App() {
  return (
    <PaperProvider>
      <BottomNavComponent />
    </PaperProvider>
  );
}