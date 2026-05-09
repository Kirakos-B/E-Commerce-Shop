import { useState, useEffect } from "react";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../../services/adminService";
import type { UserData } from "../../services/adminService";
import Spinner from "../../components/shared/Spinner";
import { Trash2, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, role: string) => {
    setUpdating(id);
    try {
      await updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">Users</h1>
        <p className="text-primary/60 mt-1">{users.length} registered users</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <Users size={48} className="mx-auto text-primary/20 mb-3" />
          <p className="text-primary/50">No users yet.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary border-b border-secondary-dark">
                <tr>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Role
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Joined
                  </th>
                  <th className="text-left px-6 py-3 text-primary/60 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-secondary-dark/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-secondary flex items-center justify-center font-bold text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-primary">
                          {user.name}
                        </span>
                        {user._id === currentUser?._id && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-primary/70">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        disabled={
                          updating === user._id || user._id === currentUser?._id
                        }
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="appearance-none bg-transparent border border-secondary-dark rounded-lg px-3 py-1.5 text-xs font-medium text-primary cursor-pointer hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-primary/60">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {user._id !== currentUser?._id && (
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
