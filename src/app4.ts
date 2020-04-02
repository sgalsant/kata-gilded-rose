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

abstract class Item implements IItem {
    protected _name: string;
    protected _sellIn: number;
    protected _quality: number;

    constructor(name: string, sellIn: number, quality: number){
      this._name = name;
      this._sellIn = sellIn;
      this._quality = quality;
    }

    protected doUpdateSellIn() {
      this._sellIn--;
    }

    protected abstract doUpdateQuality();


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
  }

  protected doUpdateQuality() {
    if (this.sellIn >= 0) {
        this._quality -= 1;
    } else {
        this._quality -= 2;
    }
  }
}

export class AgedBrieItem extends Item {
  constructor(sellIn: number, quality: number){ 
    super("Aged Brie", sellIn, quality);
  }

  protected doUpdateQuality() { 
    this._quality += this.sellIn>=0?1:2;
  }
}

export class SulfurasItem extends Item {
  constructor(sellIn: number, quality: number){ 
    super('Sulfuras, Hand of Ragnaros', sellIn, quality);
  }

  protected doUpdateSellIn() {
  }

  protected doUpdateQuality() {
  }
}

export class BackstagePassesItem extends Item {
  constructor(sellIn: number, quality: number){ 
    super('Backstage passes to a TAFKAL80ETC concert', sellIn, quality);
  }

  protected doUpdateQuality() {
    if (this.sellIn > 10) {
      this._quality += 1;
    } else if (this.sellIn > 5) {
      this._quality += 2;
    } else if (this.sellIn >= 0) {
      this._quality += 3;
    } else {
      this._quality = 0;
    }
  }
}
  

export class ConjuredItem extends Item {
  constructor(sellIn: number, quality: number){ 
    super('Conjured', sellIn, quality);
  }

  protected doUpdateQuality() {
    if (this._sellIn >= 0) {
      this._quality -= 2;
    } else {
      this._quality -= 4;
    }
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