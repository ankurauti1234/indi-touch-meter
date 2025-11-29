// src/steps/Summary.tsx

export default function Summary() {
  return (
    <div className="space-y-6">
  <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Network Type:</span>
              <span className="font-medium">WiFi</span>
            </div>
            <div className="flex justify-between">
              <span>Device ID:</span>
              <span className="font-mono">00A1B2C3D4E5F6</span>
            </div>
            <div className="flex justify-between">
              <span>Household ID:</span>
              <span className="font-medium">1234</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Verification:</span>
              <span className="font-medium">Completed</span>
            </div>
            <div className="flex justify-between">
              <span>TV Status:</span>
              <span className="font-medium">Powered On</span>
            </div>
            <div className="flex justify-between">
              <span>Detection Systems:</span>
              <span className="font-medium">Active</span>
            </div>
          </div>
        </div>
    </div>
  );
}