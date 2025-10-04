import React, { useEffect } from 'react';
import vibeCodingTop from '../assets/vibe coding.png'; // vibe coding 이미지 임포트
import ideImage from '../assets/IDE.png'; // IDE 이미지 임포트
import '../App.css'; // 공통 스타일을 위해 App.css 임포트

function DownloadPage({ scrollToSectionId, onScrollComplete }) {
  // scrollToSectionId prop이 변경될 때 해당 섹션으로 스크롤하는 useEffect
  useEffect(() => {
    if (scrollToSectionId) {
      const element = document.getElementById(scrollToSectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // 스크롤이 완료되면 부모 컴포넌트에 알림
        if (onScrollComplete) {
          onScrollComplete();
        }
      }
    }
  }, [scrollToSectionId, onScrollComplete]);

  return (
    <>
      {/* 다운로드 페이지 상단 배너 - vibe coding.png 이미지 사용 */}
      <section className="download-page-banner" id="download-intro-section" style={{ backgroundImage: `url(${vibeCodingTop})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h2>VSCode 기반 Vibe Coding 툴을 무료로 사용해 보세요.</h2>
          <p>AIDEV-IDE 는 협회원 모두가 함께 만들어가는 오픈소스 프로젝트 입니다.</p>
        </div>
      </section>

      {/* 첫 번째 콘텐츠 컨테이너 */}
      <div className="download-page-container home-page-container">
        {/* section-ide-image 섹션 제거 */}

        <section className="section-ide-description">
          <h3>코딩의 미래를 엿보다: AI 기반 개발의 혁신, Gemini 2.5 Pro Flash와 Ollama의 만남!</h3>
          <p>기술의 발전은 멈추지 않으며, 특히 소프트웨어 개발 분야는 AI의 등장으로 전에 없던 혁신을 맞이하고 있습니다. 오늘 우리는 이 모든 것을 한데 묶어 개발자에게 궁극의 생산성과 효율성을 선사할 새로운 AI 기반 코드 어시스턴스를 소개합니다. 이름하여, Gemini 2.5 Pro Flash와 Ollama 통합 코드 어시스턴스!</p>
          {/* 요청된 위치에 이미지 삽입 */}
          <img src={ideImage} alt="IDE Interface" className="ide-inline-image" /> {/* 클래스 변경 */}

          <h4>🤖 AI 기반 코드 어시스턴스: 지능적인 개발 동반자</h4>
          <p>이 어시스턴스의 핵심은 바로 강력한 AI 엔진에 있습니다.</p>
          <ul>
            <li><strong>멀티모델 AI 지원:</strong> 단순히 하나의 AI에 의존하는 시대는 지났습니다. Google의 최첨단 LLM인 Gemini 2.5 Pro Flash는 지능적인 코드 생성과 분석의 정점을 보여주며, Ollama 통합을 통해 로컬 환경에서도 강력한 AI 처리가 가능합니다. 여기에 Gemma3:27b (128K 토큰), DeepSeek R1:70B (200K 토큰), 그리고 코드 생성에 최적화된 <strong>CodeLlama 7B (8K 토큰)</strong>까지, 개발 목적에 맞춰 최적의 모델을 선택할 수 있는 유연성을 제공합니다. 특히 DeepSeek R1:70B는 한국어에 최적화되어 국내 개발자들에게 희소식이 될 것입니다.</li>
            <li><strong>동적 모델 선택:</strong> 클라우드 기반 모델과 로컬 Ollama 서버 간의 전환이 설정에서 자유롭게 이루어져, 인터넷 연결 여부와 관계없이 최고의 AI 지원을 받을 수 있습니다.</li>
            <li><strong>듀얼 모드 인터페이스:</strong> 개발자의 다양한 니즈를 충족시키기 위해 'CODE' 탭과 'ASK' 탭으로 나뉘어 있습니다. 'CODE' 탭은 코드 생성, 수정, 프로젝트 작업에 특화되어 있으며, 'ASK' 탭은 일반 Q&A 및 실시간 정보 질의에 최적화되어 있습니다.</li>
            <li><strong>맥락 인식 응답:</strong> 이 어시스턴스는 단순히 코드를 나열하는 것이 아니라, 프로젝트 구조와 기존 코드를 깊이 있게 분석하여 맥락에 가장 관련성 높은 제안을 제공합니다. 마치 옆에 유능한 시니어 개발자가 앉아 있는 것과 같습니다.</li>
            <li><strong>자연어 처리:</strong> 복잡한 요청도 자연어로 쉽게 전달할 수 있어, 기술적인 지식뿐만 아니라 비즈니스 로직에 대한 설명만으로도 코드를 생성할 수 있습니다.</li>
            <li><strong>로컬 AI 처리:</strong> Ollama 통합으로 완전한 오프라인 기능이 제공되어, 보안이 중요한 환경이나 인터넷 연결이 불안정한 상황에서도 개발 작업을 이어나갈 수 있습니다.</li>
          </ul>

          <h4>📁 고급 파일 관리: 프로젝트를 내 손안에</h4>
          <p>프로젝트 관리의 복잡성을 해소하고 개발 흐름을 끊김 없이 이어갈 수 있도록 강력한 파일 관리 기능이 탑재되었습니다.</p>
          <ul>
            <li><strong>스마트 파일 선택:</strong> @ 버튼 하나로 특정 파일을 선택해 AI에 맥락으로 제공할 수 있습니다.</li>
            <li><strong>CODE 탭의 전체 파일 작업:</strong> 'CODE' 탭에서는 맥락 인식 코드 생성 및 수정을 위해 프로젝트의 전체 파일을 AI가 이해하고 작업할 수 있습니다.</li>
            <li><strong>ASK 탭의 파일 선택 (읽기 전용):</strong> 'ASK' 탭에서도 파일 선택을 통해 맥락 인식 질의가 가능하지만, 파일 작업은 읽기 전용으로 제한됩니다.</li>
            <li><strong>지속적 파일 컨텍스트:</strong> 한 번 선택한 파일은 여러 대화에서 계속 유지되어 반복적인 파일 선택의 번거로움을 줄여줍니다.</li>
            <li><strong>다중 파일 작업:</strong> 여러 파일을 동시에 생성, 수정, 삭제하는 기능을 지원하여 대규모 프로젝트 작업도 효율적으로 처리할 수 있습니다.</li>
            <li><strong>프로젝트 루트 설정:</strong> 정확한 파일 작업을 위해 프로젝트의 루트 경로를 설정할 수 있습니다.</li>
            <li><strong>자동 파일 업데이트:</strong> AI 제안에 따라 파일을 자동으로 생성하거나 수정하는 옵션은 개발 시간을 획기적으로 단축시켜줍니다.</li>
            <li><strong>파일 태그 관리:</strong> 시각적인 파일 태그를 통해 선택된 파일을 쉽게 관리하고 개별 제거 또는 전체 삭제할 수 있습니다.</li>
          </ul>

          <h4>🖼️ 시각적 코드 분석: 이제 AI가 스크린샷도 이해한다!</h4>
          <p>코드 디버깅과 분석의 새로운 지평이 열렸습니다.</p>
          <ul>
            <li><strong>이미지 지원:</strong> 코드 분석 및 디버깅을 위해 이미지를 업로드할 수 있습니다. 더 이상 복잡한 에러 메시지를 일일이 설명할 필요가 없습니다.</li>
            <li><strong>드래그&amp;드롭 인터페이스:</strong> 클립보드 붙여넣기 또는 드래그&amp;드롭으로 이미지를 손쉽게 첨부할 수 있습니다.</li>
            <li><strong>시각적 맥락:</strong> AI가 스크린샷, 다이어그램, 그리고 심지어 코드 이미지를 분석하여 문제의 원인을 파악하고 해결책을 제시합니다.</li>
          </ul>
        </section>
      </div>
    </>
  );
}

export default DownloadPage;