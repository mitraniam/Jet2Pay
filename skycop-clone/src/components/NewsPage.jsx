import { useTranslation } from 'react-i18next'
import './NewsPage.css'

const NEWS_ARTICLES = [
  {
    id: 1,
    date: '2026-03-15',
    category: 'news.categories.companyNews',
    titleKey: 'news.articles.launch.title',
    summaryKey: 'news.articles.launch.summary',
    icon: '🚀',
  },
  {
    id: 2,
    date: '2026-03-10',
    category: 'news.categories.regulation',
    titleKey: 'news.articles.ec261Update.title',
    summaryKey: 'news.articles.ec261Update.summary',
    icon: '⚖️',
  },
  {
    id: 3,
    date: '2026-03-05',
    category: 'news.categories.tips',
    titleKey: 'news.articles.knowYourRights.title',
    summaryKey: 'news.articles.knowYourRights.summary',
    icon: '📚',
  },
  {
    id: 4,
    date: '2026-02-28',
    category: 'news.categories.tips',
    titleKey: 'news.articles.delayTips.title',
    summaryKey: 'news.articles.delayTips.summary',
    icon: '⏱️',
  },
  {
    id: 5,
    date: '2026-02-20',
    category: 'news.categories.regulation',
    titleKey: 'news.articles.uk261.title',
    summaryKey: 'news.articles.uk261.summary',
    icon: '🇬🇧',
  },
  {
    id: 6,
    date: '2026-02-15',
    category: 'news.categories.companyNews',
    titleKey: 'news.articles.partnerships.title',
    summaryKey: 'news.articles.partnerships.summary',
    icon: '🤝',
  },
]

export default function NewsPage({ onCheckCompensation }) {
  const { t } = useTranslation()

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'long', year: 'numeric'
    })
  }

  return (
    <div className="news">
      {/* Hero */}
      <section className="news__hero">
        <div className="container">
          <h1 className="news__hero-title">{t('news.hero.title')}</h1>
          <p className="news__hero-subtitle">{t('news.hero.subtitle')}</p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="news__featured">
        <div className="container">
          <div className="news__featured-card">
            <div className="news__featured-badge">{t('news.featured')}</div>
            <div className="news__featured-content">
              <div className="news__featured-icon">🚀</div>
              <div>
                <span className="news__article-category">{t('news.categories.companyNews')}</span>
                <h2 className="news__featured-title">{t('news.articles.launch.title')}</h2>
                <p className="news__featured-summary">{t('news.articles.launch.summary')}</p>
                <span className="news__article-date">{formatDate('2026-03-15')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="news__section">
        <div className="container">
          <h2 className="news__section-title">{t('news.allArticles')}</h2>
          <div className="news__grid">
            {NEWS_ARTICLES.map(article => (
              <article key={article.id} className="news__card">
                <div className="news__card-icon">{article.icon}</div>
                <span className="news__article-category">{t(article.category)}</span>
                <h3 className="news__card-title">{t(article.titleKey)}</h3>
                <p className="news__card-summary">{t(article.summaryKey)}</p>
                <div className="news__card-footer">
                  <span className="news__article-date">{formatDate(article.date)}</span>
                  <span className="news__read-more">{t('news.readMore')} →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="news__cta">
        <div className="container">
          <div className="news__cta-card">
            <div className="news__cta-content">
              <h2>{t('news.cta.title')}</h2>
              <p>{t('news.cta.text')}</p>
            </div>
            <button className="news__cta-btn" onClick={onCheckCompensation}>
              {t('news.cta.button')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
