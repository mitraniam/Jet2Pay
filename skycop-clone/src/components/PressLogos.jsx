import './PressLogos.css'

const PressLogos = () => {
  const logos = [
    { name: 'Forbes', color: '#000' },
    { name: 'AeroTime', color: '#333' },
    { name: 'Aviation Voice', color: '#333' },
    { name: 'Aviation Pros', color: '#333' },
    { name: '50 Sky Shades', color: '#333' },
  ]

  return (
    <section className="press-logos">
      <div className="container">
        <p className="press-logos__label">As featured in</p>
        <div className="press-logos__grid">
          {logos.map((logo) => (
            <div key={logo.name} className="press-logos__item">
              <span className="press-logos__text" style={{ color: logo.color }}>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PressLogos
