// src/pages/User/TrainersBrowse.jsx
import React, { useEffect, useState } from "react";
import { followService, followUtils } from "../../services/followService";
import {
  Loader2,
  AlertCircle,
  Search,
  Users,
  MapPin,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TrainersBrowse() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [search, setSearch] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [sortBy, setSortBy] = useState("followers");

  const load = async (opts = {}) => {
    try {
      setLoading(true);
      setApiError("");

      const params = {
        sortBy,
      };
      if (search) params.search = search;
      if (filterSpecialization) params.specialization = filterSpecialization;

      const data = await followService.getAllTrainers({
        ...params,
        ...opts,
      });

      setTrainers(data.trainers || []);
    } catch (err) {
      console.error(err);
      setApiError("Failed to load trainers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="space-y-4">
      {/* header + filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Browse trainers
          </h1>
          <p className="text-sm text-slate-600">
            Find coaches to follow and subscribe to their plans.
          </p>
        </div>
      </div>

      {/* search + filters */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-wrap items-center gap-3 rounded-2xl border border-orange-100 bg-white px-3 py-3"
      >
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search trainers by name or focus..."
            className="w-full border-none outline-none text-sm text-slate-900 placeholder:text-slate-400 bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filterSpecialization}
          onChange={(e) => setFilterSpecialization(e.target.value)}
          className="text-xs rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700"
        >
          <option value="">All specializations</option>
          <option value="weight-loss">Weight loss</option>
          <option value="muscle-gain">Muscle gain</option>
          <option value="strength">Strength</option>
          <option value="endurance">Endurance</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700"
        >
          <option value="followers">Most followed</option>
          <option value="experience">Most experienced</option>
          <option value="popular">Most popular</option>
          <option value="createdAt">Newest</option>
        </select>

        <button
          type="submit"
          className="text-xs font-semibold rounded-full bg-orange-500 text-white px-4 py-1.5 hover:bg-orange-600"
        >
          Apply
        </button>
      </form>

      {apiError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span>{apiError}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        </div>
      ) : trainers.length === 0 ? (
        <div className="rounded-2xl border border-orange-100 bg-white p-5 text-sm text-slate-600">
          No trainers found. Try changing filters or search text.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {trainers.map((t) => (
            <TrainerCard key={t._id} trainer={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function TrainerCard({ trainer }) {
  const [isFollowing, setIsFollowing] = useState(!!trainer.isFollowing);
  const [pending, setPending] = useState(false);

  const handleToggleFollow = async () => {
    if (pending) return;
    setPending(true);
    try {
      if (isFollowing) {
        await followService.unfollowUser(trainer._id);
        setIsFollowing(false);
      } else {
        await followService.followUser(trainer._id);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPending(false);
    }
  };

  const followerText = followUtils.formatFollowerCount(
    trainer.followersCount || 0
  );

  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 flex gap-3">
      <div className="w-14 h-14 rounded-full overflow-hidden bg-orange-50 flex items-center justify-center text-sm font-semibold text-orange-600">
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

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/user-dashboard/trainers/${trainer._id}`}
              className="text-sm font-semibold text-slate-900 hover:text-orange-600 truncate"
            >
              {trainer.name}
            </Link>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <Users className="w-3 h-3 text-slate-400" />
              <span>{followerText} followers</span>
            </p>
            {trainer.bio && (
              <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                {trainer.bio}
              </p>
            )}
            {Array.isArray(trainer.specializations) &&
              trainer.specializations.length > 0 && (
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>
                    {trainer.specializations.slice(0, 3).join(" · ")}
                    {trainer.specializations.length > 3 && " · ..."}
                  </span>
                </p>
              )}
          </div>

          <button
            type="button"
            onClick={handleToggleFollow}
            disabled={pending}
            className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${
              isFollowing
                ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                : "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </div>
  );
}
