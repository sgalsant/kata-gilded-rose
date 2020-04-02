// Principios SOLID 
// Single Responsibility Principle (SRP) --> Principio de Responsabilidad Única
// Una clase debería tener uno y sólo un motivo para ser modificada. 
// La clase debe tener una única responsabilidad, objetivo

// Aplicamos este principio a la clase Shop. Quitamos de esta clase toda la lógica que tiene
// que ver con la modificación de sellIn y quality de cada tipo de item

class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name: string, sellIn: number, quality: number){
      this.name = name;
      this.sellIn = sellIn;
      this.quality = quality;
    }

    updateQuality() {
      if (this.name != 'Aged Brie' && this.name != 'Backstage passes to a TAFKAL80ETC concert') {
        if (this.quality > 0) {
          if (this.name != 'Sulfuras, Hand of Ragnaros') {
            this.quality = this.quality - 1;
          }
        }
      } else {
        if (this.quality < 50) {
          this.quality = this.quality + 1;
          if (this.name == 'Backstage passes to a TAFKAL80ETC concert') {
            if (this.sellIn < 11) {
              if (this.quality < 50) {
                this.quality = this.quality + 1;
              }
            }
            if (this.sellIn < 6) {
              if (this.quality < 50) {
                this.quality = this.quality + 1;
              }
            }
          }
        }
      }
      if (this.name != 'Sulfuras, Hand of Ragnaros') {
        this.sellIn = this.sellIn - 1;
      }
      if (this.sellIn < 0) {
        if (this.name != 'Aged Brie') {
          if (this.name != 'Backstage passes to a TAFKAL80ETC concert') {
            if (this.quality > 0) {
              if (this.name != 'Sulfuras, Hand of Ragnaros') {
                this.quality = this.quality - 1;
              }
            }
          } else {
            this.quality = this.quality - this.quality;
          }
        } else {
          if (this.quality < 50) {
            this.quality = this.quality + 1;
          }
        }
      }
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