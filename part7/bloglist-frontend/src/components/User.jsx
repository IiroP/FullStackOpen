import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";

export default function User({ user }) {
  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs:</h3>
      <Row>
        {user.blogs.map((blog) => (
          <Card key={blog.id} className="p-3 m-2" style={{ maxWidth: "300px" }}>
            {blog.title}
          </Card>
        ))}
      </Row>
    </div>
  );
}
