// Local do arquivo: /client/src/components/UserList.tsx

interface User {
    id: string;
    username: string;
}

interface UserListProps {
    users: User[];
}

function UserList({ users }: UserListProps) {
    return (
        <aside className="sidebar">
            <h2>Usuários Online ({users.length})</h2>
            <ul className="user-list">
                {users.map((user) => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </aside>
    );
}

export default UserList;