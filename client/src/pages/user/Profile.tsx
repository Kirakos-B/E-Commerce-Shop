import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getMe,
  updateProfile,
  updatePassword,
} from "../../services/userService";
import Spinner from "../../components/shared/Spinner";
import { User, Lock, Ruler, CheckCircle } from "lucide-react";

type Tab = "profile" | "sizes" | "password";

const Profile = () => {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Profile fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");

  // Sizes
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [inseam, setInseam] = useState("");

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();
        setName(user.name || "");
        setPhone(user.phone || "");
        setStreet(user.address?.street || "");
        setCity(user.address?.city || "");
        setState(user.address?.state || "");
        setCountry(user.address?.country || "");
        setZip(user.address?.zip || "");
        setChest(String(user.sizes?.chest || ""));
        setWaist(String(user.sizes?.waist || ""));
        setHips(String(user.sizes?.hips || ""));
        setShoulder(String(user.sizes?.shoulder || ""));
        setInseam(String(user.sizes?.inseam || ""));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setError("");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name,
        phone,
        address: { street, city, state, country, zip },
      });
      showSuccess("Profile updated successfully!");
    } catch {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSizesUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        sizes: {
          chest: chest ? Number(chest) : undefined,
          waist: waist ? Number(waist) : undefined,
          hips: hips ? Number(hips) : undefined,
          shoulder: shoulder ? Number(shoulder) : undefined,
          inseam: inseam ? Number(inseam) : undefined,
        },
      });
      showSuccess("Sizes updated successfully!");
    } catch {
      setError("Failed to update sizes.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    setLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      showSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Failed to update password. Check your current password.");
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Profile", icon: <User size={16} /> },
    { key: "sizes", label: "My Sizes", icon: <Ruler size={16} /> },
    { key: "password", label: "Password", icon: <Lock size={16} /> },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold text-primary mb-2">
        My Profile
      </h1>
      <p className="text-primary/60 mb-8">Welcome back, {authUser?.name} 👋</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-secondary-dark">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setError("");
              setSuccess("");
            }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-primary/50 hover:text-primary"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4 border border-green-200 flex items-center gap-2">
          <CheckCircle size={16} /> {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
          {error}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileUpdate} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Phone
            </label>
            <input
              type="tel"
              className="input-field"
              placeholder="+251911000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="border-t border-secondary-dark pt-4">
            <h3 className="font-medium text-primary mb-3">Address</h3>
            <div className="space-y-3">
              <input
                type="text"
                className="input-field"
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  className="input-field"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="State / Region"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="ZIP / Postal Code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? <Spinner size="sm" /> : null}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      {/* Sizes Tab */}
      {activeTab === "sizes" && (
        <form onSubmit={handleSizesUpdate} className="card p-6 space-y-4">
          <p className="text-sm text-primary/60">
            Save your measurements for faster custom orders. All in cm.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Chest", value: chest, setter: setChest },
              { label: "Waist", value: waist, setter: setWaist },
              { label: "Hips", value: hips, setter: setHips },
              { label: "Shoulder", value: shoulder, setter: setShoulder },
              { label: "Inseam", value: inseam, setter: setInseam },
            ].map(({ label, value, setter }) => (
              <div key={label}>
                <label className="block text-sm font-medium text-primary mb-1">
                  {label} (cm)
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="0"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  min="0"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? <Spinner size="sm" /> : null}
            {loading ? "Saving..." : "Save Sizes"}
          </button>
        </form>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <form onSubmit={handlePasswordUpdate} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Current Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              New Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? <Spinner size="sm" /> : null}
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
