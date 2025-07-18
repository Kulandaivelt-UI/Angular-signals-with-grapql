const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const fs = require('fs');

// Define GraphQL schema
const typeDefs = gql`
  input BookingInput {
    fid: Int!
    airline: String!
    flightNo: String!
    from: String!
    to: String!
    price: Int!
    duration: String!
    departureTime: String!
    departureDate: String!
    returnDate: String
    roundTrip: Boolean
    referenceId: String!
    fullName: String!
    email: String!
    contact: String!
    passengers: Int!
  }

  type BookingResponse {
    bookingId: String!
    confirmationStatus: String!
    fid: Int!
    airline: String!
    flightNo: String!
    from: String!
    to: String!
    price: Int!
    duration: String!
    departureTime: String!
    departureDate: String!
    returnDate: String
    roundTrip: Boolean
    referenceId: String!
    fullName: String!
    email: String!
    contact: String!
    passengers: Int!
  }

  type Query {
    hello: String
    getBookings: [BookingResponse]
    getBookingById(bookingId: String!): BookingResponse
  }

  type Mutation {
    createBooking(input: BookingInput!): BookingResponse
  }
`;

// File path for storing bookings
const filePath = '../public/bookings.json';

// Helper function to read bookings from file
function readBookings() {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    try {
      return JSON.parse(data || '[]');
    } catch (error) {
      console.error('❌ Error parsing bookings.json:', error.message);
      return [];
    }
  }
  return [];
}


// Helper function to write bookings to file
function writeBookings(bookings) {
  fs.writeFileSync(filePath, JSON.stringify(bookings, null, 2));
}

// Resolvers for queries and mutations
const resolvers = {
  Query: {
    hello: () => 'Local server is running!',
    getBookings: () => readBookings(),
    getBookingById: (_, { bookingId }) => {
      const bookings = readBookings();
      return bookings.find(b => b.bookingId === bookingId) || null;
    }
  },
  Mutation: {
    createBooking: (_, { input }) => {
      const booking = {
        bookingId: 'BOOK' + Math.floor(Math.random() * 100000),
        confirmationStatus: 'Confirmed',
        ...input
      };
      const bookings = readBookings();
      bookings.push(booking);
      writeBookings(bookings);

      console.log('📁 Booking saved to bookings.json');
      return booking;
    }
  }
};

// Start the server
async function startServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(4000, () => {
    console.log('🚀 GraphQL server running at http://localhost:4000/graphql');
  });
}

startServer();