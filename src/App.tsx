import { MapView } from "@presentation/components/map-view";
import { PwaUpdateDialog } from "@presentation/components/pwa-update-dialog";
import { AdminApp } from "@presentation/admin/admin-app";

function App() {
  if (window.location.pathname === "/admin") {
    return <AdminApp />;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapView />
      <PwaUpdateDialog />
    </div>
  );
}

export default App;
