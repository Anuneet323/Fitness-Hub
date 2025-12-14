// src/pages/Account/Profile.jsx
import React, { useEffect, useState } from "react";
import { authService } from "../../services/authService";
import { uploadService } from "../../services/uploadService";
import { Loader2, AlertCircle, CheckCircle2, UploadCloud } from "lucide-react";

const initialState = {
  name: "",
  email: "",
  avatarUrl: "",
  coverImageUrl: "",
  bio: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  height: "",
  weight: "",
  fitnessGoal: "",
  certifications: "",
  experience: "",
  specializations: "",
  socialInstagram: "",
  socialYoutube: "",
  socialTwitter: "",
  socialWebsite: "",
  city: "",
  state: "",
  country: "",
};

export default function Profile() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setApiError("");
        const data = await authService.getProfile();
        const user = data.user || data;

        setFormData({
          name: user.name || "",
          email: user.email || "",
          avatarUrl: user.avatarUrl || "",
          coverImageUrl: user.coverImageUrl || "",
          bio: user.bio || "",
          phone: user.phone || "",
          dateOfBirth: user.dateOfBirth
            ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
            : "",
          gender: user.gender || "",
          height: user.height?.toString() || "",
          weight: user.weight?.toString() || "",
          fitnessGoal: user.fitnessGoal || "",
          certifications: Array.isArray(user.certifications)
            ? user.certifications.join(", ")
            : "",
          experience: user.experience?.toString() || "",
          specializations: Array.isArray(user.specializations)
            ? user.specializations.join(", ")
            : "",
          socialInstagram: user.socialLinks?.instagram || "",
          socialYoutube: user.socialLinks?.youtube || "",
          socialTwitter: user.socialLinks?.twitter || "",
          socialWebsite: user.socialLinks?.website || "",
          city: user.location?.city || "",
          state: user.location?.state || "",
          country: user.location?.country || "",
        });
      } catch (err) {
        console.error(err);
        setApiError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setApiError("");
    setSuccess("");
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setApiError("");
    setSuccess("");
    try {
      const res = await uploadService.uploadAvatar(file);
      const url = res.url || res.secureUrl || res.secure_url;
      if (!url) throw new Error("No URL returned from upload.");
      setFormData((prev) => ({ ...prev, avatarUrl: url }));
      // Persist immediately so navbar etc. update
      await authService.updateProfile({ avatarUrl: url });
      setSuccess("Avatar updated successfully.");
    } catch (err) {
      console.error("Avatar upload error:", err);
      setApiError("Failed to upload avatar. Please try again.");
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setApiError("");
    setSuccess("");

    // Build payload matching backend User model
    const payload = {
      name: formData.name.trim(),
      avatarUrl: formData.avatarUrl || undefined,
      coverImageUrl: formData.coverImageUrl || undefined,
      bio: formData.bio || undefined,
      phone: formData.phone || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      gender: formData.gender || undefined,
      height: formData.height ? Number(formData.height) : undefined,
      weight: formData.weight ? Number(formData.weight) : undefined,
      fitnessGoal: formData.fitnessGoal || undefined,
      certifications: formData.certifications
        ? formData.certifications
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [],
      experience: formData.experience ? Number(formData.experience) : undefined,
      specializations: formData.specializations
        ? formData.specializations
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      socialLinks: {
        instagram: formData.socialInstagram || undefined,
        youtube: formData.socialYoutube || undefined,
        twitter: formData.socialTwitter || undefined,
        website: formData.socialWebsite || undefined,
      },
      location: {
        city: formData.city || undefined,
        state: formData.state || undefined,
        country: formData.country || undefined,
      },
    };

    try {
      await authService.updateProfile(payload);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setApiError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-slate-900 mb-2">
        Account profile
      </h1>
      <p className="text-sm text-slate-600 mb-4">
        Update your personal details, fitness info, and social links.
      </p>

      {apiError && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span>{apiError}</span>
        </div>
      )}
      {success && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-orange-100 bg-white p-4 md:p-5"
      >
        {/* Avatar + basic */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-orange-50 flex items-center justify-center text-sm font-semibold text-orange-600">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={formData.name || "Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                (formData.name || "?")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              Profile picture
            </p>
            <p className="text-[11px] text-slate-500 mb-1">
              This appears in the navbar, community, and trainer listings.
            </p>
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-300 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
              <UploadCloud className="w-4 h-4 text-orange-500" />
              <span>
                {uploadingAvatar ? "Uploading..." : "Upload new avatar"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFile}
                disabled={uploadingAvatar || saving}
              />
            </label>
          </div>
        </div>

        {/* Name + email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Full name
            </label>
            <input
              type="text"
              name="name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              value={formData.name}
              onChange={handleChange}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
              value={formData.email}
              disabled
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Email cannot be changed here.
            </p>
          </div>
        </div>

        {/* Phone + DOB + gender */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              value={formData.phone}
              onChange={handleChange}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Date of birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">Gender</label>
            <select
              name="gender"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              value={formData.gender}
              onChange={handleChange}
              disabled={saving}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm text-slate-700 mb-1">Bio</label>
          <textarea
            name="bio"
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
            value={formData.bio}
            onChange={handleChange}
            disabled={saving}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Share a short introduction, your goals, or coaching style.
          </p>
        </div>

        {/* Fitness details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              value={formData.height}
              onChange={handleChange}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              value={formData.weight}
              onChange={handleChange}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Experience (years, if trainer)
            </label>
            <input
              type="number"
              name="experience"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              value={formData.experience}
              onChange={handleChange}
              disabled={saving}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-700 mb-1">
            Primary fitness goal
          </label>
          <input
            type="text"
            name="fitnessGoal"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
            value={formData.fitnessGoal}
            onChange={handleChange}
            disabled={saving}
          />
        </div>

        {/* Certifications & specializations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Certifications (comma-separated)
            </label>
            <input
              type="text"
              name="certifications"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              value={formData.certifications}
              onChange={handleChange}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Specializations (comma-separated)
            </label>
            <input
              type="text"
              name="specializations"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
              value={formData.specializations}
              onChange={handleChange}
              disabled={saving}
            />
          </div>
        </div>

        {/* Social links */}
        <div>
          <p className="text-sm font-medium text-slate-900 mb-1">
            Social links
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Instagram
              </label>
              <input
                type="url"
                name="socialInstagram"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
                value={formData.socialInstagram}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                YouTube
              </label>
              <input
                type="url"
                name="socialYoutube"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
                value={formData.socialYoutube}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Twitter
              </label>
              <input
                type="url"
                name="socialTwitter"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
                value={formData.socialTwitter}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Website
              </label>
              <input
                type="url"
                name="socialWebsite"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
                value={formData.socialWebsite}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <p className="text-sm font-medium text-slate-900 mb-1">Location</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-600 mb-1">City</label>
              <input
                type="text"
                name="city"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
                value={formData.city}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">State</label>
              <input
                type="text"
                name="state"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
                value={formData.state}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
                value={formData.country}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-orange-600 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
