import { MapView } from "@presentation/components/map-view";
import { PwaUpdateDialog } from "@presentation/components/pwa-update-dialog";

function App() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapView />
      <PwaUpdateDialog />
    </div>
  );
}

export default App;
