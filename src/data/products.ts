export type ColorVariant = {
  name: string
  hex: string
}

export type Product = {
  id: string
  name: string
  category: 'Women' | 'Men' | 'Unisex'
  type: 'Tailoring' | 'Shirts' | 'Trousers' | 'Knitwear' | 'Outerwear' | 'Accessories' | 'Dresses'
  price: number
  oldPrice?: number
  color: string
  colorName: string
  colorVariants: ColorVariant[]
  sizes: string[]
  inStock: boolean
  stockCount: number
  image: string
  alternate: string
  gallery: string[]
  badge?: 'Bestseller' | 'New' | 'Archive' | 'Studio Exclusive'
  popularity: number
  description: string
  material: string
  details: string[]
  care: string[]
}

const unsplash = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const products: Product[] = [
  {
    id: '01',
    name: 'The Sculpted Wool Blazer',
    category: 'Women',
    type: 'Tailoring',
    price: 8990,
    color: '#B7AA99',
    colorName: 'Warm Stone',
    colorVariants: [
      { name: 'Warm Stone', hex: '#B7AA99' },
      { name: 'Ink Noir', hex: '#1C1B1A' },
      { name: 'Raw Chalk', hex: '#EBE7E0' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stockCount: 14,
    image: unsplash('photo-1591047139829-d91aecb6caea'),
    alternate: unsplash('photo-1539109136881-3be0616acf4b'),
    gallery: [
      unsplash('photo-1591047139829-d91aecb6caea'),
      unsplash('photo-1539109136881-3be0616acf4b'),
      unsplash('photo-1509631179647-0177331693ae'),
    ],
    badge: 'Bestseller',
    popularity: 98,
    description: 'A modern study in proportion and relaxed tailoring. Cut with a softly defined shoulder, a clean single-breasted closure, and generous interior welt pockets.',
    material: '92% Virgin Wool, 8% Cashmere. Lined in 100% Cupro.',
    details: [
      'Relaxed, single-breasted architectural silhouette',
      'Padded softly structured shoulders with natural drape',
      'Fully lined in breathable, anti-static cupro',
      'Double back vent for effortless fluidity',
    ],
    care: [
      'Dry clean only by specialized cleaner',
      'Steam gently from 15cm distance',
      'Store on structured broad wooden hanger',
    ],
  },
  {
    id: '02',
    name: 'Crisp Poplin Everyday Shirt',
    category: 'Unisex',
    type: 'Shirts',
    price: 4290,
    color: '#E8E4DC',
    colorName: 'Chalk White',
    colorVariants: [
      { name: 'Chalk White', hex: '#E8E4DC' },
      { name: 'Faded Oat', hex: '#D8D1C5' },
      { name: 'Charcoal Wash', hex: '#3E3B37' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 28,
    image: unsplash('photo-1598033129183-c4f50c736f10'),
    alternate: unsplash('photo-1603252109303-2751441dd157'),
    gallery: [
      unsplash('photo-1598033129183-c4f50c736f10'),
      unsplash('photo-1603252109303-2751441dd157'),
      unsplash('photo-1620799140408-edc6dcb6d633'),
    ],
    badge: 'Bestseller',
    popularity: 95,
    description: 'The foundation of everyday dressing. Cut from 120-yarn long-staple organic cotton poplin with a subtle matte handfeel and mother-of-pearl hardware.',
    material: '100% Certified Organic Long-Staple Cotton.',
    details: [
      'Clean point collar with concealed button tabs',
      'Natural Mother-of-Pearl buttons engraved in studio',
      'Gently dropped shoulders with back box pleat',
      'Extended curved hem designed for untucked or clean tuck',
    ],
    care: [
      'Machine wash gentle cycle at 30°C',
      'Hang dry in shade to maintain crisp fibers',
      'Warm iron while slightly damp',
    ],
  },
  {
    id: '03',
    name: 'Fluid High-Rise Wide Trouser',
    category: 'Women',
    type: 'Trousers',
    price: 6490,
    color: '#383632',
    colorName: 'Deep Espresso',
    colorVariants: [
      { name: 'Deep Espresso', hex: '#383632' },
      { name: 'Muted Sand', hex: '#C7BFB3' },
      { name: 'Jet Noir', hex: '#141414' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stockCount: 19,
    image: unsplash('photo-1594633312681-425c7b97ccd1'),
    alternate: unsplash('photo-1483985988355-763728e1935b'),
    gallery: [
      unsplash('photo-1594633312681-425c7b97ccd1'),
      unsplash('photo-1483985988355-763728e1935b'),
      unsplash('photo-1515886657613-9f3515b0c78f'),
    ],
    badge: 'New',
    popularity: 91,
    description: 'An elongated silhouette engineered for effortless movement. Featuring deep front knife pleats, side slash pockets, and an adjustable concealed waistband.',
    material: '70% Wool Gabardine, 30% Mulberry Silk.',
    details: [
      'Generous wide leg with tailored floor-skimming break',
      'Concealed horn button and zip fly closure',
      'Deep pressed forward creases',
      'Reinforced blind hem suitable for studio tailoring',
    ],
    care: [
      'Dry clean only',
      'Press with damp pressing cloth on reverse',
    ],
  },
  {
    id: '04',
    name: 'Fine Gauge Ribbed Knit Tank',
    category: 'Women',
    type: 'Knitwear',
    price: 2890,
    color: '#D9D2C8',
    colorName: 'Oat Milk',
    colorVariants: [
      { name: 'Oat Milk', hex: '#D9D2C8' },
      { name: 'Smoked Heather', hex: '#726D66' },
      { name: 'Ink Noir', hex: '#191919' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stockCount: 22,
    image: unsplash('photo-1551163943-3f6a855d1153'),
    alternate: unsplash('photo-1529139574466-a303027c1d8b'),
    gallery: [
      unsplash('photo-1551163943-3f6a855d1153'),
      unsplash('photo-1529139574466-a303027c1d8b'),
    ],
    popularity: 84,
    description: 'Close-fitting without feeling restrictive. Spun from an ultra-soft organic silk and pima cotton yarn with subtle horizontal micro-ribbing.',
    material: '55% Silk, 45% Organic Pima Cotton.',
    details: [
      'Engineered wide scoop neckline that flatters the collarbone',
      'Clean seamless tubular hem construction',
      'Exceptional memory retention that prevents bagging',
    ],
    care: [
      'Hand wash cold with gentle wool detergent',
      'Do not wring; roll in towel to dry flat',
    ],
  },
  {
    id: '05',
    name: 'Double-Faced Relaxed Wool Coat',
    category: 'Men',
    type: 'Outerwear',
    price: 14990,
    color: '#79736A',
    colorName: 'Marl Grey',
    colorVariants: [
      { name: 'Marl Grey', hex: '#79736A' },
      { name: 'Raw Camel', hex: '#B89B77' },
      { name: 'Midnight Charcoal', hex: '#262524' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 8,
    image: unsplash('photo-1539533018447-63fcce2678e3'),
    alternate: unsplash('photo-1515886657613-9f3515b0c78f'),
    gallery: [
      unsplash('photo-1539533018447-63fcce2678e3'),
      unsplash('photo-1515886657613-9f3515b0c78f'),
      unsplash('photo-1509631179647-0177331693ae'),
    ],
    badge: 'Studio Exclusive',
    popularity: 96,
    description: 'A monument of minimalist outerwear. Hand-finished double-faced virgin wool unlined for fluid drape and total weightlessness without sacrificing warmth.',
    material: '100% Virgin Australian Merino Wool (900gsm double-face).',
    details: [
      'Unstructured raglan sleeve allowing effortless layering over tailoring',
      'Generous storm collar with throat latch',
      'Hand-stitched perimeter seams and welt pockets',
      'Deep back vent with internal button tab',
    ],
    care: [
      'Specialist dry clean only',
      'Air out naturally after outdoor wear',
    ],
  },
  {
    id: '06',
    name: 'Minimalist Oxford Overshirt',
    category: 'Men',
    type: 'Shirts',
    price: 4590,
    color: '#D6D3CD',
    colorName: 'Soft White',
    colorVariants: [
      { name: 'Soft White', hex: '#D6D3CD' },
      { name: 'Washed Slate', hex: '#585C63' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 17,
    image: unsplash('photo-1603252109303-2751441dd157'),
    alternate: unsplash('photo-1598033129183-c4f50c736f10'),
    gallery: [
      unsplash('photo-1603252109303-2751441dd157'),
      unsplash('photo-1598033129183-c4f50c736f10'),
    ],
    popularity: 88,
    description: 'An architectural reinterpretation of the classic oxford cloth button down. Features a clean stand collar, hidden button placket, and deep patch pockets.',
    material: '100% Heavyweight Japanese Oxford Cotton.',
    details: [
      'Concealed matte horn button placket',
      'Twin minimalist chest utility pockets',
      'Squared cuffs with adjustable double buttons',
      'Straight boxy hem with side vent gussets',
    ],
    care: [
      'Machine wash cold at 30°C',
      'Warm iron inside out',
    ],
  },
  {
    id: '07',
    name: 'Pebbled Grain Soft Carryall Tote',
    category: 'Unisex',
    type: 'Accessories',
    price: 5490,
    color: '#51473D',
    colorName: 'Dark Walnut',
    colorVariants: [
      { name: 'Dark Walnut', hex: '#51473D' },
      { name: 'Onyx Noir', hex: '#121212' },
      { name: 'Warm Taupe', hex: '#A89F94' },
    ],
    sizes: ['One size'],
    inStock: true,
    stockCount: 15,
    image: unsplash('photo-1590874103328-eac38a683ce7'),
    alternate: unsplash('photo-1584917865442-de89df76afd3'),
    gallery: [
      unsplash('photo-1590874103328-eac38a683ce7'),
      unsplash('photo-1584917865442-de89df76afd3'),
    ],
    badge: 'Bestseller',
    popularity: 93,
    description: 'Engineered for seamless daily transition from studio to transit. Accommodates up to a 16-inch laptop with dedicated padded sleeve and magnetic quick-release.',
    material: '100% Full-grain vegetable tanned Italian leather, canvas lining.',
    details: [
      'Solid brass brushed hardware with palladium finish',
      'Reinforced dual shoulder straps with 26cm drop',
      'Internal zippered security pocket & dual phone slots',
      'Debossed subtle studio coordinates on interior flap',
    ],
    care: [
      'Wipe clean with soft damp cloth',
      'Condition twice annually with natural beeswax balm',
    ],
  },
  {
    id: '08',
    name: 'Extra-Fine Merino Crewneck',
    category: 'Men',
    type: 'Knitwear',
    price: 6990,
    oldPrice: 8490,
    color: '#D5CABC',
    colorName: 'Natural Sand',
    colorVariants: [
      { name: 'Natural Sand', hex: '#D5CABC' },
      { name: 'Charcoal Marl', hex: '#3C3A37' },
      { name: 'Raw Pine', hex: '#2F3831' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 11,
    image: unsplash('photo-1576566588028-4147f3842f27'),
    alternate: unsplash('photo-1618354691373-d851c5c3a990'),
    gallery: [
      unsplash('photo-1576566588028-4147f3842f27'),
      unsplash('photo-1618354691373-d851c5c3a990'),
    ],
    badge: 'Archive',
    popularity: 89,
    description: 'Spun from 19.5 micron extra-fine Italian merino wool in a lightweight 14-gauge knit. Breathable thermoregulation suitable for all four seasons.',
    material: '100% Extra-Fine Italian Merino Wool.',
    details: [
      'Seamless fully-fashioned knit construction at armholes',
      '2x2 micro-ribbed cuffs and neck trim',
      'Natural odor resistance and temperature regulating',
    ],
    care: [
      'Hand wash cold in wool wash',
      'Dry flat away from direct sunlight',
    ],
  },
  {
    id: '09',
    name: 'Architectural Pleated Midi Dress',
    category: 'Women',
    type: 'Dresses',
    price: 9490,
    color: '#E0DDD7',
    colorName: 'Pale Alabaster',
    colorVariants: [
      { name: 'Pale Alabaster', hex: '#E0DDD7' },
      { name: 'Pure Ink', hex: '#161616' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stockCount: 10,
    image: unsplash('photo-1490481651871-ab68de25d43d'),
    alternate: unsplash('photo-1539109136881-3be0616acf4b'),
    gallery: [
      unsplash('photo-1490481651871-ab68de25d43d'),
      unsplash('photo-1539109136881-3be0616acf4b'),
    ],
    badge: 'New',
    popularity: 94,
    description: 'An elegant study in minimalist eveningwear. Features permanent accordion pleating that drapes softly from a high boat neckline to an asymmetric calf-grazing hem.',
    material: '100% Recycled Technical Chiffon with Silk Touch.',
    details: [
      'High sculptural boat neckline with clean self-binding',
      'Permanently set knife pleats that maintain structure',
      'Removable belt in matching tonal fabric',
      'Invisible side zip closure with hook-and-eye',
    ],
    care: [
      'Hand wash cold or dry clean',
      'Do not steam or press pleats directly',
    ],
  },
  {
    id: '10',
    name: 'Tailored Pleat-Front Tapered Pant',
    category: 'Men',
    type: 'Trousers',
    price: 5990,
    color: '#423F3C',
    colorName: 'Ash Black',
    colorVariants: [
      { name: 'Ash Black', hex: '#423F3C' },
      { name: 'Stone Khaki', hex: '#A89F93' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 16,
    image: unsplash('photo-1479064555552-3ef4979f8908'),
    alternate: unsplash('photo-1507679799987-c73779587ccf'),
    gallery: [
      unsplash('photo-1479064555552-3ef4979f8908'),
      unsplash('photo-1507679799987-c73779587ccf'),
    ],
    popularity: 87,
    description: 'Engineered for relaxed formal balance. Generous across the thigh before tapering sharply towards a clean ankle break with subtle cuff fold.',
    material: '98% Cotton Twill, 2% Elastane for natural movement.',
    details: [
      'Single forward pleats for room through seat and thigh',
      'Concealed extension waistband with side buckled adjusters',
      'Rear welt pockets with horn buttons',
    ],
    care: [
      'Wash inside out at 30°C',
      'Hang to dry immediately after wash',
    ],
  },
  {
    id: '11',
    name: 'Brushed Alpaca Cocoon Cardigan',
    category: 'Women',
    type: 'Knitwear',
    price: 8490,
    color: '#CEBEAE',
    colorName: 'Warm Camel',
    colorVariants: [
      { name: 'Warm Camel', hex: '#CEBEAE' },
      { name: 'Heather Stone', hex: '#9E978F' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stockCount: 9,
    image: unsplash('photo-1434389677669-e08b4cac3105'),
    alternate: unsplash('photo-1515886657613-9f3515b0c78f'),
    gallery: [
      unsplash('photo-1434389677669-e08b4cac3105'),
      unsplash('photo-1515886657613-9f3515b0c78f'),
    ],
    badge: 'New',
    popularity: 90,
    description: 'A cloud-like silhouette knitted in a luxurious hairy alpaca blend. Dropped cocoon shoulders and deep front welt pockets offer casual warmth.',
    material: '60% Baby Alpaca, 28% Recycled Polyamide, 12% Wool.',
    details: [
      'Deep V-neckline framed with 4 large tonal horn buttons',
      'Fluffy, brushed textural surface with lofty volume',
      'Dropped shoulder cocoon silhouette',
    ],
    care: [
      'Gently hand wash in cold water with wool balm',
      'Lay flat on clean towel to dry',
    ],
  },
  {
    id: '12',
    name: 'Minimalist Leather Studio Cardholder',
    category: 'Unisex',
    type: 'Accessories',
    price: 1990,
    color: '#21201E',
    colorName: 'Onyx Noir',
    colorVariants: [
      { name: 'Onyx Noir', hex: '#21201E' },
      { name: 'Saddle Tan', hex: '#87532B' },
    ],
    sizes: ['One size'],
    inStock: true,
    stockCount: 35,
    image: unsplash('photo-1627123424574-724758594e93'),
    alternate: unsplash('photo-1590874103328-eac38a683ce7'),
    gallery: [
      unsplash('photo-1627123424574-724758594e93'),
      unsplash('photo-1590874103328-eac38a683ce7'),
    ],
    popularity: 92,
    description: 'The essence of pure utility. Four outer card slots flanking a central pocket for folded currency, finished with hand-painted edges and blind debossed logo.',
    material: '100% Vegetable-tanned bridle leather.',
    details: [
      'Four quick-access diagonal card slots',
      'Central lined compartment for banknotes',
      'Hand-beveled and burnished wax edges',
      'Slim 4mm silhouette that disappears in your pocket',
    ],
    care: [
      'Keep away from extreme moisture',
      'Develops a rich personal patina with daily handling',
    ],
  },
]

export const money = (amount: number, currency: 'INR' | 'USD' | 'EUR' = 'INR') => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(Math.round(amount / 85))
  }
  if (currency === 'EUR') {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(Math.round(amount / 92))
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
