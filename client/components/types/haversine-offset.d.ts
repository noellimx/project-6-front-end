declare module "haversine-offset" {
  const haversineOffset: (
    a: { latitude: number; longitude: number },
    offset: { x: number; y: number }
  ) => { lat: number; lng: number };
  export default haversineOffset;
}
