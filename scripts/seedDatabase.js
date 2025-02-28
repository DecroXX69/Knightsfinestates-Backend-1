// scripts/seedDatabase.js
const mongoose = require('mongoose');
const Property = require('../models/Property');
require('dotenv').config();

const sampleProperties = [
  {
    developer: "Binghatti",
    buildingName: "Binghatti Elite",
    price: 550000,
    location: "Dubai",
    area: "Dubai Marina",
    type: "sale",
    image: "https://res.cloudinary.com/dujrqtijj/image/upload/v1740465311/pexels-binyaminmellish-1396132_1_ykcotd.jpg",
    bedrooms: "2",
    propertyType: "Apartment",
    description: "Luxurious 2-bedroom apartment with stunning views of Dubai Marina.",
    images: [
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-pixabay-164558_dizvig.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-isabella-mendes-107313-1795507_clmljr.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475244/pexels-rickyrecap-2556003_k8amqa.jpg"
    ],
  },
  {
    developer: "Danube Properties",
    buildingName: "BAYZ 102",
    price: 1270000,
    location: "Dubai",
    area: "Business Bay",
    type: "offplan",
    image: "https://res.cloudinary.com/dujrqtijj/image/upload/v1740465311/pexels-binyaminmellish-186077_dhvqao.jpg",
    bedrooms: "3",
    propertyType: "Penthouse",
    description: "High-end penthouse in Business Bay with premium finishes.",
    images: [
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475244/pexels-christa-grover-977018-2121121_rkcp7d.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475244/pexels-atomlaborblog-1105754_eqkbyn.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475244/pexels-apasaric-618079_x8t4d7.jpg"
    ],
  },
  {
    developer: "Goel Ganga",
    buildingName: "Pyramid Axis",
    price: 975000,
    location: "Pune",
    area: "Wakad",
    type: "sale",
    image: "https://res.cloudinary.com/dujrqtijj/image/upload/v1740465312/pexels-pixabay-259588_fvnvdg.jpg",
    bedrooms: "1",
    propertyType: "Apartment",
    description: "Cozy 1-bedroom apartment in Downtown Dubai near major attractions.",
    images: [
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475243/pexels-alaric-sim-380461-1029172_fhp1oo.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475243/pexels-binyaminmellish-1396132_pbyxuz.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475243/pexels-walidphotoz-1372014_p4gsbr.jpg"
    ],
  },
  {
    developer: "Thailand Elite",
    buildingName: "Phuket Paradise",
    price: 450000,
    location: "Thailand",
    area: "Phuket",
    type: "sale",
    image: "https://res.cloudinary.com/dujrqtijj/image/upload/v1740465311/pexels-pixabay-164558_qual9v.jpg",
    bedrooms: "2",
    propertyType: "Villa",
    description: "Tropical 2-bedroom villa with private pool in Phuket.",
    images: [
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475243/pexels-madbyte-36362_tln5oc.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475242/pexels-rynocerontem-2072529_zs8zcm.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475242/pexels-pixabay-259588_gpfpjz.jpg"
    ],
  },
  {
    developer: "Bangkok Development",
    buildingName: "Sukhumvit Heights",
    price: 320000,
    location: "Bangkok",
    area: "Sukhumvit",
    type: "offplan",
    image: "https://res.cloudinary.com/dujrqtijj/image/upload/v1740465549/pexels-atomlaborblog-1105754_b26e0y.jpg",
    bedrooms: "1",
    propertyType: "Apartment",
    description: "Modern 1-bedroom apartment in the vibrant Sukhumvit district.",
    images: [
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475242/pexels-lucaspezeta-2212875_cymakg.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475242/pexels-expect-best-79873-323776_hftdwx.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475242/pexels-alexander-isreb-880417-1797393_vkjcsb.jpg"
    ],
  },
  {
    developer: "Goel Ganga 1",
    buildingName: "Axis Proxima",
    price: 550000,
    location: "Pune",
    area: "Wakad",
    type: "sale",
    image: "https://res.cloudinary.com/dujrqtijj/image/upload/v1740465311/pexels-binyaminmellish-1396132_1_ykcotd.jpg",
    bedrooms: "2",
    propertyType: "Apartment",
    description: "Luxurious 2-bedroom apartment with stunning views of Wakad Forests.",
    images: [
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-pixabay-164558_dizvig.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-isabella-mendes-107313-1795507_clmljr.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475244/pexels-rickyrecap-2556003_k8amqa.jpg"
    ],
  },
  {
    developer: "Goel Ganga 2",
    buildingName: "Axis Proxima",
    price: 550000,
    location: "Pune",
    area: "Wakad",
    type: "sale",
    image: "https://res.cloudinary.com/dujrqtijj/image/upload/v1740465311/pexels-binyaminmellish-1396132_1_ykcotd.jpg",
    bedrooms: "2",
    propertyType: "Apartment",
    description: "Luxurious 2-bedroom apartment with stunning views of Wakad Forests.",
    images: [
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-pixabay-164558_dizvig.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-isabella-mendes-107313-1795507_clmljr.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475244/pexels-rickyrecap-2556003_k8amqa.jpg"
    ],
  },
  {
    developer: "Goel Ganga 3",
    buildingName: "Axis Proxima",
    price: 550000,
    location: "Pune",
    area: "Wakad",
    type: "sale",
    image: "https://res.cloudinary.com/dujrqtijj/image/upload/v1740465311/pexels-binyaminmellish-1396132_1_ykcotd.jpg",
    bedrooms: "2",
    propertyType: "Apartment",
    description: "Luxurious 2-bedroom apartment with stunning views of Wakad Forests.",
    images: [
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-pixabay-164558_dizvig.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-isabella-mendes-107313-1795507_clmljr.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475244/pexels-rickyrecap-2556003_k8amqa.jpg"
    ],
  },
  {
    developer: "Goel Ganga 4",
    buildingName: "Axis Proxima",
    price: 550000,
    location: "Pune",
    area: "Wakad",
    type: "sale",
    image: "https://res.cloudinary.com/dujrqtijj/image/upload/v1740465311/pexels-binyaminmellish-1396132_1_ykcotd.jpg",
    bedrooms: "2",
    propertyType: "Apartment",
    description: "Luxurious 2-bedroom apartment with stunning views of Wakad Forests.",
    images: [
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-pixabay-164558_dizvig.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-isabella-mendes-107313-1795507_clmljr.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475244/pexels-rickyrecap-2556003_k8amqa.jpg"
    ],
  },
  {
    developer: "Goel Ganga 5",
    buildingName: "Axis Proxima",
    price: 550000,
    location: "Pune",
    area: "Wakad",
    type: "sale",
    image: "https://res.cloudinary.com/dujrqtijj/image/upload/v1740465311/pexels-binyaminmellish-1396132_1_ykcotd.jpg",
    bedrooms: "2",
    propertyType: "Apartment",
    description: "Luxurious 2-bedroom apartment with stunning views of Wakad Forests.",
    images: [
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-pixabay-164558_dizvig.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-isabella-mendes-107313-1795507_clmljr.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475244/pexels-rickyrecap-2556003_k8amqa.jpg"
    ],
  },
  {
    developer: "Goel Ganga 6",
    buildingName: "Axis Proxima",
    price: 550000,
    location: "Pune",
    area: "Wakad",
    type: "sale",
    image: "https://res.cloudinary.com/dujrqtijj/image/upload/v1740465311/pexels-binyaminmellish-1396132_1_ykcotd.jpg",
    bedrooms: "2",
    propertyType: "Apartment",
    description: "Luxurious 2-bedroom apartment with stunning views of Wakad Forests.",
    images: [
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-pixabay-164558_dizvig.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-isabella-mendes-107313-1795507_clmljr.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475244/pexels-rickyrecap-2556003_k8amqa.jpg"
    ],
  },
  {
    developer: "Greek Developers",
    buildingName: "Santorini View",
    price: 890000,
    location: "Greece",
    area: "Santorini",
    type: "sale",
    image: "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-enginakyurt-3656188_rimzei.jpg",
    bedrooms: "3",
    propertyType: "Villa",
    description: "Breathtaking 3-bedroom villa with Caldera views in Santorini.",
    images: [
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475242/pexels-binyaminmellish-186077_ue6tp3.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740465311/pexels-binyaminmellish-186077_dhvqao.jpg",
      "https://res.cloudinary.com/dujrqtijj/image/upload/v1740475245/pexels-pixabay-164558_dizvig.jpg"
    ],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    await Property.deleteMany({});
    console.log('Existing properties cleared');

    await Property.insertMany(sampleProperties);
    console.log('Sample properties seeded successfully');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();