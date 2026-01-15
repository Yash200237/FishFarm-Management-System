import { useState,} from "react";
import {APIProvider, Map, AdvancedMarker,Pin, InfoWindow} from '@vis.gl/react-google-maps';
import Box from '@mui/material/Box';

type Mode = "view" | "select";

interface MapComponentProps {
  latitude: number;
  longitude: number;
  mode?: Mode;
  onLocationChange?: (lat: number, lng: number) => void;
}

export const MapComponent = ({ latitude, longitude,  mode = "view",onLocationChange }: MapComponentProps) => {
  const position = { lat: latitude, lng: longitude };
  const [open, setOpen] = useState(false);
  return (
    <APIProvider apiKey="AIzaSyA-3aJuP4PLiFtOEueGJaxIl2p4xgwv1mM">
    <Box sx={{ width: "100%", height: 450, boxSizing: "border-box" }}>
        <Map defaultZoom={5} 
             defaultCenter={position} 
             style={{ width: "100%", height: "100%" }} 
             mapId="8cdd78b373595081ddb95318"
             onClick={(e) => {
                if (mode !== "select") return;

                const latLng = e.detail?.latLng;
                if (!latLng) return;
                onLocationChange?.(latLng.lat, latLng.lng);
             }}
        >
          <AdvancedMarker 
                position={position} 
                onClick={() => mode === "view" && setOpen(true)}
        >
            <Pin/>
          </AdvancedMarker>
          {mode === "view" && open && (
            <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
            Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
            </InfoWindow>
          )}
        </Map>
      </Box>
    </APIProvider>
  );    
}




