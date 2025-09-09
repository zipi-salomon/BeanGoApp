
import { useState, useEffect } from "react";
import { fetchServer } from "../../service/server.js";
import { useUserContext } from "../../context/UserContext.jsx";
import AddUpdateUser from './AddUpdateUser.jsx';
import './adminUser.css';

const AdminUser = () => {
    const [refreshUsers,setRefreshUsers] = useState(true);
    const { user } = useUserContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    



    const handleStatusChange = async (userCheck, currentStatus) => {
        try {
            const response = await fetchServer('/users', { ...userCheck, is_active: !currentStatus }, 'PATCH', false);
            if (!response.ok) {
                throw new Error('Failed to update user status');
            }

            const updatedUser = await response.json();
            setUsers(users.map(u =>
                u.id === userCheck.id ? { ...u, is_active: !currentStatus } : u
            ));
        } catch (err) {
            console.error('Error updating user status:', err);
            setError('Failed to update user status. Please try again.');
            const fetchUsers = async () => {
                try {
                    const response = await fetchServer('/users');
                    if (!response.ok) {
                        throw new Error('Failed to refresh users');
                    }
                    const data = await response.json();
                    setUsers(data);
                } catch (refreshErr) {
                    console.error('Error refreshing users:', refreshErr);
                }
            };
            fetchUsers();
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchServer('/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to load users. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [refreshUsers]);

    const handleAddUser = () => {
        setSelectedUser(null);
        setShowAddModal(true);
    };
    const handleUpdateUser = (user) => {
        setSelectedUser(user);
        setShowUpdateModal(true);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="admin-users-container">
            <div className="users-table">
                <button onClick={handleAddUser}>הוספת מנהל➕</button>
                <table>
                    <thead>
                        <tr>
                            <th>שם משתמש</th>
                            <th>אימייל</th>
                            <th>תפקיד</th>
                            <th>סטטוס</th>
                            <th>עדכון</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="user-row">
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <label className="status-switch">
                                        <input
                                            type="checkbox"
                                            checked={!user.is_active}
                                            onChange={() => handleStatusChange(user, user.is_active)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </td>
                                <td>
                                    <button
                                        className="update-button"
                                        onClick={() => handleUpdateUser(user)}
                                    >
                                        עדכון
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* מודל לעדכון משתמש */}
            {showUpdateModal && selectedUser && (
                <AddUpdateUser
                    userToUpdate={selectedUser}
                    onClose={() => setShowUpdateModal(false)}
                    refresh={refreshUsers}
                    setRefresh={setRefreshUsers}
                />
            )}

            {/* מודל להוספת משתמש */}
            {showAddModal && (
                <AddUpdateUser
                    userToUpdate={null}
                    onClose={() => setShowAddModal(false)}
                    refresh={refreshUsers}
                    setRefresh={setRefreshUsers}
                />
            )}
        </div>
    );
};

export default AdminUser;