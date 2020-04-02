// Principios SOLID 
// Open/Closed Principle (OCP)  --> Principio de Abierto/Cerrado
// Deberíamos ser capaces de extender/modificar el comportamiento de una clase sin modificar su código.


// Aplicamos este principio a la clase Item ya que cada vez que añadimos un nuevo tipo de Item nos
// vemos obligado a modificar su método "updateQuality()".

abstract class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name: string, sellIn: number, quality: number){
      this.name = name;
      this.sellIn = sellIn;
      this.quality = quality;
    }

    abstract updateQuality();
}

export class BasicItem extends Item {
  constructor(name: string, sellIn: number, quality: number){ 
    super(name, sellIn, quality);
  }

  updateQuality() {
    this.sellIn--; 

    if (this.sellIn >= 0) {
      if (this.quality > 0) {
        this.quality -= 1;
      }
    } else {
      if (this.quality > 1) {
        this.quality -= 2;
      } else {
        this.quality = 0;
      }
    }
  }
}

export class AgedBrieItem extends Item {
  constructor(sellIn: number, quality: number){ 
    super("Aged Brie", sellIn, quality);
  }

  updateQuality() {
    this.sellIn--;
   
    this.quality = Math.min(50,  this.quality + (this.sellIn>=0?1:2));
  }
}

export class SulfurasItem extends Item {
  constructor(sellIn: number, quality: number){ 
    super('Sulfuras, Hand of Ragnaros', sellIn, quality);
  }

  updateQuality() {
  }
}

export class BackstagePassesItem extends Item {
  constructor(sellIn: number, quality: number){ 
    super('Backstage passes to a TAFKAL80ETC concert', sellIn, quality);
  }

  updateQuality() {
    this.sellIn--;
    if (this.sellIn > 10) {
      this.quality = Math.min(50, this.quality+1);
    } else if (this.sellIn > 5) {
      this.quality = Math.min(50, this.quality+2);
    } else if (this.sellIn >= 0) {
      this.quality = Math.min(50, this.quality+3);
    } else {
      this.quality = 0;
    }

  }
}
  

export class ConjuredItem extends Item {
  constructor(sellIn: number, quality: number){ 
    super('Conjured', sellIn, quality);
  }

  updateQuality() {
    this.sellIn--;
    if (this.sellIn >= 0) {
      if (this.quality > 0) {
        this.quality -= 2;
      }
    } else {
      if (this.quality > 1) {
        this.quality -= 4;
      } else {
        this.quality = 0;
      }
    }

    this.quality = Math.max(0, Math.min(50, this.quality));
  }
}

class Shop {
   private items: Array<Item>;

    constructor(items: Array<Item>){
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