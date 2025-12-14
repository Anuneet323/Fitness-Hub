// src/pages/User/Community.jsx - Complete working code
import React, { useEffect, useState } from "react";
import { postService } from "../../services/postService";
import { followService } from "../../services/followService";
import { Loader2, Heart, MessageCircle, X, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function UserCommunity() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isTrainer = user?.role === "trainer";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likeLoading, setLikeLoading] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [followingMap, setFollowingMap] = useState({});

  const loadFeed = async (pageToLoad = 1) => {
    try {
      setLoading(true);
      setApiError("");
      const data = await postService.getFeedPosts({
        page: pageToLoad,
        limit: 20,
      });
      setPosts(data.posts || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || pageToLoad);
    } catch (err) {
      console.error(err);
      setApiError("Failed to load community posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed(1);
  }, []);

  const handleToggleLike = async (postId) => {
    if (likeLoading === postId || !user) return;
    setLikeLoading(postId);
    try {
      const res = await postService.toggleLike(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likesCount: res.likesCount, isLiked: res.isLiked }
            : p
        )
      );
      if (selectedPost?._id === postId) {
        setSelectedPost((prev) =>
          prev
            ? { ...prev, likesCount: res.likesCount, isLiked: res.isLiked }
            : prev
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoading(null);
    }
  };

  const handleOpenPost = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleToggleFollowTrainer = async (trainerId) => {
    if (!trainerId || followLoading || !user) return;
    setFollowLoading(true);
    try {
      const isFollowing = !!followingMap[trainerId];
      if (isFollowing) {
        await followService.unfollowUser(trainerId);
      } else {
        await followService.followUser(trainerId);
      }
      setFollowingMap((prev) => ({
        ...prev,
        [trainerId]: !isFollowing,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with Create Post button for trainers */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Community</h1>
          <p className="text-sm text-slate-600">
            Discover posts from trainers you follow.
          </p>
        </div>
        {isTrainer && (
          <Link
            to="/trainer-dashboard/community/create-post"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Post
          </Link>
        )}
      </div>

      {apiError && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-orange-100 bg-white p-6 text-sm text-slate-600 text-center">
          No posts in your feed yet.{" "}
          {isTrainer
            ? "Create your first post!"
            : "Follow some trainers to see their posts."}
        </div>
      ) : (
        <>
          {/* Masonry layout */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {posts.map((post) => (
              <button
                key={post._id}
                type="button"
                onClick={() => handleOpenPost(post)}
                className="w-full text-left break-inside-avoid rounded-2xl border border-orange-100 bg-white hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Media */}
                {Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0 ? (
                  post.mediaType === "video" ? (
                    <video
                      src={post.mediaUrls[0]}
                      className="w-full max-h-72 object-cover"
                      muted
                      controls={false}
                    />
                  ) : (
                    <img
                      src={post.mediaUrls[0]}
                      alt={post.content?.slice(0, 40) || "Post"}
                      className="w-full object-cover"
                    />
                  )
                ) : null}

                <div className="p-3 space-y-2">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-50 overflow-hidden flex items-center justify-center text-[10px] font-semibold text-orange-600">
                      {post.authorId?.avatarUrl ? (
                        <img
                          src={post.authorId.avatarUrl}
                          alt={post.authorId.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (post.authorId?.name || "?")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {post.authorId?.name || "Trainer"}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Content snippet */}
                  {post.content && (
                    <p className="text-xs text-slate-700 line-clamp-3">
                      {post.content}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <div className="inline-flex items-center gap-1">
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          post.isLiked ? "fill-orange-500 text-orange-500" : ""
                        }`}
                      />
                      <span>{post.likesCount || 0}</span>
                    </div>
                    <div className="inline-flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.commentsCount || 0}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4 text-xs">
              <button
                onClick={() => loadFeed(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1 rounded-full border border-slate-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-slate-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => loadFeed(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded-full border border-slate-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Post Details Modal */}
      {selectedPost && (
        <PostDetailsModal
          post={selectedPost}
          onClose={handleCloseModal}
          onToggleLike={handleToggleLike}
          likeLoading={likeLoading}
          followingMap={followingMap}
          onToggleFollowTrainer={handleToggleFollowTrainer}
          followLoading={followLoading}
        />
      )}
    </div>
  );
}

function PostDetailsModal({
  post,
  onClose,
  onToggleLike,
  likeLoading,
  followingMap,
  onToggleFollowTrainer,
  followLoading,
}) {
  const trainerId = post.authorId?._id;
  const isFollowing = !!followingMap[trainerId];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full mx-3 max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        {/* Media */}
        {Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0 ? (
          <div className="md:w-1/2 bg-black flex items-center justify-center">
            {post.mediaType === "video" ? (
              <video
                src={post.mediaUrls[0]}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={post.mediaUrls[0]}
                alt="Post media"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        ) : null}

        {/* Info */}
        <div className="flex-1 flex flex-col p-4 space-y-3">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Trainer Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-50 overflow-hidden flex items-center justify-center text-[11px] font-semibold text-orange-600">
                {post.authorId?.avatarUrl ? (
                  <img
                    src={post.authorId.avatarUrl}
                    alt={post.authorId.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (post.authorId?.name || "T")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                )}
              </div>
              <div>
                <Link
                  to={`/user-dashboard/trainers/${trainerId}`}
                  className="text-xs font-semibold text-slate-900 hover:text-orange-600"
                  onClick={onClose}
                >
                  {post.authorId?.name || "Trainer"}
                </Link>
                <p className="text-[11px] text-slate-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {trainerId && (
              <button
                type="button"
                onClick={() => onToggleFollowTrainer(trainerId)}
                disabled={followLoading}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  isFollowing
                    ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                    : "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                } ${followLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {/* Content */}
          {post.content && (
            <p className="text-sm text-slate-800 whitespace-pre-line">
              {post.content}
            </p>
          )}

          {/* Hashtags */}
          {Array.isArray(post.hashtags) && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-orange-50 text-[11px] text-orange-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-auto pt-2 flex items-center justify-between text-xs text-slate-600">
            <button
              type="button"
              onClick={() => onToggleLike(post._id)}
              disabled={likeLoading === post._id}
              className="inline-flex items-center gap-1 text-slate-700 hover:text-orange-600 disabled:opacity-50"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  post.isLiked ? "fill-orange-500 text-orange-500" : ""
                }`}
              />
              <span>{post.likesCount || 0} likes</span>
            </button>
            <div className="inline-flex items-center gap-1 text-slate-500">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentsCount || 0} comments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
