import AppRouter from "./AppRouter";
import { OperationsRoomProvider } from "./context/OperationsRoomContext";

function App() {
  return (
    <OperationsRoomProvider>
      <AppRouter />
    </OperationsRoomProvider>
  );
}

export default App;