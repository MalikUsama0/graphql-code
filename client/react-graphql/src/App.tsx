import { useQuery, gql } from "@apollo/client";

const query = gql`
  query GetData {
    getTodos {
      id
      title
      completed
      user {
        name
        email
      }
    }
  }
`;
function App() {
  const { data, loading, error } = useQuery(query);

  console.log(data, loading, error, "data form use query---");
  return (
    <>
      <h2>Hello here i am learning Graphql</h2>

      {loading && <h4>Loading ...</h4>}
      {/* {error && <h4>{error}</h4>} */}
      {data?.getTodos?.length > 0 &&
        data.getTodos.map((todo: any) => (
          <div>
            <h4>Title -- {todo.title}</h4>

            <h4>Creted By -- {todo.user.email}</h4>
          </div>
        ))}
    </>
  );
}

export default App;
