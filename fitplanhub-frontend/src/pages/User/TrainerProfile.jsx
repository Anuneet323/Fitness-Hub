// src/pages/User/TrainerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { followService, followUtils } from "../../services/followService";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Users,
  Dumbbell,
  MessageCircle,
  Star,
} from "lucide-react";

export default function TrainerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState(null);
  const [plans, setPlans] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [followPending, setFollowPending] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setApiError("");
      const data = await followService.getTrainerProfile(id);
      setTrainer(data.trainer);
      setPlans(data.plans || []);
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      setApiError("Failed to load trainer profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleToggleFollow = async () => {
    if (!trainer || followPending) return;
    setFollowPending(true);
    try {
      if (trainer.isFollowing) {
        await followService.unfollowUser(trainer._id);
        setTrainer((prev) =>
          prev
            ? {
                ...prev,
                isFollowing: false,
                stats: {
                  ...prev.stats,
                  followersCount: (prev.stats.followersCount || 1) - 1,
                },
              }
            : prev
        );
      } else {
        await followService.followUser(trainer._id);
        setTrainer((prev) =>
          prev
            ? {
                ...prev,
                isFollowing: true,
                stats: {
                  ...prev.stats,
                  followersCount: (prev.stats.followersCount || 0) + 1,
                },
              }
            : prev
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFollowPending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (apiError || !trainer) {
    return (
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{apiError || "Trainer not found."}</span>
        </div>
      </div>
    );
  }

  const followerText = followUtils.formatFollowerCount(
    trainer.stats?.followersCount || 0
  );

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* header */}
      <div className="rounded-2xl border border-orange-100 bg-white p-4 flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-orange-50 flex items-center justify-center text-sm font-semibold text-orange-600">
            {trainer.avatarUrl ? (
              <img
                src={trainer.avatarUrl}
                alt={trainer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              (trainer.name || "?")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-orange-500 mb-1">
              Trainer
            </p>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
              {trainer.name}
            </h1>
            {trainer.bio && (
              <p className="text-xs text-slate-600 mt-0.5">{trainer.bio}</p>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center md:justify-end gap-4">
          {/* stats */}
          <div className="flex gap-4 text-xs text-slate-600">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-slate-900">
                {trainer.stats?.plansCount || 0}
              </span>
              <span className="text-[11px]">Plans</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-slate-900">
                {followerText}
              </span>
              <span className="text-[11px]">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-slate-900">
                {trainer.stats?.followingCount || 0}
              </span>
              <span className="text-[11px]">Following</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleFollow}
            disabled={followPending}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full border ${
              trainer.isFollowing
                ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                : "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
            }`}
          >
            {trainer.isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      {/* main grid */}
      <div className="grid gap-4 md:grid-cols-[1.4fr,1fr]">
        {/* Plans */}
        <div className="rounded-2xl border border-orange-100 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-orange-500" />
              <h2 className="text-sm font-semibold text-slate-900">
                Popular plans
              </h2>
            </div>
            <Link
              to="/user-dashboard/plans"
              className="text-[11px] font-semibold text-orange-600 hover:text-orange-700"
            >
              View all plans
            </Link>
          </div>

          {plans.length === 0 ? (
            <p className="text-xs text-slate-500">
              This trainer has no public plans yet.
            </p>
          ) : (
            <div className="space-y-2">
              {plans.map((p) => (
                <Link
                  key={p._id}
                  to={`/user-dashboard/plans/${p._id}`}
                  className="flex gap-3 rounded-xl border border-orange-50 hover:border-orange-200 hover:bg-orange-50/40 p-2"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-orange-50 flex items-center justify-center">
                    {p.thumbnail ? (
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Dumbbell className="w-6 h-6 text-orange-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>
                        ₹{p.discountPrice || p.price}
                        {p.discountPrice && (
                          <span className="ml-1 line-through text-slate-400">
                            ₹{p.price}
                          </span>
                        )}
                      </span>
                      <span>·</span>
                      <span>{p.category}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                        {p.averageRating ? p.averageRating.toFixed(1) : "New"}
                      </span>
                      <span>·</span>
                      <span>{p.totalSubscribers || 0} enrolled</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Posts / Activity */}
        <div className="rounded-2xl border border-orange-100 bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-orange-500" />
            <h2 className="text-sm font-semibold text-slate-900">
              Recent posts
            </h2>
          </div>

          {posts.length === 0 ? (
            <p className="text-xs text-slate-500">
              No public posts from this trainer yet.
            </p>
          ) : (
            <div className="space-y-2">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="rounded-xl border border-orange-50 bg-orange-50/40 p-2 text-xs text-slate-700"
                >
                  <p className="line-clamp-3">{post.content}</p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{post.likesCount || 0} likes</span>
                    <span>·</span>
                    <span>{post.commentsCount || 0} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
