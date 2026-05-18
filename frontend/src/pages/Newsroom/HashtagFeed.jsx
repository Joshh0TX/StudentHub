import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostItem from './postItem';

export default function HashtagFeed({ user }) {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/hashtag/${tag}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, [tag]);

  return (
    <div className="amebo-main-feed">
      <h2 style={{ padding: '16px 0', color: '#1e293b' }}>#{tag}</h2>
      {posts.map((p) => (
        <PostItem key={p.id} post={{
          id: p.id,
          userId: p.user.id,
          userName: `${p.user.f_name} ${p.user.l_name}`,
          userImg: p.user.profileImage || `https://ui-avatars.com/api/?name=${p.user.f_name}+${p.user.l_name}&background=3b82f6&color=fff`,
          timestamp: new Date(p.createdAt).toLocaleString(),
          content: p.content,
          postImage: p.image,
          postVideo: p.video,
          likes: 0,
          comments: 0,
        }} currentUser={user} />
      ))}
    </div>
  );
}