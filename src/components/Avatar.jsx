import React from 'react';
import './Avatar.css';
import defaultAvatar from '../assets/avatar-default.svg';
import superAdminAvatar from '../assets/avatar-superadmin.svg';

// 프로필 아바타
//  · isSuperAdmin: 사용자가 지정한 아바타가 있어도 왕관 아바타로 강제 대체
//  · isAdmin(수퍼관리자 아님): 본인 아바타 좌측 하단에 왕관 아이콘 오버레이
function Avatar({ src, isSuperAdmin = false, isAdmin = false, size = 40, className = '', alt = '프로필' }) {
  const url = isSuperAdmin ? superAdminAvatar : (src || defaultAvatar);
  const showCrown = isAdmin && !isSuperAdmin;
  const crownSize = Math.max(12, Math.round(size * 0.42));
  return (
    <span className={`avatar ${className}`} style={{ width: size, height: size }}>
      <img src={url} alt={alt} className="avatar-img" />
      {showCrown && (
        <span
          className="avatar-crown"
          aria-hidden="true"
          style={{ width: crownSize, height: crownSize, fontSize: Math.round(crownSize * 0.7) }}
          title="관리자"
        >👑</span>
      )}
    </span>
  );
}

export default Avatar;
