export function validarCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');
  
    if (!cnpj || cnpj.length !== 14) return false;
  
    if (/^(\d)\1+$/.test(cnpj)) return false;
  
    const calcDV = (cnpj: string, multipliers: number[]) => {
      const sum = cnpj
        .split('')
        .slice(0, multipliers.length)
        .reduce((acc, digit, i) => acc + parseInt(digit) * multipliers[i], 0);
  
      const rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    };
  
    const dv1 = calcDV(cnpj, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const dv2 = calcDV(cnpj, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  
    return dv1 === parseInt(cnpj[12]) && dv2 === parseInt(cnpj[13]);
  }
  