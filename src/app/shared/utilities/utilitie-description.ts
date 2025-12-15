import { HttpParams } from "@angular/common/http";
import { ItemCombo } from "../models/combos/item-combo.interface";

export function obtenerDescripcion(
    listaValores: ItemCombo[],
    valorBuscado: string
  ): string {
    // @ts-ignore
    return listaValores?.find(
      (estaSeleccionado) => estaSeleccionado.value === valorBuscado
    )?.description;
  }
  export function construirParametrosFiltro<T>(filtro: T): HttpParams {
    let parametros = new HttpParams();
    for (const atributo in filtro) {
      const atributoComoCadena = atributo as string;
      if (
        // @ts-ignore
        filtro[atributoComoCadena] !== null &&
        // @ts-ignore
        filtro[atributoComoCadena] !== undefined &&
        // @ts-ignore
        filtro[atributoComoCadena] !== ''
      ) {
        parametros = parametros.append(
          atributoComoCadena,
          // @ts-ignore
          filtro[atributoComoCadena]
        );
      }
    }
    return parametros;
  }

  export function buscarDescripcionCombo(objeto: ItemCombo[] | undefined, valor: string) {
    return objeto?.filter((obj) => obj.value === valor)[0].description
  }
