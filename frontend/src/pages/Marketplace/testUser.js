
const TEST_USER = { id: "bf18c04b-dd1c-45a4-b666-f4e964c70bc2", name: "Test User" };

export function getUser() {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : TEST_USER;
  } catch {
    return TEST_USER;
  }
}
