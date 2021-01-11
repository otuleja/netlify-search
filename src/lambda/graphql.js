// const { gql, ApolloServer } = require("apollo-server");
const { ApolloServer, gql } = require("apollo-server-lambda");
// const middy = require("@middy/core");
// const cors = require("@middy/http-cors");
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  type Result {
    mean: Float
    stdDev: Float
  }
  type Query {
    books: [Book]
    gett(
      investments: Int
      rfr: Float
      irr: Float
      minInvestments: Float
      maxInvestments: Float
    ): Result
  }
`;

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const resolvers = {
  Query: {
    books: () => books,
    gett: (_, { investments, irr }, __, ___) => {
      console.log(investments);
      const numInvestmentsPerFund = investments;

      // const randn_bm = () => {
      //   var u = 0,
      //     v = 0;
      //   while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
      //   while (v === 0) v = Math.random();
      //   return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      // };
      const determineResultOfOneTrial = (bustPercentage, median, range) => {
        const takeSample = (m, r) => {
          const rand = Math.random();
          return rand * (2 * r) + (m - r);
        };
        const rand = Math.random();
        let result = 0;
        if (rand > bustPercentage) {
          result = takeSample(median, range);
        }
        return result;
      };
      const calculateNeededMedian = (bustPercentage, finalTarget) => {
        return finalTarget / (1 - bustPercentage);
      };
      const years = 5;
      const investment = 150;
      const target_irr = irr;
      const finalTarget = investment * Math.pow(1 + target_irr / 100, years);
      const std_deviation = finalTarget / 2;
      const bustPercentage = 0.2;
      const neededMedian = calculateNeededMedian(bustPercentage, finalTarget);
      // const run_trial = (std_dev, mean) => {
      //   const a = randn_bm();
      //   return a * std_dev + mean;
      // };
      const numTrials = 1000;
      let a = [];
      for (let i = 0; i < numTrials; i++) {
        let b = [];
        for (let n = 0; n < numInvestmentsPerFund; n++) {
          const result = determineResultOfOneTrial(
            bustPercentage,
            neededMedian,
            std_deviation
          );

          b.push(result);
        }
        a.push(b);
      }
      let arrayOfMeans = [];

      const calcMean = (array) => {
        let sum = 0;
        for (let n = 0; n < array.length; n++) {
          sum = sum + array[n];
        }
        return sum / array.length;
      };

      for (let i = 0; i < a.length; i++) {
        const mean = calcMean(a[i]);
        arrayOfMeans.push(mean);
      }

      const calculateAnnualReturn = (startingInvestment, endValue, years) => {
        const annualReturn =
          Math.pow(endValue / startingInvestment, 1 / years) - 1;
        return annualReturn;
      };
      let returns = [];
      for (let i = 0; i < arrayOfMeans.length; i++) {
        const annualReturn = calculateAnnualReturn(
          investment,
          arrayOfMeans[i],
          years
        );
        returns.push(annualReturn);
      }
      const getStandardDeviation = (array) => {
        const n = array.length;
        const mean = array.reduce((a, b) => a + b) / n;
        return Math.sqrt(
          array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
        );
      };
      console.log(returns.length);
      const abc = calcMean(returns);
      const def = getStandardDeviation(returns);
      return { mean: abc, stdDev: def };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();

// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });

// exports.graphqlHandler = server.createHandler({
//   cors: {
//     origin: true,
//     credentials: true,
//   },
// });

// exports.graphqlHandler = (event, context, callback) => {
//   // Do work to retrieve Product
//   // const product = retrieveProduct(event);

//   const response = {
//     statusCode: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Credentials": true,
//     },
//     body: JSON.stringify({
//       product: "heyyyyy",
//     }),
//   };

//   callback(null, response);
// };

// const myGraphQLSchema = makeExecutableSchema({
//   typeDefs: schema,
//   resolvers,
// });

// exports.graphqlHandler = function graphqlHandler(event, context, callback) {
//   function callbackWithHeaders(error, output) {
//     // eslint-disable-next-line no-param-reassign
//     output.headers["Access-Control-Allow-Origin"] = "*";
//     callback(error, output);
//   }

//   const handler = graphqlLambda({ schema: myGraphQLSchema });
//   return handler(event, context, callbackWithHeaders);
// };

// exports.graphqlHandler = server.createHandler({
//   cors: {
//     origin: "*",
//     methods: "POST",
//     allowedHeaders: ["Content-Type", "Origin", "Accept"],
//   },
// });

// exports.graphqlHandler = server.createHandler({
//   cors: {
//     origin: "https://search-fund-2.vercel.app",
//     credentials: true,
//   },
// });
// exports.graphqlHandler = function (event, context, callback) {
//   const callbackFilter = function (error, output) {
//     output.headers["Access-Control-Allow-Origin"] = "*";
//     callback(error, output);
//   };
//   server.graphqlLambda({ schema: myGraphQLSchema })(
//     event,
//     context,
//     callbackFilter
//   );
// };

// const a = (event, context, callback) => {
//   const handler = server.createHandler({
//     cors: {
//       // origin: "https://search-fund-2.vercel.app",
//       cors: "https://localhost:3000",
//       credentials: true,
//     },
//   });
//   const modifiedCallback = (error, output) => {
//     output.headers["Access-Control-Allow-Origin"] = "*";
//     output.headers["Access-Control-Allow-Credentials"] = true;
//     output.headers["Content-Type"] = "application/json";
//     callback(error, output);
//   };
//   //do we want this?
//   context.callbackWaitsForEmptyEventLoop = false;
//   return handler(event, context, modifiedCallback);
// };

// // exports.graphqlHandler = middy(a).use(cors());
// exports.graphqlHandler = a;
