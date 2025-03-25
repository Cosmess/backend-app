import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GeoLocateService {
  private readonly googleApiKey: string |undefined;

  constructor(private readonly configService: ConfigService) {
    this.googleApiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY', '');
  }


  async obterLatLngPorCep(cep: string): Promise<{ lat: string; lng: string } | null> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${this.googleApiKey}`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (
        data.status === 'OK' &&
        data.results &&
        data.results[0]?.geometry?.location
      ) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }

      console.warn(`CEP não encontrado: ${cep}`, data.status);
      return null;
    } catch (error) {
      console.error('Erro ao consultar Google Maps API:', error.message);
      return null;
    }
  }


  async calcularDistancia(
    pontoA: { lat: number; lng: number },
    pontoB: { lat: number; lng: number },
  ): Promise<number> {
    const R = 6371; // Raio da Terra em km
    const toRad = (grau: number) => grau * (Math.PI / 180);
  
    const dLat = toRad(pontoB.lat - pontoA.lat);
    const dLng = toRad(pontoB.lng - pontoA.lng);
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(pontoA.lat)) *
        Math.cos(toRad(pontoB.lat)) *
        Math.sin(dLng / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;
  
    return Math.round(distancia);
  }
  
}
