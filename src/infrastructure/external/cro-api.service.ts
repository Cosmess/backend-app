import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CroApiService {
  async buscarPorNumeroRegistro(numeroRegistro: string): Promise<any> {
    const url = process.env.CRO_API || '';
    if (!url) {
      throw new Error('CRO_API is not defined');
    }
    const headers = {
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json; charset=UTF-8',
      'Referer': 'https://cro-sp.implanta.net.br/servicosOnline/Publico/ConsultaInscritos/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest',
      'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    };
    
    const data = { NumeroRegistro: numeroRegistro };
    
    try {
      const response = await axios.post(url, data, { headers });
      if(response.data.data[0].length ===0){
        return {situacao: 'PENDENTE'}
      }
      const situacao = response.data.data[0].Situacao;
      const situacaoDetalhe = response.data.data[0].SituacaoDetalhe;
      const numeroRegistro = response.data.data[0].NumeroRegistro;
      return {situacao,situacaoDetalhe,numeroRegistro}
    } catch (error) {
      return {situacao: 'PENDENTE'}
    }
  }
}