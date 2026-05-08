import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createCustomOrder } from "../../services/customOrderService";
import Spinner from "../../components/shared/Spinner";
import { CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";

type FabricType =
  | "cotton"
  | "silk"
  | "wool"
  | "linen"
  | "polyester"
  | "blend"
  | "other";

const fabrics: { value: FabricType; label: string; emoji: string }[] = [
  { value: "cotton", label: "Cotton", emoji: "🌿" },
  { value: "silk", label: "Silk", emoji: "✨" },
  { value: "wool", label: "Wool", emoji: "🐑" },
  { value: "linen", label: "Linen", emoji: "🌾" },
  { value: "polyester", label: "Polyester", emoji: "🧪" },
  { value: "blend", label: "Blend", emoji: "🔀" },
  { value: "other", label: "Other", emoji: "📦" },
];

const steps = ["Design", "Measurements", "Review"];

const CustomOrder = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 — Design
  const [designDescription, setDesignDescription] = useState("");
  const [fabric, setFabric] = useState<FabricType>("cotton");
  const [color, setColor] = useState("");

  // Step 2 — Measurements
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [inseam, setInseam] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [measureNotes, setMeasureNotes] = useState("");

  // Guest info
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const canProceedStep1 = designDescription.trim() && color.trim();

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        designDescription,
        fabric,
        color,
        measurements: {
          chest: chest ? Number(chest) : undefined,
          waist: waist ? Number(waist) : undefined,
          hips: hips ? Number(hips) : undefined,
          shoulder: shoulder ? Number(shoulder) : undefined,
          inseam: inseam ? Number(inseam) : undefined,
          height: height ? Number(height) : undefined,
          weight: weight ? Number(weight) : undefined,
          notes: measureNotes || undefined,
        },
        guestInfo: !isAuthenticated
          ? { name: guestName, email: guestEmail, phone: guestPhone }
          : undefined,
      };

      const order = await createCustomOrder(payload);
      navigate(`/custom-order/confirmation/${order._id}`);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to submit order. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-primary mb-2">
          Custom Order ✂️
        </h1>
        <p className="text-primary/60">
          Tell us your vision — we'll bring it to life
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-10">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  i < currentStep
                    ? "bg-green-500 text-white"
                    : i === currentStep
                      ? "bg-primary text-secondary"
                      : "bg-secondary-dark text-primary/40"
                }`}
              >
                {i < currentStep ? <CheckCircle size={20} /> : i + 1}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  i === currentStep ? "text-primary" : "text-primary/40"
                }`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-2 mb-4 transition-colors ${
                  i < currentStep ? "bg-green-500" : "bg-secondary-dark"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card p-8">
          {/* ── Step 1: Design ── */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-primary">
                Describe Your Design
              </h2>

              {/* Guest info if not logged in */}
              {!isAuthenticated && (
                <div className="bg-secondary rounded-xl p-4 space-y-4 border border-secondary-dark">
                  <p className="text-sm font-medium text-primary">
                    Your Contact Information
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-primary/70 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-primary/70 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="input-field"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-primary/70 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="input-field"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Design Description */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Design Description
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <textarea
                  className="input-field resize-none h-32"
                  placeholder="Describe your design in detail — style, occasion, any specific requirements..."
                  value={designDescription}
                  onChange={(e) => setDesignDescription(e.target.value)}
                  required
                />
              </div>

              {/* Fabric */}
              <div>
                <label className="block text-sm font-medium text-primary mb-3">
                  Fabric Type
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {fabrics.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setFabric(f.value)}
                      className={`p-3 rounded-xl border-2 text-center transition-colors ${
                        fabric === f.value
                          ? "border-primary bg-primary text-secondary"
                          : "border-secondary-dark text-primary hover:border-primary"
                      }`}
                    >
                      <div className="text-2xl mb-1">{f.emoji}</div>
                      <div className="text-xs font-medium">{f.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Preferred Color / Pattern
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Navy blue, Black with gold trim, Floral pattern..."
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Measurements ── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">
                  Your Measurements
                </h2>
                <p className="text-primary/60 text-sm mt-1">
                  All measurements in centimeters (cm). Leave blank if unknown.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Chest",
                    value: chest,
                    setter: setChest,
                    placeholder: "e.g. 98",
                  },
                  {
                    label: "Waist",
                    value: waist,
                    setter: setWaist,
                    placeholder: "e.g. 82",
                  },
                  {
                    label: "Hips",
                    value: hips,
                    setter: setHips,
                    placeholder: "e.g. 96",
                  },
                  {
                    label: "Shoulder",
                    value: shoulder,
                    setter: setShoulder,
                    placeholder: "e.g. 44",
                  },
                  {
                    label: "Inseam",
                    value: inseam,
                    setter: setInseam,
                    placeholder: "e.g. 78",
                  },
                  {
                    label: "Height",
                    value: height,
                    setter: setHeight,
                    placeholder: "e.g. 175",
                  },
                ].map(({ label, value, setter, placeholder }) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-primary mb-1">
                      {label} (cm)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      min="0"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 72"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Additional Notes
                </label>
                <textarea
                  className="input-field resize-none h-24"
                  placeholder="Any other measurement notes or body-specific requirements..."
                  value={measureNotes}
                  onChange={(e) => setMeasureNotes(e.target.value)}
                />
              </div>

              {/* Measurement guide tip */}
              <div className="bg-secondary rounded-xl p-4 border border-secondary-dark">
                <p className="text-sm font-medium text-primary mb-1">
                  📏 How to measure?
                </p>
                <p className="text-xs text-primary/60 leading-relaxed">
                  Use a soft measuring tape. Chest: measure around the fullest
                  part. Waist: measure around the narrowest part. Hips: measure
                  around the fullest part. Shoulder: measure from shoulder tip
                  to tip across the back.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 3: Review ── */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-primary">
                Review Your Order
              </h2>

              {/* Design Summary */}
              <div className="bg-secondary rounded-xl p-5 border border-secondary-dark space-y-3">
                <h3 className="font-semibold text-primary text-sm uppercase tracking-wider">
                  Design Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-primary/50">Description</p>
                    <p className="text-primary font-medium">
                      {designDescription}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary/50">Fabric</p>
                    <p className="text-primary font-medium capitalize">
                      {fabric}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary/50">Color / Pattern</p>
                    <p className="text-primary font-medium">{color}</p>
                  </div>
                </div>
              </div>

              {/* Measurements Summary */}
              <div className="bg-secondary rounded-xl p-5 border border-secondary-dark space-y-3">
                <h3 className="font-semibold text-primary text-sm uppercase tracking-wider">
                  Measurements
                </h3>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  {[
                    { label: "Chest", value: chest },
                    { label: "Waist", value: waist },
                    { label: "Hips", value: hips },
                    { label: "Shoulder", value: shoulder },
                    { label: "Inseam", value: inseam },
                    { label: "Height", value: height },
                    { label: "Weight", value: weight },
                  ]
                    .filter((m) => m.value)
                    .map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-primary/50">{label}</p>
                        <p className="text-primary font-medium">{value} cm</p>
                      </div>
                    ))}
                  {!chest &&
                    !waist &&
                    !hips &&
                    !shoulder &&
                    !inseam &&
                    !height &&
                    !weight && (
                      <p className="text-primary/40 text-sm col-span-3">
                        No measurements provided
                      </p>
                    )}
                </div>
                {measureNotes && (
                  <div className="text-sm">
                    <p className="text-primary/50">Notes</p>
                    <p className="text-primary">{measureNotes}</p>
                  </div>
                )}
              </div>

              {/* Contact Summary */}
              <div className="bg-secondary rounded-xl p-5 border border-secondary-dark space-y-2">
                <h3 className="font-semibold text-primary text-sm uppercase tracking-wider">
                  Contact
                </h3>
                {isAuthenticated ? (
                  <p className="text-sm text-primary">
                    Ordering as{" "}
                    <span className="font-medium">{user?.name}</span> (
                    {user?.email})
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-primary/50">Name</p>
                      <p className="text-primary font-medium">{guestName}</p>
                    </div>
                    <div>
                      <p className="text-primary/50">Email</p>
                      <p className="text-primary font-medium">{guestEmail}</p>
                    </div>
                    <div>
                      <p className="text-primary/50">Phone</p>
                      <p className="text-primary font-medium">{guestPhone}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notice */}
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 text-sm text-primary/70">
                <p>
                  🎯 After submitting, our team will review your order and
                  contact you with an estimated price and delivery date within
                  24–48 hours.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-secondary-dark">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="btn-secondary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} /> Back
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={currentStep === 0 && !canProceedStep1}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? <Spinner size="sm" /> : null}
                {loading ? "Submitting..." : "Submit Order ✂️"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomOrder;
