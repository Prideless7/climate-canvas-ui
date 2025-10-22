import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface Station {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  active: boolean;
  elevation: number;
  lastUpdate: string;
}

interface SimpleLeafletMapProps {
  stations: Station[];
  selectedStation: string;
  onStationSelect: (stationId: string) => void;
  hasStationData: (stationId: string) => boolean;
}

export default function SimpleLeafletMap({
  stations,
  selectedStation,
  onStationSelect,
  hasStationData,
}: SimpleLeafletMapProps) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    let L: any;
    let markers: any[] = [];

    const init = async () => {
      if (!mapEl.current) return;
      const leaflet = await import('leaflet');
      L = leaflet.default;

      if (!mapInstance.current) {
        mapInstance.current = L.map(mapEl.current, {
          center: [35.2401, 24.8093],
          zoom: 9,
          scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstance.current);
      }

      // Clear existing markers
      markers.forEach((m) => mapInstance.current?.removeLayer(m));
      markers = [];

      // Add markers
      stations.forEach((station) => {
        const hasData = hasStationData(station.id);
        const isSelected = selectedStation === station.id;
        const color = hasData ? (station.active ? '#1a91d1' : '#8b9298') : 'rgba(128,128,128,0.5)';
        const size = isSelected ? 32 : 24;

        const icon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div class="leaflet-marker-wrapper" style="
              width: ${size}px;
              height: ${size}px;
              background-color: ${color};
              border: ${isSelected ? '4px' : '2px'} solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: ${isSelected ? '0 4px 12px rgba(0,0,0,0.4)' : '0 2px 4px rgba(0,0,0,0.3)'};
              ${hasData ? 'cursor: pointer;' : 'cursor: not-allowed; opacity: 0.5;'}
              transition: all 0.2s ease;
              ${isSelected ? 'transform: scale(1.1);' : ''}
            "
            onmouseover="if(this.style.cursor === 'pointer') { this.style.transform = 'scale(1.15)'; this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)'; }"
            onmouseout="this.style.transform = '${isSelected ? 'scale(1.1)' : 'scale(1)'}'; this.style.boxShadow = '${isSelected ? '0 4px 12px rgba(0,0,0,0.4)' : '0 2px 4px rgba(0,0,0,0.3)'}';"
            >
              ${station.active ? `<div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; animation: pulse 2s infinite;"></div>` : ''}
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
          popupAnchor: [0, -size / 2],
        });

        const marker = L.marker([station.coordinates.lat, station.coordinates.lng], { icon });

        marker.on('click', () => {
          if (hasData) onStationSelect(station.id);
        });

        marker.bindPopup(`
          <div style="min-width: 180px">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;">
              <strong style="font-size: 0.875rem;">${station.name}</strong>
              <span style="font-size: 0.75rem; padding: 2px 6px; border-radius: 999px; background: ${
                station.active ? '#e6f7fd' : '#eee'
              }; color: ${station.active ? '#0d6ea1' : '#555'}">${station.active ? 'Online' : 'Offline'}</span>
            </div>
            <div style="font-size: 0.75rem; color: #666;">
              <div>${station.location}</div>
              <div>Elevation: ${station.elevation}m</div>
              <div>Updated: ${station.lastUpdate}</div>
              <div>Lat: ${station.coordinates.lat.toFixed(4)}, Lng: ${station.coordinates.lng.toFixed(4)}</div>
            </div>
          </div>
        `);

        marker.addTo(mapInstance.current);
        markers.push(marker);
      });
    };

    init();

    return () => {
      // Do not remove the map on unmount to avoid flicker when switching views quickly
      // but if we really want cleanup:
      // mapInstance.current?.remove();
      // mapInstance.current = null;
    };
  }, [stations, selectedStation, onStationSelect, hasStationData]);

  return <div ref={mapEl} style={{ width: '100%', height: '100%' }} />;
}
