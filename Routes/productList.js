const faker = require('faker')
faker.seed(123);

const productList= [...Array(30)].map((item) => ({
    name: faker.commerce.productName(),
    image: faker.random.image(),
    price: faker.commerce.price(),
    inStock: faker.datatype.boolean(),
    fastDelivery: faker.datatype.boolean(),
    level: faker.random.arrayElement([
      "beginner",
      "amateur",
      "intermediate",
      "advanced",
      "professional"
    ]),
  }));

module.exports={productList};