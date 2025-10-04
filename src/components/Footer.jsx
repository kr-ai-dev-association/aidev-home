import React from 'react';
// import logo from '../assets/logo.png'; // 로고 이미지 임포트 (더 이상 사용하지 않으므로 주석 처리 또는 삭제)

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        {/* <img src={logo} alt="AIDEV Logo" className="footer-logo" /> 로고 삭제 */}
        <div className="footer-info">
          <p><strong>사단법인 한국인공지능개발자협회</strong></p>
          <p>주소 : 서울시 강남구 삼성로 86길 16 덕산빌딩 5층</p>
          <p>전화 : 02-000-0000</p>
          <p>이메일 : sangoh@aidevkr.org</p>
          <p>대표이사 : 송상오</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;