import './TravelCare.css'

const TravelCare = () => {
  const features = [
    { icon: '🛋️', title: 'Lounge access', desc: 'Access to airport lounges worldwide' },
    { icon: '💯', title: '100% compensation', desc: 'Get full compensation without any fees' },
    { icon: '🧳', title: 'Luggage protection', desc: 'Up to €1,000 for lost luggage' },
    { icon: '📱', title: 'eSIM data', desc: 'Stay connected while traveling' },
  ]

  return (
    <section className="travel-care">
      <div className="container">
        <div className="travel-care__card">
          <div className="travel-care__content">
            <div className="travel-care__badge">New</div>
            <h2 className="travel-care__title">Get a Free Travel Care trial</h2>
            <p className="travel-care__desc">
              Premium travel protection that covers flight disruptions, luggage issues, and more.
            </p>
            <div className="travel-care__features">
              {features.map((f, i) => (
                <div key={i} className="travel-care__feature">
                  <span className="travel-care__feature-icon">{f.icon}</span>
                  <div>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-primary travel-care__btn">Start Free Trial</button>
          </div>
          <div className="travel-care__image">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=500&fit=crop"
              alt="Travel Care"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TravelCare
