import {Item, Shop, Intervalos} from '../dist/app6.js';

describe ('testing kata Gilded Rose', function() {
    function createBasicItem(name: string, sellIn: number, quality: number) {
        return new Item(name, sellIn, quality,
            new Intervalos([
                -1, 0, Number.POSITIVE_INFINITY,
                -2, Number.NEGATIVE_INFINITY, -1
            ]));
    }

    function createAgedBriedItem(sellIn: number, quality: number) {
        return new Item("aged bried", sellIn, quality,
            new Intervalos([
                1, 0, Number.POSITIVE_INFINITY,   // incrementa 1 desde 0 hasta infinito
                2, Number.NEGATIVE_INFINITY, -1    // incrementa 2 desde -infinito hasta -1
            ]));
    }

    function createSulfurasItem(sellIn: number, quality: number) {
        return new Item("sulfuras", sellIn, quality, 
            null, // no modificar quality
            0);  // no modificar sellIn
    }

    function createBackstageItem(sellIn: number, quality: number) {
        return new Item('Backstage', sellIn, quality,
            new Intervalos([
                1, 11, Number.POSITIVE_INFINITY,  // incrementa 1 desde 11 hasta infinito
                2, 5, 10,                         // incrementa 2 desde 5 hasta 10
                3, 0, 4,                          // incrementa 3 desde 0 hasta 4
                Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, -1  // resta todo (infinito) desde -infinito hasta -1
            ])); 
    }

    function createConjured(sellIn: number, quality: number) {
        return new Item('conjured', sellIn, quality,
            new Intervalos([
                -2, 0, Number.POSITIVE_INFINITY, // decrementa 2 desde 0 hata infinito
                -4, Number.NEGATIVE_INFINITY, -1 // decrementa 4 desde -infinito hasta -1
            ]));  
    }

    it('Items degradan en 1 la calidad y la fecha de venta', function(){
        let item: Item = createBasicItem('paracetamal', 4, 10);
        let shop: Shop = new Shop([item]);

        chai.assert.equal(item.sellIn, 4);
        chai.assert.equal(item.quality, 10);

        shop.updateQuality();

        chai.assert.equal(item.sellIn, 3);
        chai.assert.equal(item.quality, 9);
    });

    it('Cuando la fecha de venta ha pasado, la calidad degrada al doble de velocidad', function(){
        let item: Item = createBasicItem('paracetamal', 0, 20);
        let shop: Shop = new Shop([item]);
   
        chai.assert.equal(item.sellIn, 0);
        chai.assert.equal(item.quality, 20);        
        
        shop.updateQuality();

        chai.assert.equal(item.sellIn, -1);
        chai.assert.equal(item.quality, 18);
    });

    it('La calidad de un item no es nunca negativa', function(){
   
        let item: Item = createBasicItem('random', 1, 0);
        let shop: Shop = new Shop([item]);

        chai.assert.equal(item.sellIn, 1);
        chai.assert.equal(item.quality, 0);        
        
        shop.updateQuality();

        chai.assert.equal(item.sellIn, 0);
        chai.assert.equal(item.quality, 0);

        shop.updateQuality();

        chai.assert.equal(item.sellIn, -1);
        chai.assert.equal(item.quality, 0);
    });

    it('El item "aged brie" incrementa su calidad en lugar de decrementarla según pasan los días', function(){
        let item: Item = createAgedBriedItem(1, 30);
        let shop: Shop = new Shop([item]);
     
        chai.assert.equal(item.sellIn, 1);
        chai.assert.equal(item.quality, 30);

        shop.updateQuality();

        chai.assert.equal(item.sellIn, 0);
        chai.assert.equal(item.quality, 31);

        shop.updateQuality();

        chai.assert.equal(item.sellIn, -1);
        chai.assert.equal(item.quality, 33);
    });

    it('La calidad de un item nunca es mayor de 50', function(){
        let item: Item = createAgedBriedItem(1, 50);
        let shop: Shop = new Shop([item]);

        chai.assert.equal(item.sellIn, 1);
        chai.assert.equal(item.quality, 50);

        shop.updateQuality();

        chai.assert.equal(item.sellIn, 0);
        chai.assert.equal(item.quality, 50);

        shop.updateQuality();

        chai.assert.equal(item.sellIn, -1);
        chai.assert.equal(item.quality, 50);
    });

    it('El item "Sulfuras, Hand of Ragnaros” nunca debe venderse ni disminuye su calidad', function(){
        let item: Item = createSulfurasItem(10, 10);
        let shop: Shop = new Shop([item]);
     
        chai.assert.equal(item.sellIn, 10);
        chai.assert.equal(item.quality, 10);
     
        shop.updateQuality();
     
        chai.assert.equal(item.sellIn, 10);
        chai.assert.equal(item.quality, 10);
    });

    describe ("Backstage passes to a TAFKAL80ETC concert", function() {
        let shop: Shop;
        let backstageItem: Item;
      
        this.beforeEach(function() {
            shop = null;
            backstageItem = null;
        })

        function addItem(sellIn: number, quality: number) {
            backstageItem = createBackstageItem(sellIn, quality);

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
            conjuredItem =  createConjured(sellIn, quality);
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