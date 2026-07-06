"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import { usePost } from "@/hooks/usePost";
import PostCard from "@/app/components/PostCard";

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: post, isLoading, error } = usePost(id);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-primary">
        <Loader />
      </div>
    );
  if (error || !post) return <p className="text-center py-6">Post não encontrado.</p>;

  return (
    <div className="max-w-md mx-auto py-6">
      <PostCard post={post} onDeleted={() => router.push("/")} />
    </div>
  );
}
