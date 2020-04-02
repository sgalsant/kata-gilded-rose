// Principios SOLID 
// “Depend on abstractions, not on concretions.  --> Principio de Inversión de Dependencias
// Una clase no debería hacer referencia a otra clase sino a interfaces


// Aplicamos este principio a la clase Shop que depende de la clase Item. Construimos una interfaz
// para item

// Además aprovechamos para refactorizar. Todos los items deben respetar que el valor de la 
// calidad debe estar entre 0 y 50. Está regla la estamos duplicando en cada clase Item. Vamos
// a ponerlo a nivel de la clase Item. Además, el comportamiento habitual es decrementar sellIn
// antes de ejecutar updateQuality

// Y ya que estamos las propiedades las ponemos protegidas (para que puedan ser accesibles desde
// las clases hijas) con su método get

interface IItem {
  name: string;
  sellIn: number;
  quality: number;

  updateQuality();
}


class Intervalos {
  private array: Array<number>;

  constructor (array: Array<number>) {
    this.array = array;
  }

  add(value= 0, min=Number.NEGATIVE_INFINITY , max=Number.POSITIVE_INFINITY) {
    this.array.push(value, min, max);
  }

  getValue(sellIn: number): number {
    if (this.array != null) {
      for (let i = 0; i < this.array.length; i+=3) {
        if (this.array[i+1] <= sellIn && sellIn <= this.array[i+2]) {
          return this.array[i];
        }
      }
    }
    return 0;
  }
}

class Item implements IItem {
    protected _name: string;
    protected _sellIn: number;
    protected _quality: number;
    protected intervalos: Intervalos;
    protected decSellIn: number;

    constructor(name: string, sellIn: number, quality: number, intervalos: Array<number>=null, decSellIn: number = -1){
      this._name = name;
      this._sellIn = sellIn;
      this._quality = quality;

      this.decSellIn = decSellIn;
      this.intervalos = new Intervalos(intervalos);
    }

    updateQuality() {
      this._sellIn += this.decSellIn;
     
      this._quality += this.intervalos.getValue(this._sellIn);

      this._quality = Math.max(0, Math.min(50, this._quality));
    }

    get name(): string {
      return this._name;
    }

    get sellIn(): number {
      return this._sellIn;
    }

    get quality(): number {
      return this._quality;
    }
}

class Shop {
   private items: Array<IItem>;

    constructor(items: Array<IItem>){
      this.items = items;
    }

    updateQuality() {
      for (var i = 0; i < this.items.length; i++) {
        this.items[i].updateQuality();
      }
  
      return this.items;
    }
  }
  
  export {
    Item,
    Shop
  }