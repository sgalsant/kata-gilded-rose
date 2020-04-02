import {Item, BasicItem, AgedBrieItem, BackstagePassesItem,Shop, 
    SulfurasItem, ConjuredItem} from '../dist/app3.js';

describe ('testing kata Gilded Rose', function() {
    it('Items degradan en 1 la calidad y la fecha de venta', function(){
        let items: Array<Item> = new Array<Item>();
        items.push(new BasicItem('paracetamal', 4, 10));

        let shop: Shop = new Shop(items);

        chai.assert.equal(items[0].sellIn, 4);
        chai.assert.equal(items[0].quality, 10);

        shop.updateQuality();

        chai.assert.equal(items[0].sellIn, 3);
        chai.assert.equal(items[0].quality, 9);
    });

    it('Cuando la fecha de venta ha pasado, la calidad degrada al doble de velocidad', function(){
        let items: Array<Item> = new Array<Item>();
        items.push(new BasicItem("item random", 0, 20));
        let shop: Shop = new Shop(items);
   
        chai.assert.equal(items[0].sellIn, 0);
        chai.assert.equal(items[0].quality, 20);        
        
        shop.updateQuality();

        chai.assert.equal(items[0].sellIn, -1);
        chai.assert.equal(items[0].quality, 18);
    });

    it('La calidad de un item no es nunca negativa', function(){
        let items: Array<Item> = new Array<Item>();
        items.push(new BasicItem("item random", 1, 0));
        let shop: Shop = new Shop(items);
   
        chai.assert.equal(items[0].sellIn, 1);
        chai.assert.equal(items[0].quality, 0);        
        
        shop.updateQuality();

        chai.assert.equal(items[0].sellIn, 0);
        chai.assert.equal(items[0].quality, 0);

        shop.updateQuality();

        chai.assert.equal(items[0].sellIn, -1);
        chai.assert.equal(items[0].quality, 0);
    });

    it('El item "aged brie" incrementa su calidad en lugar de decrementarla según pasan los días', function(){
        let items: Array<Item> = new Array<Item>();
        items.push(new AgedBrieItem(1, 30));
        let shop: Shop = new Shop(items);
     
        chai.assert.equal(items[0].sellIn, 1);
        chai.assert.equal(items[0].quality, 30);

        shop.updateQuality();

        chai.assert.equal(items[0].sellIn, 0);
        chai.assert.equal(items[0].quality, 31);

        shop.updateQuality();

        chai.assert.equal(items[0].sellIn, -1);
        chai.assert.equal(items[0].quality, 33);
    });

    it('La calidad de un item nunca es mayor de 50', function(){
        let items: Array<Item> = new Array<Item>();
        items.push(new AgedBrieItem(1, 50));
        let shop: Shop = new Shop(items);
     
        chai.assert.equal(items[0].sellIn, 1);
        chai.assert.equal(items[0].quality, 50);

        shop.updateQuality();

        chai.assert.equal(items[0].sellIn, 0);
        chai.assert.equal(items[0].quality, 50);

        shop.updateQuality();

        chai.assert.equal(items[0].sellIn, -1);
        chai.assert.equal(items[0].quality, 50);
    });

    it('El item "Sulfuras, Hand of Ragnaros” nunca debe venderse ni disminuye su calidad', function(){
        let items: Array<Item> = new Array<Item>();
        items.push(new SulfurasItem(10, 10));
        let shop: Shop = new Shop(items);
     
        chai.assert.equal(items[0].sellIn, 10);
        chai.assert.equal(items[0].quality, 10);
     
        shop.updateQuality();
     
        chai.assert.equal(items[0].sellIn, 10);
        chai.assert.equal(items[0].quality, 10);
    });

    describe ("Backstage passes to a TAFKAL80ETC concert", function() {
        let shop: Shop;
        let backstageItem: Item;
      
        this.beforeEach(function() {
            shop = null;
            backstageItem = null;
        })

        function addItem(sellIn: number, quality: number) {
            backstageItem =  new BackstagePassesItem(sellIn, quality);
            shop = new Shop([backstageItem]);

            chai.assert.equal(backstageItem.sellIn, sellIn);
            chai.assert.equal(backstageItem.quality, quality);

            return backstageItem;
        }

        it('Incrementa en 1 la calidad cuando los días para venta es mayor de 10', function(){
            addItem(12, 9);


            shop.updateQuality();

            chai.assert.equal(backstageItem.sellIn, 11);
            chai.assert.equal(backstageItem.quality, 10);
        });

        it('Calidad incrementa en 2 cuando quedan entre 6 y 10 días', function(){
            addItem(10, 10);

            let quality: number = backstageItem.quality;
            for (let i = 9; i>5; i--) {
                quality += 2;

                shop.updateQuality();
            
                chai.assert.equal(backstageItem.sellIn, i);
                chai.assert.equal(backstageItem.quality, quality, `día ${backstageItem.sellIn}`);
            } 
        });

        it('Calidad incrementa en 3 cuando quedan entre 0 y 5 días', function(){
            addItem(5, 10);

            let quality: number = backstageItem.quality;
            for (let i = 4; i>-1; i--) {
                quality += 3;

                shop.updateQuality();
            
                chai.assert.equal(backstageItem.sellIn, i);
                chai.assert.equal(backstageItem.quality, quality, `día ${backstageItem.sellIn}`);
            }
        });

        it('La calidad pasa a 0 después del concierto', function(){
            addItem(0, 10);

            for (let i = -1; i >-5; i--) {
                shop.updateQuality();
            
                chai.assert.equal(backstageItem.sellIn, i);
                chai.assert.equal(backstageItem.quality, 0, `día ${backstageItem.sellIn}`);
            }
        });

        it('La calidad no es superior a 50', function() {
            addItem(20, 50);
  
            while (backstageItem.sellIn>0) {
                shop.updateQuality();
                chai.assert.isAtMost(backstageItem.quality, 50);
            }
        })
    });
    
    describe ('conjured', function() {
        let shop: Shop;
        let conjuredItem: Item;
      
        this.beforeEach(function() {
            shop = null;
            conjuredItem = null;
        })

        function addItem(sellIn: number, quality: number) {
            conjuredItem =  new ConjuredItem(sellIn, quality);
            shop = new Shop([conjuredItem]);

            chai.assert.equal(conjuredItem.sellIn, sellIn);
            chai.assert.equal(conjuredItem.quality, quality);

            return conjuredItem;
        }

        it('disminuye por 2 mientras los días de venta sea positivo', function(){
            addItem(10, 10);
    
            let quality: number = conjuredItem.quality;
            while (conjuredItem.sellIn > 0) {
                quality = Math.max(0, quality-2);
                shop.updateQuality();

                chai.assert.equal(conjuredItem.quality, quality, `día ${conjuredItem.sellIn}`);
            }
        });

        it('disminuye por 4 mientras los días de venta sea negativo', function(){
            addItem(-1, 20);
    
            let quality: number = conjuredItem.quality;
            for (let i = -2; i>-20; i--) {
                quality = Math.max(0, quality-4);
                shop.updateQuality();

                chai.assert.equal(conjuredItem.quality, quality, `día ${conjuredItem.sellIn}`);
            }
        });
    }); 
})


//https://www.chaijs.com/api/assert/