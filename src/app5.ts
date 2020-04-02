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

  constructor () {
    this.array = new Array<number>();
  }

  add(value= 0, min=Number.NEGATIVE_INFINITY , max=Number.POSITIVE_INFINITY) {
    this.array.push(value, min, max);
  }

  getValue(sellIn: number): number {
    for (let i = 0; i < this.array.length; i+=3) {
       if (this.array[i+1] <= sellIn && sellIn <= this.array[i+2]) {
         return this.array[i];
       }
    }

    return 0;
  }
}

abstract class Item implements IItem {
    protected _name: string;
    protected _sellIn: number;
    protected _quality: number;
    protected intervalos: Intervalos;

    constructor(name: string, sellIn: number, quality: number){
      this._name = name;
      this._sellIn = sellIn;
      this._quality = quality;

      this.intervalos = new Intervalos();
    }

    protected doUpdateSellIn() {
      this._sellIn--;
    }

    protected doUpdateQuality() {
      this._quality += this.intervalos.getValue(this._sellIn);
    }


    updateQuality() {
      this.doUpdateSellIn();
      this.doUpdateQuality();
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

export class BasicItem extends Item {
  constructor(name: string, sellIn: number, quality: number){ 
    super(name, sellIn, quality);

    this.intervalos.add(-1, 0);
    this.intervalos.add(-2, Number.NEGATIVE_INFINITY, -1);
  }
}

export class AgedBrieItem extends Item {
  constructor(sellIn: number, quality: number){ 
    super("Aged Brie", sellIn, quality);

    this.intervalos.add(1, 0);
    this.intervalos.add(2, Number.NEGATIVE_INFINITY, -1)
  }
}

export class SulfurasItem extends Item {
  constructor(sellIn: number, quality: number){ 
    super('Sulfuras, Hand of Ragnaros', sellIn, quality);
  }

  protected doUpdateSellIn() {
  }
}

export class BackstagePassesItem extends Item {
  constructor(sellIn: number, quality: number){ 
    super('Backstage passes to a TAFKAL80ETC concert', sellIn, quality);

    this.intervalos.add(1, 11);
    this.intervalos.add(2, 5, 10);
    this.intervalos.add(3, 0, 4);
    this.intervalos.add(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, -1);
  }
}
  

export class ConjuredItem extends Item {
  constructor(sellIn: number, quality: number){ 
    super('Conjured', sellIn, quality);

    this.intervalos.add(-2, 0);
    this.intervalos.add(-4, Number.NEGATIVE_INFINITY, -1);
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