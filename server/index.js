const express = require('express');
const {ApolloServer,AuthenticationError  } = require("@apollo/server");
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require("body-parser");
const cors = require("cors")
const axios = require('axios')

async function getTokenForRequests(req) {
    // Assuming the token is sent in the Authorization header as 'Bearer <token>'
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    console.log(token,'here is token in context')
    return null;
  }


async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs : ` #graphql
        type Todo {
        id : ID!
        title : String!
        completed : Boolean
        user:User
        }
        type User {
            name : String!
            username:String!
            email:String!
            phone:String!
        }
        type Query {
           getTodos : [Todo]
           getAllUsers : [User]
           getOneUser(id:ID!) : User
        }
        `,

        resolvers : {
            Todo : {
            user : async(todo)=>{ 
                
                return  (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data}
            },
            Query : {           
                    getTodos: async(_,args,context)=> { 
                        console.log(context)
                        console.log('here is todos function call')
                        return (await axios.get('https://jsonplaceholder.typicode.com/todos')).data},

                    getAllUsers  :async()=> (await axios.get('https://jsonplaceholder.typicode.com/users')).data,

                    getOneUser : async(parent,{id})=> (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
            }
        },
        formatError: (err) => {
            // Customize the error format
            return {
              message: err.message,
              code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
              // Optionally include more details
              details: err.extensions?.exception?.stacktrace,
            };
          },
       
    });

    app.use(cors());
    app.use(bodyParser.json());

    await server.start();
   
    app.use('/graphql', expressMiddleware(server,{
        context: async({req,res}) =>{
          let  token=  await getTokenForRequests(req);
          if (!token) {
            throw new Error('Authentication token is required');
          }
    
          return {token}
        }
    }));

    app.listen(8000, () => console.log('server is running on 8000 port'))
}

startServer()