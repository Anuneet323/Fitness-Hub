// src/pages/Trainer/CreatePost.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../../services/postService";
import { uploadService } from "../../services/uploadService";
import {
  MessageCircle,
  Image as ImageIcon,
  Video,
  Loader2,
  X,
} from "lucide-react";

export default function CreatePost() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("image"); // "image" | "video"
  const [hashtags, setHashtags] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setApiError("");
    setSuccess("");
    try {
      let res;
      if (type === "video") {
        res = await uploadService.uploadVideo(file);
      } else {
        res = await uploadService.uploadPostMedia(file);
      }
      const url = res.url || res.secureUrl || res.secure_url;
      if (!url) throw new Error("No URL returned from upload");
      setMediaUrl(url);
      setMediaType(type);
    } catch (err) {
      console.error(err);
      setApiError("Failed to upload media. Please try again.");
    } finally {
      setUploading(false);
      // reset input
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setApiError("Post content is required.");
      return;
    }
    setLoading(true);
    setApiError("");
    setSuccess("");
    try {
      const payload = {
        content: content.trim(),
        mediaUrls: mediaUrl ? [mediaUrl] : [],
        mediaType: mediaUrl ? mediaType : null,
        hashtags: hashtags
          ? hashtags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };
      await postService.createPost(payload);
      setSuccess("Post created successfully.");
      setContent("");
      setMediaUrl("");
      setHashtags("");
      setTimeout(() => {
        navigate("/trainer-dashboard/community");
      }, 800);
    } catch (err) {
      console.error(err);
      setApiError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Create a post
          </h1>
          <p className="text-sm text-slate-600">
            Share updates, tips, or progress with your followers.
          </p>
        </div>
      </div>

      {/* alerts */}
      {apiError && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {apiError}
        </div>
      )}
      {success && (
        <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-orange-100 bg-white p-4 space-y-4"
      >
        {/* content */}
        <div>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
            placeholder="Share a workout tip, progress update, or motivation..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setApiError("");
              setSuccess("");
            }}
            disabled={loading}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Min 1–2 sentences works best. Avoid sharing any private client data.
          </p>
        </div>

        {/* media upload */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-700">
            Attach media (optional)
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-300 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
              <ImageIcon className="w-4 h-4 text-orange-500" />
              <span>{uploading ? "Uploading..." : "Upload image"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(e, "image")}
                disabled={uploading || loading}
              />
            </label>

            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-300 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
              <Video className="w-4 h-4 text-orange-500" />
              <span>{uploading ? "Uploading..." : "Upload video"}</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleUpload(e, "video")}
                disabled={uploading || loading}
              />
            </label>
          </div>

          {mediaUrl && (
            <div className="relative mt-2 inline-block">
              {mediaType === "image" ? (
                <img
                  src={mediaUrl}
                  alt="Post media"
                  className="w-32 h-32 rounded-xl object-cover border border-slate-200"
                />
              ) : (
                <video
                  src={mediaUrl}
                  className="w-40 h-24 rounded-xl border border-slate-200"
                  controls
                />
              )}
              <button
                type="button"
                onClick={() => setMediaUrl("")}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900/90 text-white flex items-center justify-center text-[10px] shadow"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* hashtags */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Hashtags (optional)
          </label>
          <input
            type="text"
            placeholder="fatloss, mobility, strength"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/70"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            disabled={loading}
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Separate by comma. Example: <code>fatloss, hiit, core</code>
          </p>
        </div>

        {/* actions */}
        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-1.5 rounded-full border border-slate-200 text-xs text-slate-700 hover:bg-slate-50"
            disabled={loading || uploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full bg-orange-500 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-3 h-3 animate-spin text-white" />}
            <span>{loading ? "Posting..." : "Post"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
