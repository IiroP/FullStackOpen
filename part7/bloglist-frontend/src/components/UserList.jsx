import Table from "react-bootstrap/Table";

export default function UserList({ users }) {
  return (
    <>
      <h3>Users</h3>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <a href={`/users/${user.id}`}>{user.name}</a>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
