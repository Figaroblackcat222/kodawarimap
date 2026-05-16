export interface ExifData {
  coordinates?: {
    lng: number;
    lat: number;
  };
  takenAt?: Date;
  takenAtEstimated?: true;
  cameraMake?: string;
  cameraModel?: string;
  fNumber?: number;
  exposureTime?: number;
  focalLength?: number;
  iso?: number;
}
