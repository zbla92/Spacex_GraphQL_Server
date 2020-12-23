const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
} = require('graphql');

// Launch Type
const LaunchType = new GraphQLObjectType({
  name: 'Launch',
  fields: () => ({
    flight_number: { type: GraphQLInt },
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    date_unix: { type: GraphQLInt },
    upcoming: { type: GraphQLBoolean },
    details: { type: GraphQLString },
    success: { type: GraphQLBoolean },
    rocket: { type: GraphQLString },
    cores: { type: GraphQLList(CoresType) },
    links: { type: LaunchFlightLinks },
  }),
});

// Cores Type
const CoresType = new GraphQLObjectType({
  name: 'Cores',
  fields: () => ({
    core: { type: GraphQLString },
    flight: { type: GraphQLInt },
    reused: { type: GraphQLBoolean },
    landing_attempt: { type: GraphQLBoolean },
    landing_success: { type: GraphQLBoolean },
  }),
});

// Rocket Type
const RocketType = new GraphQLObjectType({
  name: 'Rocket',
  fields: () => ({
    name: { type: GraphQLString },
    stages: { type: GraphQLInt },
    boosters: { type: GraphQLInt },
    cost_per_launch: { type: GraphQLInt },
    success_rate_pct: { type: GraphQLInt },
    description: { type: GraphQLString },
  }),
});

// Cores Type
const LaunchFlightLinks = new GraphQLObjectType({
  name: 'Links',
  fields: () => ({
    youtube_id: { type: GraphQLString },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    launches: {
      type: new GraphQLList(LaunchType),
      resolve(parent, qrgs) {
        return axios
          .get('https://api.spacexdata.com/v4/launches')
          .then((res) => res.data);
      },
    },
    launch: {
      type: LaunchType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parent, args) {
        return axios
          .get(`https://api.spacexdata.com/v4/launches/${args.id}`)
          .then((res) => res.data);
      },
    },
    rocket: {
      type: RocketType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return axios
          .get(`https://api.spacexdata.com/v4/rockets/${args.id}`)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery });
