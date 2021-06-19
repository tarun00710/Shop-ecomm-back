const faker = require('faker')
faker.seed(123);

const productList= [...Array(30)].map((item) => ({
    name: faker.commerce.productName(),
    image: faker.random.image(),
    price: faker.commerce.price(),
    inStock: faker.datatype.boolean(),
    fastDelivery: faker.datatype.boolean(),
    material: faker.commerce.productMaterial(),
    brand: faker.lorem.word(),
    ratings: faker.random.arrayElement([1, 2, 3, 4, 5]),
    offer: faker.random.arrayElement([
      "Save 50",
      "70% bonanza",
      "Republic Day Sale"
    ]),
    idealFor: faker.random.arrayElement([
      "Men",
      "Women",
      "Girl",
      "Boy",
      "Senior"
    ]),
    level: faker.random.arrayElement([
      "beginner",
      "amateur",
      "intermediate",
      "advanced",
      "professional"
    ]),
  }));

module.exports={productList};