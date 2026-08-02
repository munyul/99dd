import { useState } from 'react'
import { useNavigate } from 'react-router'
import DeviceShell from '../../components/layout/DeviceShell.jsx'
import Header from '../../components/layout/Header.jsx'

const CONSULTATION_OPTIONS = [
  {
    id: 'labor-attorney',
    icon: 'support_agent',
    iconClassName: 'expert-option-icon-highlight',
    title: '노무사 무료 상담 연결',
    description: '공인노무사와 1:1 채팅 상담',
  },
  {
    id: 'employment-center',
    icon: 'phone_in_talk',
    title: '고용노동부 상담센터',
    description: '국번없이 1350 · 평일 9시~18시',
  },
  {
    id: 'complaint-help',
    icon: 'edit_document',
    title: '노동청 진정서 작성 도움',
    description: '분석 결과 기반 자동 작성',
  },
]

const FAQS = [
  {
    id: 'fee',
    question: '상담료가 있나요?',
    answer: '노무사 무료 상담 연결은 무료로 이용할 수 있어요. 상담 내용과 범위에 따라 추가 서비스가 필요한 경우에는 상담 전에 별도로 안내해 드려요.',
  },
  {
    id: 'privacy',
    question: '상담 내용이 회사에 알려지나요?',
    answer: '아니요. 상담 내용은 본인과 상담 전문가만 확인할 수 있으며, 사용자의 동의 없이 회사에 전달되지 않아요.',
  },
]

function ProfessionalFeedbackContent({
  onLaborAttorneyClick,
  onEmploymentCenterClick,
  onComplaintHelpClick,
}) {
  const [openFaqId, setOpenFaqId] = useState(null)

  const handlers = {
    'labor-attorney': onLaborAttorneyClick,
    'employment-center': onEmploymentCenterClick,
    'complaint-help': onComplaintHelpClick,
  }

  function toggleFaq(faqId) {
    setOpenFaqId((currentId) => (currentId === faqId ? null : faqId))
  }

  return (
    <div className="expert-consultation-page">
      <section className="expert-intro" aria-labelledby="expert-consultation-title">
        <p>혼자 판단하기 어렵다면<br />전문가의 도움을 받아보세요</p>
      </section>

      <section className="expert-option-list" aria-label="상담 방법">
        {CONSULTATION_OPTIONS.map((option) => (
          <button
            key={option.id}
            className="expert-option-card"
            type="button"
            onClick={handlers[option.id]}
          >
            <span className={`expert-option-icon ${option.iconClassName ?? ''}`} aria-hidden="true">
              <span className="msr">{option.icon}</span>
            </span>
            <span className="expert-option-copy">
              <strong>{option.title}</strong>
              <span>{option.description}</span>
            </span>
            <span className="msr expert-option-arrow" aria-hidden="true">chevron_right</span>
          </button>
        ))}
      </section>

      <section className="expert-faq" aria-labelledby="expert-faq-title">
        <h2 id="expert-faq-title">자주 묻는 질문</h2>
        <div className="expert-faq-list">
          {FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id

            return (
              <article className={`expert-faq-item ${isOpen ? 'is-open' : ''}`} key={faq.id}>
                <button
                  className="expert-faq-question"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span>{faq.question}</span>
                  <span className="msr" aria-hidden="true">expand_more</span>
                </button>
                {isOpen && (
                  <p id={`faq-answer-${faq.id}`} className="expert-faq-answer">
                    {faq.answer}
                  </p>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default function ProfessionalFeedbackPage({
  onLaborAttorneyClick,
  onEmploymentCenterClick,
  onComplaintHelpClick,
}) {
  const navigate = useNavigate()

  return (
    <DeviceShell>
      <Header
        title="전문가 상담"
        leftIcon="arrow_back"
        onLeftClick={() => navigate(-1)}
      />
      <main className="content-slot">
        <ProfessionalFeedbackContent
          onLaborAttorneyClick={onLaborAttorneyClick ?? (() => navigate('/'))}
          onEmploymentCenterClick={onEmploymentCenterClick ?? (() => navigate('/'))}
          onComplaintHelpClick={onComplaintHelpClick ?? (() => navigate('/'))}
        />
      </main>
    </DeviceShell>
  )
}
